// src/screens/LoginScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* 상단 이미지: 가로 전체 꽉 채우기 */}
        <Image
          source={require('../assets/fisher.png')}
          style={[styles.headerImage, { width: SCREEN_WIDTH }]}
        />

        <View style={styles.body}>
          {/* 좌측 정렬된 타이틀 */}
          <Text style={styles.title}>AI 통화 지킴이, Fisher</Text>

          {/* 입력 필드 */}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
          />

          {/* 좌측 정렬된 비밀번호 찾기 */}
          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
          </TouchableOpacity>

          {/* 로그인 → Check 화면으로 이동 */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Check')}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          {/* 회원가입 이동 */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>회원이 아니신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signUpLink}>회원가입</Text>
            </TouchableOpacity>
          </View>

          {/* 구분선 */}
          <View style={styles.separator} />

          {/* 소셜 로그인 구분선 텍스트 */}
          <Text style={styles.orText}>Or continue with</Text>

          {/* 소셜 버튼 */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
            >
              <Icon name="google" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#000' }]}
            >
              <Icon name="apple" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#4267B2' }]}
            >
              <Icon name="facebook" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY_BLUE = '#007AFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { alignItems: 'center' },
  headerImage: {
    height: 300,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  body: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  forgot: {
    marginTop: 10,
  },
  forgotText: {
    color: PRIMARY_BLUE,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  signUpText: {
    color: '#666',
  },
  signUpLink: {
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  orText: {
    alignSelf: 'center',
    color: '#666',
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
});

export default LoginScreen;
