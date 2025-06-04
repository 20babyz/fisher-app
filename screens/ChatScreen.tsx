// src/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, CallItem } from '../App';

// 채팅 목록에서 전달되는 연락처 정보 타입
type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;
type ChatNav = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const PRIMARY_BLUE = '#007AFF';
const LIGHT_BG = '#F5F7FA';

/**
 * getRiskColor(percent): 0~100 사이 퍼센트에 따라 색상을 계산함
 * - percent=0 → 회색(#EEEEEE)
 * - percent=100 → 진짜 빨강(#FF3B30)
 * - 그 사이 값은 빨강(#FF3B30)과 회색(#EEEEEE) 사이를 리니어 보간함
 */
function getRiskColor(percent: number): string {
  const p = Math.max(0, Math.min(100, percent));
  const r1 = 238, g1 = 238, b1 = 238;
  const r2 = 255, g2 = 59, b2 = 48;
  const ratio = p / 100;
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  return `rgb(${r},${g},${b})`;
}

interface Message {
  id: string;
  from: 'me' | 'contact';
  text: string;
}

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatRoute>();
  const navigation = useNavigation<ChatNav>();
  const contact: CallItem | undefined = route.params?.contact;

  // 서버에서 받아올 위험도 값을 state로 세팅 (기본값 0)
  const [voicePercent, setVoicePercent] = useState<number>(0);
  const [deepPercent, setDeepPercent] = useState<number>(0);

  // 대화 메시지 리스트 (서버가 없으므로 기본 4개 모두 "현재 대화내용이 없습니다.")
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'contact', text: '현재 대화내용이 없습니다.' },
    { id: '2', from: 'contact', text: '현재 대화내용이 없습니다.' },
    { id: '3', from: 'contact', text: '현재 대화내용이 없습니다.' },
    { id: '4', from: 'contact', text: '현재 대화내용이 없습니다.' },
  ]);

  // "위험 번호 추가" 모드를 나타내는 state
  const [isAddingRisk, setIsAddingRisk] = useState<boolean>(false);
  const [riskNumber, setRiskNumber] = useState<string>('');

  // 체크박스 상태 (true=체크됨, false=체크 해제)
  const [isChecked, setIsChecked] = useState<boolean>(false);

  /**
   * 나중에 서버에서 위험도를 fetch해서 세팅할 예시:
   * useEffect(() => {
   *   fetch('https://your-server.com/api/getRisk?contactId=' + contact?.id)
   *     .then(res => res.json())
   *     .then(data => {
   *       setVoicePercent(data.voicePercent);
   *       setDeepPercent(data.deepPercent);
   *     })
   *     .catch(err => console.error(err));
   * }, [contact]);
   *
   * 현재는 기본값 0%이므로 생략함
   */

  const handleAddRiskNumber = () => {
    // 여기서 riskNumber를 서버로 보낼 로직을 나중에 추가 가능함
    // 예: fetch('https://your-server.com/api/addRisk', { method:'POST', body:{ number: riskNumber } })
    // 화면 복귀
    setRiskNumber('');
    setIsAddingRisk(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contact?.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 대화 메시지 영역 */}
        {messages.map((msg) => (
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

        {/* 위험 통화 분석 영역 */}
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>위험 통화 분석</Text>

          {/* 보이스피싱 위험도 */}
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

          {/* 딥보이스 위험도 */}
          <View style={styles.riskRow}>
            <Text style={styles.riskLabel}>딥보이스 위험도</Text>
            {deepPercent > 0 ? (
              <View style={[styles.riskBarBackground, { width: '50%' }]}>
                <View
                  style={[
                    styles.riskBarFill,
                    { backgroundColor: getRiskColor(deepPercent), flex: deepPercent / 100 },
                  ]}
                >
                  <Text style={styles.riskBarText}>{deepPercent}%</Text>
                </View>
                <View style={{ flex: (100 - deepPercent) / 100 }} />
              </View>
            ) : (
              <Text style={styles.riskNoneText}>딥보이스 가능성 없음</Text>
            )}
          </View>

          {/* 위험번호 추가 / 입력창 모드 */}
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

          {/* 체크박스 */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[
                styles.checkboxBox,
                isChecked ? styles.checkboxBoxChecked : null,
              ]}
              onPress={() => setIsChecked((prev) => !prev)}
            >
              {isChecked && <Icon name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>위험 번호로 승인 및 공유하기</Text>
          </View>
        </View>
        {/* 위험 통화 분석 영역 끝 */}
      </ScrollView>

      {/* 메세지 입력창 */}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  content: { padding: 16 },

  // 채팅 버블
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12, marginBottom: 8 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: PRIMARY_BLUE },
  bubbleYou: { alignSelf: 'flex-start', backgroundColor: LIGHT_BG },
  meText: { color: '#fff' },
  youText: { color: '#000' },

  // ------------------------------------------
  // 위험 통화 분석 영역
  // ------------------------------------------
  analysisContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  riskRow: {
    marginBottom: 12,
  },
  riskLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  // 바(bar) 전체 배경 (회색)
  riskBarBackground: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
    alignItems: 'center',
  },
  // 채워진 부분
  riskBarFill: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  // 채워진 바 안의 텍스트 (흰색)
  riskBarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  // 딥보이스 퍼센트가 0일 때 표시
  riskNoneText: {
    fontSize: 12,
    color: '#666',
  },
  // “+ 위험번호로 추가하기” 버튼
  addButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 13,
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },
  // 위험번호 입력창 Row
  inputRiskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  riskInputBox: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // 체크박스 영역
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxBoxChecked: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#333',
  },

  // ------------------------------------------
  // 메세지 입력창
  // ------------------------------------------
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: LIGHT_BG,
  },
  inputBox: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: LIGHT_BG,
    paddingHorizontal: 16,
    height: 36,
  },
});
