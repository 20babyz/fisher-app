import React, { useContext, useMemo } from 'react';
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
import { CallHistoryContext, HistoryItem } from '../context/CallHistoryContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CallHistory'>;

/* 요일 한글 매핑 */
const WEEKDAYS = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];

const CallHistoryScreen: React.FC = () => {
  const { calls } = useContext(CallHistoryContext);
  const navigation = useNavigation<NavProp>();

  /* 날짜별 그룹핑 */
  const sections = useMemo(() => {
    const grouped: Record<string, HistoryItem[]> = {};

    calls.forEach(item => {
      const d   = new Date(item.dateTime);
      const key = `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}`;
      (grouped[key] ??= []).push(item);
    });

    return Object.keys(grouped)
      .sort((a, b) => grouped[b][0].dateTime.localeCompare(grouped[a][0].dateTime))
      .map(title => ({
        title,
        data: grouped[title].sort((a, b) => b.dateTime.localeCompare(a.dateTime)),
      }));
  }, [calls]);

  /* 각 아이템 */
  const renderItem = ({ item }: { item: HistoryItem }) => {
    const { iconName, iconColor } = (() => {
      switch (item.callType) {
        case 'incoming': return { iconName: 'arrow-down-circle', iconColor: '#4CAF50' };
        case 'outgoing': return { iconName: 'arrow-up-circle',   iconColor: '#007AFF' };
        default:         return { iconName: 'close-circle',      iconColor: '#FF3B30' };
      }
    })();

    /* HH:MM 변환 */
    const timeStr = (() => {
      const d = new Date(item.dateTime);
      const h = d.getHours();
      const m = d.getMinutes().toString().padStart(2,'0');
      const period = h >= 12 ? '오후' : '오전';
      const hour12 = ((h + 11) % 12 + 1).toString();
      return `${period} ${hour12}:${m}`;
    })();

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('Profile2', { callId: item.id })}   
      >
        <View style={styles.row}>
          <Icon name={iconName} size={24} color={iconColor} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text
              style={[
                styles.category,
                item.category === '안심 통화'       && styles.categorySafe,
                item.category === '통화 내용 없음'   && styles.categoryNone,
              ]}
            >
              {`<${item.category}>`}
            </Text>
          </View>
          <Text style={styles.time}>{timeStr}</Text>
        </View>
        <Text style={styles.summary}>{item.summary}</Text>
      </TouchableOpacity>
    );
  };

  /* ─── UI ─── */
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.editButton}
          hitSlop={{ top:10,bottom:10,left:10,right:10 }}
          onPress={() => navigation.navigate('EditRisk')}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>최근 기록</Text>

        <TouchableOpacity
          style={styles.editButton}
          hitSlop={{ top:10,bottom:10,left:10,right:10 }}
          onPress={() => navigation.navigate('AddCall')}
        >
          <Icon name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* 검색바 (동작 X) */}
      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#999" />
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      {/* SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default CallHistoryScreen;

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },

  headerRow:{
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:16, paddingVertical:8,
  },
  editButton:{ padding:8 },
  editText:{ color:'#007AFF', fontSize:14 },
  headerTitle:{ fontSize:18, fontWeight:'600' },

  searchBar:{
    flexDirection:'row', alignItems:'center', backgroundColor:'#F5F7FA',
    marginHorizontal:16, borderRadius:20, paddingHorizontal:12, paddingVertical:6, marginBottom:8,
  },
  searchInput:{ flex:1, marginLeft:8 },

  list:{ paddingHorizontal:16 },
  sectionHeader:{
    marginTop:16, marginBottom:8, fontSize:14, fontWeight:'500', color:'#666',
  },

  itemContainer:{ marginBottom:12 },
  row:{ flexDirection:'row', alignItems:'center' },
  info:{ flex:1, marginLeft:12 },
  name:{ fontSize:16, fontWeight:'500' },
  category:{ fontSize:12, color:'#FF9500', marginTop:2 },
  categorySafe:{ color:'#4CAF50' },
  categoryNone:{ color:'#999' },
  time:{ fontSize:12, color:'#999' },
  summary:{ fontSize:12, color:'#333', marginLeft:36, marginTop:4 },
});
