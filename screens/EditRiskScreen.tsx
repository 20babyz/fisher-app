// src/screens/EditRiskScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, CallItem } from '../App';

// 컬러 상수
const PRIMARY_BLUE = '#007AFF';

type EditRouteProp = RouteProp<RootStackParamList, 'EditRisk'>;
type EditNavProp   = NativeStackNavigationProp<RootStackParamList, 'EditRisk'>;

interface RiskItem {
  number:   string;
  approved: boolean;
}

const EditRiskScreen: React.FC = () => {
  const navigation = useNavigation<EditNavProp>();
  const route      = useRoute<EditRouteProp>();
  const { contact, riskNumbers } = route.params;

  // 로컬 상태: 번호와 승인 상태
  const [items, setItems] = useState<RiskItem[]>(
    riskNumbers.map(num => ({ number: num, approved: false }))
  );

  // 거절 → 삭제
  const handleReject = (num: string) => {
    setItems(prev => prev.filter(item => item.number !== num));
  };

  // 승인 → 차단 모드
  const handleApprove = (num: string) => {
    setItems(prev =>
      prev.map(item =>
        item.number === num ? { ...item, approved: true } : item
      )
    );
  };

  // 차단 → 삭제
  const handleBlock = (num: string) => {
    setItems(prev => prev.filter(item => item.number !== num));
  };

  const renderItem = ({ item }: { item: RiskItem }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item.number}</Text>
      <View style={styles.actionRow}>
        {!item.approved ? (
          <>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleReject(item.number)}
            >
              <Text style={styles.rejectText}>거절</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleApprove(item.number)}
            >
              <Text style={styles.approveText}>승인</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.blockButton}
            onPress={() => handleBlock(item.number)}
          >
            <Text style={styles.blockText}>차단</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.backText}>가입확인</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          위험번호 관리 {contact.name}
        </Text>
        <View style={styles.headerRight}/>
      </View>

      {/* 리스트 */}
      <FlatList
        data={items}
        keyExtractor={item => item.number}
        renderItem={renderItem}
        contentContainerStyle={
          items.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            저장된 위험번호가 없습니다.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default EditRiskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'space-between',
  },
  headerBack: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 4, fontSize: 14, color: '#000' },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  headerRight: { width: 24 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  itemText: { fontSize: 14, color: '#333' },

  actionRow: { flexDirection: 'row' },
  rejectButton: { marginRight: 12 },
  rejectText: { fontSize: 14, color: '#FF3B30' },
  approveButton: {},
  approveText: { fontSize: 14, color: PRIMARY_BLUE },
  blockButton: {},
  blockText: { fontSize: 14, color: '#FF3B30' },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: '#999' },
});
