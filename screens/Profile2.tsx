import React, { useContext, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { CallHistoryContext } from '../context/CallHistoryContext';

type Rt   = RouteProp<RootStackParamList, 'Profile2'>;
type Nav  = NativeStackNavigationProp<RootStackParamList, 'Profile2'>;

const WEEK = ['일','월','화','수','목','금','토'];

const Profile2: React.FC = () => {
  const { params:{ callId } } = useRoute<Rt>();
  const navigation            = useNavigation<Nav>();
  const { calls }             = useContext(CallHistoryContext);

  /* 통화 정보 가져오기 */
  const call = useMemo(()=>calls.find(c=>c.id===callId),[calls,callId]);
  if(!call) return null;                    // 못 찾는 경우 — 아무것도 렌더X

  /* 날짜/시간 문자열  “4월 3일 월요일 오전 10:21” */
  const d = new Date(call.dateTime);
  const dateStr = `${d.getMonth()+1}월 ${d.getDate()}일 ${WEEK[d.getDay()]}요일`;
  const tStr    = (()=>{                    // HH:MM → 오전/오후 h:mm
    const h=d.getHours(), m=d.getMinutes().toString().padStart(2,'0');
    const mer = h>=12 ? '오후':'오전';
    const hh  = ((h+11)%12+1);
    return `${mer} ${hh}:${m}`;
  })();

  /* 더미 — 채팅 내용에서 “길이순 TOP5” 뽑는 로직 */
  const dummyMsgs = [
    '발신자가 중계업체를 사칭해 카카오뱅크 지점 대출 상품을 권유함.',
    '생활자금 2,000만원 필요 여부와 기존 대출 유무를 확인함.',
    '대출 진행을 위해 인증번호(8701102) 조회 절차를 안내하며 결과를 통보하겠다고 설명함.',
    '수신자는 보이스피싱임을 의심하고 욕설을 섞어 강하게 항의함.',
  ];

  const tags = ['#중계업체', '#생활자금', '#대출', '#욕설'];

  return (
    <SafeAreaView style={st.container}>
      {/* Header */}
      <View style={st.headerRow}>
        <TouchableOpacity style={st.closeButton} onPress={()=>navigation.goBack()}>
          <Icon name="close" size={24}/>
        </TouchableOpacity>
        <Text style={st.headerTitle}>{call.name}</Text>
        <View style={st.closeButton}/>
      </View>

      <ScrollView contentContainerStyle={st.content}>
        {/* 프로필 이미지 */}
        <Image source={require('../assets/fisher.png')} style={st.profileImage} resizeMode="cover"/>

        {/* 좋아요 버튼 */}
        <View style={st.actionRow}>
          <TouchableOpacity style={st.actionButton}>
            <Icon name="heart-outline" size={24} color="#FF3B30"/>
          </TouchableOpacity>
        </View>

        {/* 통화 정보 */}
        <View style={st.infoContainer}>
          <Text style={st.callDate}>{`${dateStr} ${tStr}`}</Text>
          <Text style={st.callTitle}>{dummyMsgs[0]}</Text>
          <Text style={st.callMeta}>
            {call.callType==='incoming'?'수신 전화':'발신 전화'} | {call.summary.split('|')[1]?.trim()}
          </Text>
        </View>

        {/* 대화 내용(상위 4개) */}
        <View style={st.messageList}>
          {dummyMsgs.map((msg,i)=>(
            <View key={i} style={st.messageItem}>
              <Text style={st.bullet}>{'\u2022'}</Text>
              <Text style={st.messageText}>{msg}</Text>
            </View>
          ))}
        </View>

        {/* 태그 */}
        <View style={st.tagContainer}>
          <Text style={st.tagLabel}>통화 태그</Text>
          <View style={st.tagList}>
            {tags.map((tag,i)=>(
              <View key={i} style={st.tag}>
                <Text style={st.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Chat 연결 */}
        <TouchableOpacity style={st.detailButton} onPress={()=>{
          navigation.navigate('Chat2',{ callId:call.id, name:call.name });
        }}>
          <Text style={st.detailButtonText}>통화 내용 자세히 보기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile2;

/* ───────── 스타일 ───────── */
const st = StyleSheet.create({
  container:{flex:1,backgroundColor:'#FFF'},
  headerRow:{height:50,flexDirection:'row',alignItems:'center',justifyContent:'space-between',
             borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#E0E0E0',paddingHorizontal:12},
  closeButton:{width:40,alignItems:'center',justifyContent:'center'},
  headerTitle:{fontSize:16,fontWeight:'600'},

  content:{paddingBottom:24},
  profileImage:{width:'100%',height:200,backgroundColor:'#F0F0F0'},
  actionRow:{flexDirection:'row',justifyContent:'flex-end',paddingHorizontal:16,paddingVertical:8},
  actionButton:{marginLeft:16},

  infoContainer:{paddingHorizontal:16,paddingTop:8},
  callDate:{fontSize:12,color:'#666',marginBottom:4},
  callTitle:{fontSize:16,fontWeight:'700',marginBottom:4},
  callMeta:{fontSize:12,color:'#999'},

  messageList:{paddingHorizontal:16,paddingTop:16},
  messageItem:{flexDirection:'row',alignItems:'flex-start',marginBottom:8},
  bullet:{fontSize:8,color:'#333',marginRight:8,lineHeight:18},
  messageText:{flex:1,fontSize:14,color:'#333',lineHeight:18},

  tagContainer:{paddingHorizontal:16,paddingTop:16},
  tagLabel:{fontSize:14,fontWeight:'600',marginBottom:8},
  tagList:{flexDirection:'row',flexWrap:'wrap'},
  tag:{backgroundColor:'#F0F0F0',borderRadius:12,paddingHorizontal:8,paddingVertical:4,
       marginRight:8,marginBottom:8},
  tagText:{fontSize:12,color:'#333'},

  detailButton:{marginTop:24,marginHorizontal:16,backgroundColor:'#0066FF',
                borderRadius:8,height:48,alignItems:'center',justifyContent:'center'},
  detailButtonText:{color:'#FFF',fontSize:16,fontWeight:'600'},
});
