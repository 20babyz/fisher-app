// src/screens/ChatScreen.tsx

import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { pick, types as DocumentPickerTypes } from '@react-native-documents/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, CallItem } from '../App';
import { RiskContext } from '../context/RiskContext';

type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;
type ChatNav   = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const PRIMARY_BLUE = '#007AFF';
const LIGHT_BG     = '#F5F7FA';

function getRiskColor(percent: number): string {
  const p = Math.max(0, Math.min(100, percent));
  const r1 = 238, g1 = 238, b1 = 238;
  const r2 = 255, g2 = 59,  b2 = 48;
  const ratio = p / 100;
  const r     = Math.round(r1 + (r2 - r1) * ratio);
  const g     = Math.round(g1 + (g2 - g1) * ratio);
  const b     = Math.round(b1 + (b2 - b1) * ratio);
  return `rgb(${r},${g},${b})`;
}

interface Message {
  id: string;
  from: 'me' | 'contact';
  text: string;
}

const ChatScreen: React.FC = () => {
  const { riskNumbers, setRiskNumbers } = useContext(RiskContext);
  const route      = useRoute<ChatRoute>();
  const navigation = useNavigation<ChatNav>();
  const contact    = route.params.contact;

  const [voicePercent, setVoicePercent]       = useState(0);
  const [deepPercent,  setDeepPercent]        = useState(0);
  const [deepVoiceMessage, setDeepVoiceMessage] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'contact', text: '현재 대화내용이 없습니다.' },
    { id: '2', from: 'contact', text: '현재 대화내용이 없습니다.' },
    { id: '3', from: 'contact', text: '현재 대화내용이 없습니다.' },
    { id: '4', from: 'contact', text: '현재 대화내용이 없습니다.' },
  ]);

  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [riskNumber,   setRiskNumber]   = useState('');
  const [isChecked,    setIsChecked]    = useState(false);

  // EditRiskScreen 에서 돌아왔을 때 변경된 목록 반영
  useEffect(() => {
    if (route.params.updatedRiskNumbers) {
      setRiskNumbers(route.params.updatedRiskNumbers);
    }
  }, [route.params.updatedRiskNumbers]);

  const handleAddRiskNumber = () => {
    if (riskNumber.trim()) {
      setRiskNumbers(prev => [...prev, riskNumber.trim()]);
    }
    setRiskNumber('');
    setIsAddingRisk(false);
    navigation.navigate('EditRisk');
  };

  const handlePickAndUpload = async () => {
    try {
      const [res] = await pick({
        type: [DocumentPickerTypes.audio],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });
      const { uri, name, type } = res;
      const formData = new FormData();
      formData.append('file', { uri, name, type: type || 'audio/flac' } as any);

      const response = await fetch('http://10.0.2.2:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const json = await response.json();

      const prob = parseFloat(json.probability) * 100;
      setDeepPercent(Math.round(prob));
      const deepMsg = json.result.includes('spoof')
        ? '딥보이스 가능성 있음'
        : '딥보이스 가능성 없음';
      setDeepVoiceMessage(deepMsg);

      setMessages(prev => [
        ...prev,
        { id: String(prev.length + 1), from: 'contact', text: `파일: ${json.filename} → ${deepMsg} (${json.probability})` },
      ]);
    } catch (err: any) {
      if (err.code !== 'USER_CANCELED') console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
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
        {/* Messages */}
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.from === 'me' ? styles.bubbleMe : styles.bubbleYou,
            ]}
          >
            <Text style={msg.from === 'me' ? styles.meText : styles.youText}>
              {msg.text}
            </Text>
          </View>
        ))}

        {/* Analysis */}
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>위험 통화 분석</Text>

          <View style={styles.riskRow}>
            <Text style={styles.riskLabel}>보이스피싱 위험도</Text>
            <View style={styles.riskBarBackground}>
              <View
                style={[
                  styles.riskBarFill,
                  { backgroundColor: getRiskColor(voicePercent), flex: voicePercent / 100 },
                ]}
              >
                <Text style={styles.riskBarText}>{voicePercent}%</Text>
              </View>
              <View style={{ flex: (100 - voicePercent) / 100 }} />
            </View>
          </View>

          <View style={styles.riskRow}>
            <Text style={styles.riskLabel}>딥보이스 위험도</Text>
            {deepPercent > 0 ? (
              <View style={styles.riskBarBackground}>
                {deepVoiceMessage === '딥보이스 가능성 있음' ? (
                  <View style={[styles.riskBarFill, { backgroundColor: getRiskColor(100), flex: 1 }]}>
                    <Text style={styles.riskBarText}>위험</Text>
                  </View>
                ) : (
                  <>
                    <View style={[styles.riskBarFill, { backgroundColor: getRiskColor(deepPercent), flex: deepPercent / 100 }]}>
                      <Text style={styles.riskBarText}>{deepPercent}%</Text>
                    </View>
                    <View style={{ flex: (100 - deepPercent) / 100 }} />
                  </>
                )}
              </View>
            ) : (
              <Text style={styles.riskNoneText}>{deepVoiceMessage || '딥보이스 가능성 없음'}</Text>
            )}
          </View>

          {/* Add risk number */}
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
              onPress={() => setIsChecked(prev => !prev)}
            >
              {isChecked && <Icon name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>위험 번호로 승인 및 공유하기</Text>
          </View>

          {/* Manage risk numbers */}
          <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate('EditRisk')}>
            <Text style={styles.manageButtonText}>위험번호 관리</Text>
          </TouchableOpacity>

          {/* Preview */}
          {riskNumbers.length > 0 && (
            <View style={styles.previewContainer}>
              {riskNumbers.map(num => (
                <Text key={num} style={styles.previewText}>{num}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputRow}>
        <Icon name="add" size={24} color={PRIMARY_BLUE} />
        <TextInput style={styles.inputBox} placeholder="Type a message..." />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  headerTitle: { fontSize: 16, fontWeight: '600' },

  content: { padding: 16 },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12, marginBottom: 8 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: PRIMARY_BLUE },
  bubbleYou: { alignSelf: 'flex-start', backgroundColor: LIGHT_BG },
  meText: { color: '#fff' },
  youText: { color: '#000' },

  analysisContainer: { marginTop: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  analysisTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, color: '#000' },
  riskRow: { marginBottom: 12 },
  riskLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4, color: '#333' },
  riskBarBackground: { flexDirection: 'row', height: 24, borderRadius: 12, backgroundColor: '#EEEEEE', overflow: 'hidden', alignItems: 'center' },
  riskBarFill: { height: '100%', justifyContent: 'center', paddingLeft: 8 },
  riskBarText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  riskNoneText: { fontSize: 12, color: '#666' },

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
  previewText: { backgroundColor: LIGHT_BG, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 8, fontSize: 12, color: '#333' },

  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: LIGHT_BG },
  inputBox: { flex: 1, marginLeft: 8, borderRadius: 20, backgroundColor: LIGHT_BG, paddingHorizontal: 16, height: 36 },
});
