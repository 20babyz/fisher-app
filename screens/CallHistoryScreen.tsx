// src/screens/CallHistoryScreen.tsx

import React, { useContext } from 'react';
import {
  SafeAreaView,
  SectionList,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { RiskContext } from '../context/RiskContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CallHistory'>;

interface HistoryItem {
  id: string;
  name: string;
  category: '보이스피싱 의심' | '딥보이스 의심' | '안심 통화' | '통화 내용 없음';
  callType: 'incoming' | 'outgoing' | 'missed';
  time: string;
  summary: string;
}

const SECTIONS: { title: string; data: HistoryItem[] }[] = [
  {
    title: '6월 2일 월요일',
    data: [
      {
        id: '1',
        name: '070-5232-5486',
        category: '보이스피싱 의심',
        callType: 'incoming',
        time: '오후 3:58',
        summary: '발신 전화 | 2분 5초',
      },
      {
        id: '2',
        name: '02-6344-4478',
        category: '안심 통화',
        callType: 'outgoing',
        time: '오후 2:18',
        summary: '수신 전화 | 1분 12초',
      },
    ],
  },
  {
    title: '5월 31일 토요일',
    data: [
      {
        id: '3',
        name: '조민혁 (모시공20)',
        category: '통화 내용 없음',
        callType: 'missed',
        time: '오후 7:13',
        summary: '부재중 전화',
      },
    ],
  },
  {
    title: '5월 30일 금요일',
    data: [
      {
        id: '4',
        name: '010-1122-3344',
        category: '딥보이스 의심',
        callType: 'outgoing',
        time: '오전 12:00',
        summary: '발신 전화 | 3분 27초',
      },
    ],
  },
];

const CallHistoryScreen: React.FC = () => {
  const { riskNumbers } = useContext(RiskContext);
  const navigation = useNavigation<NavProp>();

  const renderItem = ({ item }: { item: HistoryItem }) => {
    let iconName: string;
    let iconColor: string;
    switch (item.callType) {
      case 'incoming':
        iconName = 'arrow-down-circle';
        iconColor = '#4CAF50';
        break;
      case 'outgoing':
        iconName = 'arrow-up-circle';
        iconColor = '#007AFF';
        break;
      case 'missed':
        iconName = 'close-circle';
        iconColor = '#FF3B30';
        break;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('Profile', {
            contact: {
              id: item.id,
              name: item.name,
              lastMessage: item.summary,
              unread: 0,
            },
          })
        }
      >
        <View style={styles.row}>
          <Icon name={iconName} size={24} color={iconColor} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text
              style={[
                styles.category,
                item.category === '안심 통화' && styles.categorySafe,
                item.category === '통화 내용 없음' && styles.categoryNone,
              ]}
            >
              {`<${item.category}>`}
            </Text>
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.summary}>{item.summary}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.editButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.navigate('EditRisk')}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>최근 기록</Text>
        <TouchableOpacity
          style={styles.editButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#999" />
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default CallHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButton: { padding: 8 },
  editText: { color: '#007AFF', fontSize: 14 },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchInput: { flex: 1, marginLeft: 8 },

  list: { paddingHorizontal: 16 },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },

  itemContainer: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '500' },
  category: { fontSize: 12, color: '#FF9500', marginTop: 2 },
  // 안심 통화 태그: 초록
  categorySafe: { color: '#4CAF50' },
  // 통화 내용 없음 태그: 회색
  categoryNone: { color: '#999999' },
  time: { fontSize: 12, color: '#999' },
  summary: { fontSize: 12, color: '#333', marginLeft: 36, marginTop: 4 },
});
