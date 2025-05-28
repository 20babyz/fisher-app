// src/screens/ChatScreen.tsx
import React from 'react';
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
import type { RootStackParamList } from '../App';

// 채팅 목록에서 전달되는 연락처 정보 타입
type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;
type ChatNav = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const PRIMARY_BLUE = '#007AFF';
const LIGHT_BG = '#F5F7FA';

// 더미 메시지
const MESSAGES = [
  { id: '1', from: 'contact', text: '캡스톤 과제에 대한 이야기' },
  { id: '2', from: 'contact', text: '학식이 맛있다는 것에 대한 이야기' },
  { id: '3', from: 'me', text: '요즘 일몰이 예쁘다는 이야기' },
  { id: '4', from: 'me', text: '내일 만나서 과제를 하자는 이야기' },
];

const ChatScreen: React.FC = () => {
  // 타입 지정된 훅 사용
  const route = useRoute<ChatRoute>();
  const navigation = useNavigation<ChatNav>();

  // params에서 contact 객체를 안전하게 꺼내기
  const contact = route.params?.contact;

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
        {MESSAGES.map((msg) => (
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

        {/* 일정 카드 */}
        <View style={styles.scheduleCard}>
          <TouchableOpacity style={styles.radioRow}>
            <Icon name="radio-button-on" size={18} color={PRIMARY_BLUE} />
            <Text style={styles.scheduleLabel}>일정 생성</Text>
          </TouchableOpacity>

          {[1, 2].map((i) => (
            <TouchableOpacity key={i} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>2025년 3월 21일 12:30 국제관</Text>
              <Text style={styles.scheduleDesc} numberOfLines={1}>
                캡스톤 과제를 같이 하는것에 대한 일정
              </Text>
              {i === 1 && (
                <Icon
                  name="checkmark"
                  size={20}
                  color={PRIMARY_BLUE}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addCalendarRow}>
            <Icon name="add" size={18} color={PRIMARY_BLUE} />
            <Text style={styles.addCalendarText}>캘린더에 추가하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareRow}>
            <Icon name="checkbox" size={18} color={PRIMARY_BLUE} />
            <Text style={styles.shareText}>해당 일정을 승인 및 공유하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 메세지 입력창 */}
      <View style={styles.inputRow}>
        <Icon name="add" size={24} color={PRIMARY_BLUE} />
        <TextInput style={styles.inputBox} placeholder="Type a message..." />
      </View>
    </SafeAreaView>
  );
};

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
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12, marginBottom: 8 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: PRIMARY_BLUE },
  bubbleYou: { alignSelf: 'flex-start', backgroundColor: LIGHT_BG },
  meText: { color: '#fff' },
  youText: { color: '#000' },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_BG,
    padding: 12,
    marginTop: 16,
  },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  scheduleLabel: { marginLeft: 8, fontWeight: '600' },
  scheduleItem: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LIGHT_BG,
    position: 'relative',
  },
  scheduleTime: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  scheduleDesc: { fontSize: 12, color: '#666' },
  checkIcon: { position: 'absolute', right: 8, top: 8 },
  addCalendarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  addCalendarText: { color: PRIMARY_BLUE, marginLeft: 4 },
  shareRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  shareText: { color: PRIMARY_BLUE, marginLeft: 4 },
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

export default ChatScreen;
