import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { pick, types as DocumentPickerTypes } from '@react-native-documents/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { RiskContext } from '../context/RiskContext';

type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;
type ChatNav   = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const PRIMARY_BLUE = '#007AFF';
const LIGHT_BG     = '#F5F7FA';
const ALERT_BG     = '#FFCDD2';   // 연한 빨강

/* 위험도 색상 보간 */
function getRiskColor(p: number) {
  p = Math.max(0, Math.min(100, p));
  const r = 238 + (255 - 238) * p / 100;
  const g = 238 + ( 59 - 238) * p / 100;
  const b = 238 + ( 48 - 238) * p / 100;
  return `rgb(${r},${g},${b})`;
}

interface Message {
  id:           string;
  from:         'me' | 'contact';
  text:         string;
  isPhishing?:  boolean;
  safePercent?: number;
}

const ChatScreen: React.FC = () => {
  const { riskNumbers, setRiskNumbers } = useContext(RiskContext);
  const route        = useRoute<ChatRoute>();
  const navigation   = useNavigation<ChatNav>();
  const contact      = route.params.contact;

  /* ─── 상태 ─── */
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [voiceRisk,  setVoiceRisk]  = useState(0);   // 피싱 평균 위험도 %
  const [deepPercent,setDeepPercent]= useState(0);   // 딥보이스 위험도 %
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [riskNumber,   setRiskNumber]   = useState('');
  const [isChecked,    setIsChecked]    = useState(false);

  /* EditRisk 반영 */
  useEffect(() => {
    if (route.params.updatedRiskNumbers) setRiskNumbers(route.params.updatedRiskNumbers);
  }, [route.params.updatedRiskNumbers]);

  /* 위험번호 추가 */
  const handleAddRiskNumber = () => {
    if (riskNumber.trim()) setRiskNumbers(prev => [...prev, riskNumber.trim()]);
    setRiskNumber(''); setIsAddingRisk(false); navigation.navigate('EditRisk');
  };

  /* 파일 선택 및 분석 */
  const handlePickAndUpload = async () => {
    try {
      const [res] = await pick({
        type: [DocumentPickerTypes.audio],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });
      const { uri, name } = res;

      /* formData 구성 (헤더 X) */
      const form = new FormData();
      form.append('file', { uri, name, type: 'audio/wav' } as any);

      /* ── ① 딥보이스 서버 ── */
      const deepRes = await fetch('http://1.229.246.105:20000/predict', { method: 'POST', body: form });
      const deepTxt = await deepRes.text();
      let deepJson: any;
      try { deepJson = JSON.parse(deepTxt); }
      catch {
        console.error('딥보이스 서버 원문:', deepTxt);
        Alert.alert('딥보이스 분석 실패', deepTxt.slice(0, 120) + '…');
        return;
      }
      /** deepJson = {result: "...", probability: "0.93", filename: "..."} */
      const prob   = Math.round(parseFloat(deepJson.probability) * 100);
      setDeepPercent(prob);

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now()),
          from: 'contact',
          text: `딥보이스 분석 결과 → ${prob}% (${deepJson.result})`,
        },
      ]);

      /* ── ② 보이스피싱 서버 ── */
      const phishRes = await fetch('http://1.229.246.105:20001/analyze/', { method: 'POST', body: form });
      const phishTxt = await phishRes.text();
      let phishJson: any;
      try { phishJson = JSON.parse(phishTxt); }
      catch {
        console.error('보이스피싱 서버 원문:', phishTxt);
        Alert.alert('보이스피싱 분석 실패', phishTxt.slice(0, 120) + '…');
        return;
      }

      const incoming: Message[] = phishJson.results.map((r: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        from: 'contact',
        text: r.sentence,
        isPhishing: r.is_phishing,
        safePercent: Math.round((1 - r.score) * 100),
      }));
      setMessages(prev => [...prev, ...incoming]);

      const phishingScores = phishJson.results.filter((r: any) => r.is_phishing)
        .map((r: any) => r.score * 100);
      if (phishingScores.length) {
        const avgRisk = Math.round(phishingScores.reduce((a: number, b: number) => a + b) / phishingScores.length);
        setVoiceRisk(avgRisk);
      }
    } catch (err: any) {
      if (err.code !== 'USER_CANCELED') console.error(err);
    }
  };

  /* ─── 렌더 ─── */
  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contact.name}</Text>
        <TouchableOpacity onPress={handlePickAndUpload}>
          <Icon name="mic-outline" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 채팅 버블 */}
        {messages.map(m => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.from === 'me' ? styles.bubbleMe : styles.bubbleYou,
              m.isPhishing && styles.bubblePhish,
            ]}
          >
            <Text style={m.from === 'me' ? styles.meText : styles.youText}>{m.text}</Text>
            {m.safePercent != null && (
              <Text style={styles.safeScoreText}>비-피싱 확률 {m.safePercent}%</Text>
            )}
          </View>
        ))}

        {/* 분석 패널 */}
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>위험 통화 분석</Text>

          {/* 보이스피싱 위험도 */}
          <View style={styles.riskRow}>
            <Text style={styles.riskLabel}>보이스피싱 위험도</Text>
            <View style={styles.riskBarBackground}>
              <View style={[styles.riskBarFill, { backgroundColor: getRiskColor(voiceRisk), flex: voiceRisk / 100 }]}>
                <Text style={styles.riskBarText}>{voiceRisk}%</Text>
              </View>
              <View style={{ flex: (100 - voiceRisk) / 100 }} />
            </View>
          </View>

          {/* 딥보이스 위험도 */}
          <View style={styles.riskRow}>
            <Text style={styles.riskLabel}>딥보이스 위험도</Text>
            <View style={styles.riskBarBackground}>
              <View style={[styles.riskBarFill, { backgroundColor: getRiskColor(deepPercent), flex: deepPercent / 100 }]}>
                <Text style={styles.riskBarText}>{deepPercent}%</Text>
              </View>
              <View style={{ flex: (100 - deepPercent) / 100 }} />
            </View>
          </View>

          {/* 위험번호 추가 UI */}
          {!isAddingRisk ? (
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingRisk(true)}>
              <Text style={styles.addButtonText}>+ 위험번호로 추가하기</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.inputRiskRow}>
              <TextInput
                style={styles.riskInputBox}
                placeholder="전화번호 입력"
                keyboardType="phone-pad"
                value={riskNumber}
                onChangeText={setRiskNumber}
              />
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddRiskNumber}>
                <Text style={styles.confirmButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 공유 체크박스 */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}
              onPress={() => setIsChecked(p => !p)}
            >
              {isChecked && <Icon name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>위험 번호로 승인 및 공유하기</Text>
          </View>

          {/* 위험번호 관리 */}
          <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate('EditRisk')}>
            <Text style={styles.manageButtonText}>위험번호 관리</Text>
          </TouchableOpacity>

          {/* 미리보기 */}
          {riskNumbers.length > 0 && (
            <View style={styles.previewContainer}>
              {riskNumbers.map(n => (
                <Text key={n} style={styles.previewText}>{n}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 입력창 (미구현) */}
      <View style={styles.inputRow}>
        <Icon name="add" size={24} color={PRIMARY_BLUE} />
        <TextInput style={styles.inputBox} placeholder="Type a message…" />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

/* ─── 스타일 ─── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  headerTitle: { fontSize: 16, fontWeight: '600' },

  content: { padding: 16 },

  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12, marginBottom: 8 },
  bubbleMe:  { alignSelf: 'flex-end', backgroundColor: PRIMARY_BLUE },
  bubbleYou: { alignSelf: 'flex-start', backgroundColor: LIGHT_BG },
  bubblePhish: { backgroundColor: ALERT_BG },
  meText:  { color: '#fff' },
  youText: { color: '#000' },
  safeScoreText: { marginTop: 4, fontSize: 10, color: '#555' },

  analysisContainer: { marginTop: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  analysisTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },

  riskRow: { marginBottom: 12 },
  riskLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4, color: '#333' },
  riskBarBackground: { flexDirection: 'row', height: 24, borderRadius: 12, backgroundColor: '#EEE', overflow: 'hidden', alignItems: 'center' },
  riskBarFill: { height: '100%', justifyContent: 'center', paddingLeft: 8 },
  riskBarText: { fontSize: 12, fontWeight: '600', color: '#fff' },

  addButton: { marginTop: 8, marginBottom: 12 },
  addButtonText: { fontSize: 13, color: PRIMARY_BLUE, fontWeight: '600' },
  inputRiskRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  riskInputBox: { flex: 1, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, marginRight: 8 },
  confirmButton: { backgroundColor: PRIMARY_BLUE, borderRadius: 18, paddingVertical: 8, paddingHorizontal: 16 },
  confirmButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkboxBox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: PRIMARY_BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  checkboxBoxChecked: { backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE },
  checkboxLabel: { fontSize: 12, color: '#333' },

  manageButton: { marginTop: 8, marginBottom: 12 },
  manageButtonText: { fontSize: 13, color: PRIMARY_BLUE, fontWeight: '600' },

  previewContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  previewText: { backgroundColor: LIGHT_BG, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 8, fontSize: 12 },

  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: LIGHT_BG },
  inputBox: { flex: 1, marginLeft: 8, borderRadius: 20, backgroundColor: LIGHT_BG, paddingHorizontal: 16, height: 36 },
});
