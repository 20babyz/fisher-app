// src/screens/ChatScreen2.tsx
import React, { useState, useContext } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, StyleSheet,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { pick, types as DocumentPickerTypes } from '@react-native-documents/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { CallHistoryContext } from '../context/CallHistoryContext';
import { RiskContext } from '../context/RiskContext';            /* ★ */

type ChatRoute = RouteProp<RootStackParamList, 'Chat2'>;
type ChatNav   = NativeStackNavigationProp<RootStackParamList, 'Chat2'>;

const PRIMARY_BLUE = '#007AFF';
const LIGHT_BG     = '#F5F7FA';
const ALERT_BG     = '#FFCDD2';

/* 위험도 → 빨강 그라데이션 */
const getRiskColor = (p: number) => {
  const t = Math.max(0, Math.min(100, p)) / 100;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(238,255)},${mix(238,59)},${mix(238,48)})`;
};

interface Message {
  id: string; from: 'me' | 'contact'; text: string;
  isPhishing?: boolean; safePercent?: number;
}
interface PhishResult { sentence: string; score: number; is_phishing: boolean }

const ChatScreen2: React.FC = () => {
  const navigation = useNavigation<ChatNav>();
  const { callId, name } = useRoute<ChatRoute>().params;

  const { updateCategory }         = useContext(CallHistoryContext);
  const { riskNumbers, setRiskNumbers } = useContext(RiskContext);     /* ★ */

  /* ─── state ─── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [deepPercent, setDeepPercent] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [isAddingRisk, setIsAddingRisk] = useState(false);            /* ★ */
  const [riskNumber, setRiskNumber]     = useState('');               /* ★ */
  const [isChecked,  setIsChecked]      = useState(false);            /* ★ */

  const avgPhish = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));

  /* 위험도에 따라 태그 결정 */
  const decideCategory = (phish: number, deep: number) => {
    if (phish > 50)       updateCategory(callId, '보이스피싱 의심');
    else if (deep > 50)   updateCategory(callId, '딥보이스 의심');
    else                  updateCategory(callId, '안심 통화');
  };

  /* 위험번호 추가 */
  const handleAddRiskNumber = () => {
    if (!riskNumber.trim()) return;
    setRiskNumbers(prev => [...prev, riskNumber.trim()]);
    setRiskNumber('');
    setIsAddingRisk(false);
  };

  /* 파일 선택 */
  const pickAudio = async () => {
    const [file] = await pick({ type: [DocumentPickerTypes.audio], copyTo: 'cachesDirectory' });
    return file;
  };

  /* 딥보이스 + 피싱 */
  const handleFull = async () => {
    try {
      const { uri, name: fn } = await pickAudio();
      const safeName = fn ?? `audio_${Date.now()}.wav`;

      const fd = new FormData();
      fd.append('file', { uri, name: safeName, type: 'audio/wav' } as any);
      const dj = await (await fetch('http://1.229.246.105:20000/predict', { method: 'POST', body: fd })).json();
      const dPerc = Math.round(parseFloat(dj.probability) * 100);
      setDeepPercent(dPerc);

      await analysePhish(uri, safeName, dPerc);
    } catch (e: any) {
      if (e.code !== 'USER_CANCELED') Alert.alert('에러', String(e));
    }
  };

  /* 피싱만 */
  const handlePhish = async () => {
    try {
      const { uri, name: fn } = await pickAudio();
      const safeName = fn ?? `audio_${Date.now()}.wav`;
      setDeepPercent(0);
      await analysePhish(uri, safeName, 0);
    } catch (e: any) {
      if (e.code !== 'USER_CANCELED') Alert.alert('에러', String(e));
    }
  };

  /* 보이스피싱 분석 */
  const analysePhish = async (uri: string, fileName: string, deepNow: number) => {
    const fp = new FormData();
    fp.append('file', { uri, name: fileName, type: 'audio/wav' } as any);

    const res = await fetch('http://1.229.246.105:20001/analyze/', { method: 'POST', body: fp });
    if (!res.ok) { Alert.alert('보이스피싱 서버 오류', String(res.status)); return; }

    const json = (await res.json()) as { results: PhishResult[] };
    const batchScores = json.results.map(r => r.score * 100);
    setScores(prev => {
      const next = [...prev, ...batchScores];
      decideCategory(Math.max(...next), deepNow);
      return next;
    });

    const newMsgs: Message[] = json.results.map((r, i) => ({
      id: `${Date.now()}-${i}`, from: 'contact', text: r.sentence,
      isPhishing: r.is_phishing, safePercent: Math.round((1 - r.score) * 100),
    }));
    setMessages(prev => [...prev, ...newMsgs]);
  };

  /* ─── UI ─── */
  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity onPress={() => decideCategory(Math.max(...scores), deepPercent)}>
          <Icon name="checkmark-done-outline" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 채팅 버블 */}
        {messages.map(m => (
          <View key={m.id} style={[
            styles.bubble,
            m.from === 'me' ? styles.bMe : styles.bYou,
            m.isPhishing && styles.bPh,
          ]}>
            <Text style={m.from === 'me' ? styles.tMe : styles.tYou}>{m.text}</Text>
            {m.safePercent != null && (
              <Text style={styles.safeTxt}>비-피싱 {m.safePercent}%</Text>
            )}
          </View>
        ))}

        {/* 분석 패널 + 위험번호 UI */}
        <View style={styles.analysis}>
          <Text style={styles.analysisTitle}>위험 통화 분석</Text>
          <Risk label="보이스피싱 위험도" p={avgPhish}/>
          <Risk label="딥보이스 위험도"  p={deepPercent}/>

          {/* ★ 위험번호 추가 UI */}
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

          {/* Checkbox */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}
              onPress={() => setIsChecked(p => !p)}
            >
              {isChecked && <Icon name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>위험 번호로 승인 및 공유하기</Text>
          </View>

          {/* 위험번호 관리 화면으로 이동 */}
          <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate('EditRisk')}>
            <Text style={styles.manageButtonText}>위험번호 관리</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.btnRow}>
        <TouchableOpacity onPress={handleFull}>
          <Icon name="mic-outline" size={32} color={PRIMARY_BLUE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePhish}>
          <Icon name="settings-outline" size={32} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ChatScreen2;

/* Risk Bar */
const Risk = ({ label, p }: { label: string; p: number }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.riskLabel}>{label}</Text>
    <View style={styles.riskBg}>
      <View style={[styles.riskFill, { backgroundColor: getRiskColor(p), flex: p / 100 }]}>
        <Text style={styles.riskTxt}>{p}%</Text>
      </View>
      <View style={{ flex: (100 - p) / 100 }} />
    </View>
  </View>
);

/* 스타일 */
const styles = StyleSheet.create({
  safe:{ flex:1, backgroundColor:'#fff' },
  headerRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16 },
  headerTitle:{ fontSize:16, fontWeight:'600' },

  content:{ padding:16 },

  bubble:{ padding:12, borderRadius:16, marginBottom:8, maxWidth:'75%' },
  bMe:{ alignSelf:'flex-end', backgroundColor:PRIMARY_BLUE },
  bYou:{ alignSelf:'flex-start', backgroundColor:LIGHT_BG },
  bPh:{ backgroundColor:ALERT_BG },
  tMe:{ color:'#fff' }, tYou:{ color:'#000' },
  safeTxt:{ fontSize:10, color:'#555', marginTop:4 },

  analysis:{ marginTop:16, padding:16, borderRadius:12, borderWidth:1, borderColor:'#E0E0E0' },
  analysisTitle:{ fontSize:14, fontWeight:'600', marginBottom:12 },

  riskLabel:{ fontSize:13, fontWeight:'500', marginBottom:4 },
  riskBg:{ flexDirection:'row', height:24, borderRadius:12, backgroundColor:'#EEE', overflow:'hidden', alignItems:'center' },
  riskFill:{ height:'100%', justifyContent:'center', paddingLeft:8 },
  riskTxt:{ fontSize:12, fontWeight:'600', color:'#fff' },

  /* ★ 위험번호 UI 스타일 */
  addButton:{ marginTop:8, marginBottom:12 },
  addButtonText:{ fontSize:13, color:PRIMARY_BLUE, fontWeight:'600' },
  inputRiskRow:{ flexDirection:'row', alignItems:'center', marginTop:8, marginBottom:12 },
  riskInputBox:{ flex:1, height:36, borderRadius:18, borderWidth:1, borderColor:'#ccc', paddingHorizontal:12, marginRight:8 },
  confirmButton:{ backgroundColor:PRIMARY_BLUE, borderRadius:18, paddingVertical:8, paddingHorizontal:16 },
  confirmButtonText:{ color:'#fff', fontSize:14, fontWeight:'600' },

  checkboxRow:{ flexDirection:'row', alignItems:'center', marginBottom:8 },
  checkboxBox:{ width:20, height:20, borderRadius:4, borderWidth:1, borderColor:PRIMARY_BLUE, alignItems:'center', justifyContent:'center', marginRight:8 },
  checkboxBoxChecked:{ backgroundColor:PRIMARY_BLUE, borderColor:PRIMARY_BLUE },
  checkboxLabel:{ fontSize:12, color:'#333' },

  manageButton:{ marginTop:4, marginBottom:12 },
  manageButtonText:{ fontSize:13, color:PRIMARY_BLUE, fontWeight:'600' },

  btnRow:{ flexDirection:'row', justifyContent:'center', gap:32, paddingVertical:12 },
});
