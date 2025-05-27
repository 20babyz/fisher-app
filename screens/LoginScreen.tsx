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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen: React.FC = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require('../assets/fisher.png')}
        style={styles.image}
      />

      <Text style={styles.title}>AI 통화 지킴이, Fisher</Text>

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

      <TouchableOpacity>
        <Text style={styles.linkText}>비밀번호를 잊으셨나요?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>회원이 아니신가요? </Text>
        <TouchableOpacity>
          <Text style={styles.signUpLink}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>Or continue with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="google" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="apple" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={24} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const PRIMARY_BLUE = '#007AFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
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
  linkText: {
    alignSelf: 'flex-end',
    color: PRIMARY_BLUE,
    marginTop: 10,
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
  orText: {
    color: '#666',
    marginVertical: 20,
  },
  socialRow: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
});

export default LoginScreen;
