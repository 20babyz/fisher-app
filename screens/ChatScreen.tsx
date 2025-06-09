import React, { useState, useContext } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, StyleSheet,
  TextInput, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { pick, types as DocumentPickerTypes } from '@react-native-documents/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { RiskContext } from '../context/RiskContext';

type ChatRoute = RouteProp<RootStackParamList, 'Chat'>;
type ChatNav   = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const PRIMARY_BLUE = '#007AFF';
const LIGHT_BG     = '#F5F7FA';
const ALERT_BG     = '#FFCDD2';
const getRiskColor = (p: number) => {
  const t = Math.max(0, Math.min(100, p)) / 100;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(238,255)},${mix(238,59)},${mix(238,48)})`;
};

interface Message {
  id: string;
  from: 'me' | 'contact';
  text: string;
  isPhishing?: boolean;
  safePercent?: number;
}

interface PhishResult { sentence: string; score: number; is_phishing: boolean }

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<ChatNav>();
  const { contact } = useRoute<ChatRoute>().params;

  /* ───────── state ───────── */
  const [messages, setMessages]   = useState<Message[]>([]);
  const [deepPercent, setDeepPercent] = useState(0);

  /** 보이스피싱 전체 평균을 위해 누적 배열 보관 */
  const [allPhishScores, setAllPhishScores] = useState<number[]>([]);
  const avgPhishPercent =
    allPhishScores.length
      ? Math.round(allPhishScores.reduce((a, b) => a + b, 0) / allPhishScores.length)
      : 0;

  /* 오디오 파일 선택 헬퍼 */
  const pickAudio = async () => {
    const [file] = await pick({ type: [DocumentPickerTypes.audio], copyTo: 'cachesDirectory' });
    return file;
  };

  /* 🎤 : 딥보이스 + 보이스피싱 */
  const handleFullAnalysis = async () => {
    try {
      const { uri, name } = await pickAudio();
      const safeName = name ?? `audio_${Date.now()}.wav`;

      /* ---- 딥보이스 ---- */
      const fd = new FormData();
      fd.append('file', { uri, name: safeName, type: 'audio/wav' } as any);
      const dJson = await (await fetch('http://1.229.246.105:20000/predict', { method: 'POST', body: fd })).json();
      setDeepPercent(Math.round(parseFloat(dJson.probability) * 100));

      await analysePhishing(uri, safeName);
    } catch (e: any) {
      if (e.code !== 'USER_CANCELED') Alert.alert('에러', String(e));
    }
  };

  /* ⚙️ : 보이스피싱만 */
  const handlePhishOnly = async () => {
    try {
      const { uri, name } = await pickAudio();
      const safeName = name ?? `audio_${Date.now()}.wav`;

      setDeepPercent(0);               // 딥 0 고정
      await analysePhishing(uri, safeName);
    } catch (e: any) {
      if (e.code !== 'USER_CANCELED') Alert.alert('에러', String(e));
    }
  };

  /* ------------ 보이스피싱 분석 ------------ */
  const analysePhishing = async (uri: string, fileName: string) => {
    const fp = new FormData();
    fp.append('file', { uri, name: fileName, type: 'audio/wav' } as any);

    const res = await fetch('http://1.229.246.105:20001/analyze/', { method: 'POST', body: fp });
    if (!res.ok) { Alert.alert('보이스피싱 서버 오류', String(res.status)); return; }

    const json = (await res.json()) as { results: PhishResult[] };

    /* 누적 확률 배열 갱신 + 평균 계산 */
    const newScores = json.results.map(r => r.score * 100);        // 0~100
    setAllPhishScores(prev => [...prev, ...newScores]);

    /* 메시지 변환 */
    const newMsgs: Message[] = json.results.map((r, i) => ({
      id: `${Date.now()}-${i}`,
      from: 'contact',
      text: r.sentence,
      isPhishing: r.is_phishing,
      safePercent: Math.round((1 - r.score) * 100),
    }));
    setMessages(prev => [...prev, ...newMsgs]);
  };

  /* ───────── UI ───────── */
  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contact.name}</Text>
        <View style={{ flexDirection:'row', gap:16 }}>
          <TouchableOpacity onPress={handleFullAnalysis}>
            <Icon name="mic-outline" size={24} color={PRIMARY_BLUE}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePhishOnly}>
            <Icon name="settings-outline" size={24} color={PRIMARY_BLUE}/>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* chat bubbles */}
        {messages.map(m => (
          <View key={m.id} style={[
            styles.bubble,
            m.from==='me'?styles.bubbleMe:styles.bubbleYou,
            m.isPhishing && styles.bubblePhish,
          ]}>
            <Text style={m.from==='me'?styles.meText:styles.youText}>{m.text}</Text>
            {m.safePercent!=null && (
              <Text style={styles.safeScore}>비-피싱 {m.safePercent}%</Text>
            )}
          </View>
        ))}

        {/* analysis panel */}
        <View style={styles.analysis}>
          <Text style={styles.analysisTitle}>위험 통화 분석</Text>
          <RiskBar label="보이스피싱 위험도" percent={avgPhishPercent}/>
          <RiskBar label="딥보이스 위험도"  percent={deepPercent}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatScreen;

/* Risk bar component */
const RiskBar = ({label,percent}:{label:string;percent:number}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.riskLabel}>{label}</Text>
    <View style={styles.riskBg}>
      <View style={[styles.riskFill, { backgroundColor: getRiskColor(percent), flex: percent / 100 }]}>
        <Text style={styles.riskTxt}>{percent}%</Text>
      </View>
      <View style={{ flex: (100 - percent) / 100 }} />
    </View>
  </View>
);

/* Styles */
const styles = StyleSheet.create({
  safe:{ flex:1, backgroundColor:'#fff' },

  headerRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16 },
  headerTitle:{ fontSize:16, fontWeight:'600' },

  content:{ padding:16 },

  bubble:{ padding:12, borderRadius:16, marginBottom:8, maxWidth:'75%' },
  bubbleMe:{ alignSelf:'flex-end', backgroundColor:PRIMARY_BLUE },
  bubbleYou:{ alignSelf:'flex-start', backgroundColor:LIGHT_BG },
  bubblePhish:{ backgroundColor:ALERT_BG },
  meText:{ color:'#fff' }, youText:{ color:'#000' },
  safeScore:{ fontSize:10, color:'#555', marginTop:4 },

  analysis:{ marginTop:16, padding:16, borderRadius:12, borderWidth:1, borderColor:'#E0E0E0' },
  analysisTitle:{ fontSize:14, fontWeight:'600', marginBottom:12 },
  riskLabel:{ fontSize:13, fontWeight:'500', marginBottom:4 },
  riskBg:{ flexDirection:'row', height:24, borderRadius:12, backgroundColor:'#EEE', overflow:'hidden', alignItems:'center' },
  riskFill:{ height:'100%', justifyContent:'center', paddingLeft:8 },
  riskTxt:{ fontSize:12, fontWeight:'600', color:'#fff' },
});
