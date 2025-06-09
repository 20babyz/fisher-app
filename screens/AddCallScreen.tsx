// src/screens/AddCallScreen.tsx
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { CallHistoryContext } from '../context/CallHistoryContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AddCall'>;

const AddCallScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { addCall } = useContext(CallHistoryContext);

  /* 입력 상태 */
  const [name, setName]         = useState('');
  const [number, setNumber]     = useState('');
  const [date, setDate]         = useState(new Date());
  const [showPicker, setPicker] = useState(false);
  const [callType, setCallType] = useState<'incoming' | 'outgoing'>('incoming');
  const [duration, setDuration] = useState('00:00:00');
  const [memo, setMemo]         = useState('현재 통화 내용이 없습니다.');

  /* 날짜 변경 */
  const onChangeDate = (_: any, sel?: Date) => {
    setPicker(Platform.OS === 'ios');
    if (sel) setDate(sel);
  };

  /* HH:MM → “오전/오후 h:mm” */
  const formatTimeKorean = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const period = h >= 12 ? '오후' : '오전';
    const hour12 = ((h + 11) % 12 + 1).toString();
    return `${period} ${hour12}:${m}`;
  };

  /* 저장 → CallHistory 추가 후 Chat2로 이동 */
  const handleSave = () => {
    const id          = Date.now().toString();
    const displayName = name.trim() || number.trim() || '알 수 없음';
    const summary     = `${callType === 'incoming' ? '수신 전화' : '발신 전화'} | ${duration}`;

    addCall({
      id,
      name: displayName,
      category: '통화 내용 없음',
      callType,
      summary,
      dateTime: date.toISOString(),
    });

    /* ChatScreen2 로 교체 이동 */
    navigation.replace('Chat2', { callId: id, name: displayName });
  };

  /* ─── UI ─── */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>통화 정보 입력</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 이름 / 번호 */}
        <Text style={styles.label}>이름 / 번호</Text>
        <TextInput
          placeholder="예) 조민혁 010-1111-2234"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="전화번호"
          value={number}
          onChangeText={setNumber}
          style={[styles.input, { marginTop: 8 }]}
          keyboardType="phone-pad"
        />

        {/* 날짜·시간 */}
        <Text style={styles.label}>날짜·시간</Text>
        <TouchableOpacity onPress={() => setPicker(true)} style={styles.dateBtn}>
          <Text>{formatTimeKorean(date)} ({date.toLocaleDateString()})</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {/* 통화 유형 */}
        <Text style={styles.label}>통화 유형</Text>
        <View style={styles.segment}>
          {(['incoming', 'outgoing'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.segItem, callType === t && styles.segItemActive]}
              onPress={() => setCallType(t)}
            >
              <Text style={callType === t ? styles.segTextActive : styles.segText}>
                {t === 'incoming' ? '수신' : '발신'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 통화 시간 */}
        <Text style={styles.label}>통화 시간 (HH:MM:SS)</Text>
        <TextInput
          placeholder="예) 00:03:27"
          value={duration}
          onChangeText={setDuration}
          style={styles.input}
          keyboardType="numeric"
        />

        {/* 통화 내용 메모 */}
        <Text style={styles.label}>통화 내용</Text>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          style={[styles.input, styles.textArea]}
          multiline
        />

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveTxt}>통화 내용 등록하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCallScreen;

/* ─── 스타일 ─── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  close:  { fontSize: 22 },
  title:  { fontSize: 18, fontWeight: '600' },

  label: { marginTop: 16, marginBottom: 6, fontSize: 14, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 14 },
  textArea: { height: 120, textAlignVertical: 'top' },

  dateBtn: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, alignItems: 'center' },

  segment: { flexDirection: 'row', gap: 8 },
  segItem: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, alignItems: 'center' },
  segItemActive: { backgroundColor: '#007AFF' },
  segText: { fontSize: 14 },
  segTextActive: { color: '#fff', fontSize: 14 },

  saveBtn: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  saveTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
