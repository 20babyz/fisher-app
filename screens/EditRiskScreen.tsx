// src/screens/EditRiskScreen.tsx

import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RiskContext } from '../context/RiskContext';
import type { RootStackParamList } from '../App';

type EditRiskNavProp = NativeStackNavigationProp<RootStackParamList, 'EditRisk'>;
const PRIMARY_BLUE = '#007AFF';

interface RiskItem {
  number: string;
  approved: boolean;
}

const EditRiskScreen: React.FC = () => {
  const navigation = useNavigation<EditRiskNavProp>();
  const { riskNumbers, setRiskNumbers } = useContext(RiskContext);

  // 로컬 승인/거절 관리
  const [items, setItems] = useState<RiskItem[]>([]);

  // riskNumbers 가 바뀔 때마다 로컬 items 동기화
  useEffect(() => {
    setItems(riskNumbers.map(num => ({ number: num, approved: false })));
  }, [riskNumbers]);

  // 거절(삭제)
  const handleReject = (num: string) => {
    Alert.alert('삭제 확인', `"${num}"을(를) 거절(삭제)하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          // 컨텍스트와 로컬 모두에서 삭제
          setRiskNumbers(prev => prev.filter(n => n !== num));
          setItems(prev => prev.filter(i => i.number !== num));
        },
      },
    ]);
  };

  // 승인 → 차단으로 전환
  const handleApprove = (num: string) => {
    setItems(prev =>
      prev.map(i =>
        i.number === num ? { ...i, approved: true } : i
      )
    );
  };

  // 차단(최종삭제)
  const handleBlock = (num: string) => {
    Alert.alert('차단 확인', `"${num}"을(를) 차단하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '차단',
        style: 'destructive',
        onPress: () => {
          setRiskNumbers(prev => prev.filter(n => n !== num));
          setItems(prev => prev.filter(i => i.number !== num));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>위험번호 관리</Text>
        <View style={styles.headerRight} />
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={item => item.number}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 신청이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar} />
              <Text style={styles.name}>{item.number}</Text>
              <TouchableOpacity>
                <Text style={styles.detailText}>
                  자세히보기 <Icon name="chevron-forward" size={14} />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.applyRow}>
              <Text style={styles.applyLabel}>신청일</Text>
              <Text style={styles.applyDate}>2025-06-11</Text>
            </View>
            <View style={styles.actionRow}>
              {!item.approved ? (
                <>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.number)}
                  >
                    <Text style={styles.rejectText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item.number)}
                  >
                    <Text style={styles.approveText}>차단</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.blockButton}
                  onPress={() => handleBlock(item.number)}
                >
                  <Text style={styles.blockText}>차단 중</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default EditRiskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F3F5' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerRight: { width: 24 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#ECECEC'
  },
  name: {
    flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#333'
  },
  detailText: { fontSize: 12, color: '#999' },

  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  applyLabel: { fontSize: 12, color: '#666' },
  applyDate: { fontSize: 12, marginLeft: 8, color: '#333' },

  actionRow: { flexDirection: 'row' },
  rejectButton: {
    flex: 1,
    marginRight: 8,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E5F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: { color: PRIMARY_BLUE, fontSize: 14, fontWeight: '500' },
  approveButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  blockButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockText: { color: '#FFF', fontSize: 14, fontWeight: '500' },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: { fontSize: 14, color: '#999' },
});
