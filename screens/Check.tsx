// src/screens/Check.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type CheckNavProp = NativeStackNavigationProp<RootStackParamList, 'Check'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PRIMARY_BLUE = '#007AFF';
const TEXT_BLACK = '#000';
const TEXT_GRAY = '#666';

const CheckScreen: React.FC = () => {
  const navigation = useNavigation<CheckNavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          안전한 통화를 위해{'\n'}
          필요한 권한을 요청드려요
        </Text>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>마이크</Text>
          <Text style={styles.itemDesc}>
            전화를 주고 받기 위해서 필요해요
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>연락처</Text>
          <Text style={styles.itemDesc}>
            기기의 연락 정보를 가져오기 위해 필요해요
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>알림</Text>
          <Text style={styles.itemDesc}>
            전화 수신 푸시, 통화 요약 알림, 등 필요한 알림을 받을 수 있어요
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* TODO: 실제 권한 요청 로직 삽입 */
          navigation.navigate('CallHistory');
        }}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  content: {
    width: SCREEN_WIDTH - 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_BLACK,
    lineHeight: 36,
    marginBottom: 30,
  },
  item: {
    marginBottom: 24,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_BLACK,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 20,
  },
  button: {
    width: SCREEN_WIDTH - 40,
    height: 50,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckScreen;
