// src/screens/CallHistoryScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, CallItem } from '../App';  
// ← App.tsx에서 export한 CallItem 인터페이스를 가져옴

// 만약 App.tsx에서 CallItem을 export하지 않았다면,
// 인터페이스를 그대로 다시 선언하거나 /screens 내부에 공통 파일로 옮겨서 import 가능함.

const DATA: CallItem[] = [
  { id: '1', name: '010-1234-5678', lastMessage: '좋은 상품이 나왔다는 것에 대한 이야기', unread: 9 },
  { id: '2', name: '성영준',             lastMessage: '학식이 맛있다는 것에 대한 이야기',   unread: 0 },
  { id: '3', name: '010-1111-2222', lastMessage: '금전에 대한 이야기',             unread: 2 },
  { id: '4', name: '윤종우',             lastMessage: '잠을 못자서 피곤하다는 것에 대한 이야기', unread: 0 },
  { id: '5', name: '조민혁',             lastMessage: '캡스톤 과제에 대한 이야기',         unread: 0 },
  { id: '6', name: '오현택',             lastMessage: '노트북이 부서졌다는 것에 대한 이야기', unread: 0 },
  { id: '7', name: '010-1122-3344', lastMessage: '연애 상담에 대한 이야기',           unread: 0 },
  { id: '8', name: '010-1112-2233', lastMessage: '요즘 피부가 좋지 않다는 것에 대한 이야기', unread: 0 },
  { id: '9', name: '010-2334-3233',             lastMessage: '과제에 대한 이야기',         unread: 3 },
  { id: '10', name: '010-3234-1343',             lastMessage: '내 마음이 부서졌다는 것에 대한 이야기', unread: 0 },
  { id: '11', name: '010-1132-3344', lastMessage: '상담에 대한 이야기',           unread: 0 },
  { id: '12', name: '010-1332-2233', lastMessage: '좋지 않다는 것에 대한 이야기', unread: 0 },
  { id: '13', name: '010-1332-2227', lastMessage: '피곤하다는 이야기', unread: 5 },
];

// 네비게이션 타입 정의: 'CallHistory' 스크린에서 사용할 NavigationProp
type NavProp = NativeStackNavigationProp<RootStackParamList, 'CallHistory'>;

const CallHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const renderItem = ({ item }: { item: CallItem }) => (
    <TouchableOpacity
      style={styles.item}
      // ← 'Chat' 대신 'Profile'로 네비게이션 경로를 변경함
      onPress={() => navigation.navigate('Profile', { contact: item })}
    >
      <View style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.msg} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>통화 내역</Text>
        <TouchableOpacity>
          <Icon name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Icon name="search" size={18} color="#999" />
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#fff' },
  headerRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  editText:     { color: '#007AFF', fontSize: 14 },
  headerTitle:  { fontSize: 16, fontWeight: '600' },
  searchBar:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', marginHorizontal: 16, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8 },
  searchInput:  { flex: 1, marginLeft: 8 },
  list:         { paddingHorizontal: 16 },
  item:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  avatar:       { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF' },
  body:         { flex: 1, marginLeft: 12 },
  name:         { fontSize: 14, fontWeight: '700' },
  msg:          { fontSize: 12, color: '#666', marginTop: 2 },
  badge:        { backgroundColor: '#007AFF', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText:    { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default CallHistoryScreen;
