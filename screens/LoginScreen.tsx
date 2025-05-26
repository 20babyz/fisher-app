// screens/LoginScreen.tsx
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image
          source={require('../assets/fisher.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>AI 통화 지킴이, Fisher</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, {flex: 1, marginRight: 8}]}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setSecure(prev => !prev)}>
            <Ionicons
              name={secure ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.signUpWrapper}>
          <Text style={styles.signUpText}>회원이 아니신가요? </Text>
          <TouchableOpacity>
            <Text style={[styles.signUpText, styles.signUpLink]}>
              회원가입
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.or}>Or continue with</Text>
        <View style={styles.socials}>
          <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#DB4437'}]}>
            <Text style={styles.socialText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#000'}]}>
            <Text style={styles.socialText}></Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#4267B2'}]}>
            <Text style={styles.socialText}>f</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImageContainer: { alignItems: 'center', marginTop: 32 },
  headerImage: { width: 160, height: 160 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 24, marginHorizontal: 24 },
  form: { marginHorizontal: 24, marginTop: 24 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center' },
  forgot: { color: '#0066FF', textAlign: 'right', marginBottom: 24 },
  loginButton: {
    height: 48,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  signUpWrapper: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  signUpText: { fontSize: 14, color: '#666' },
  signUpLink: { color: '#0066FF', fontWeight: '600' },
  or: { textAlign: 'center', marginBottom: 16, color: '#999' },
  socials: { flexDirection: 'row', justifyContent: 'space-around' },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: { color: '#fff', fontSize: 24, fontWeight: '600' },
});
