// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type SignupNavProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const PRIMARY_BLUE = '#007AFF';
const TEXT_GRAY = '#666';
const PLACEHOLDER = '#999';

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupNavProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>회원가입</Text>
        <Text style={styles.subheader}>계정을 만들고 Fisher를 시작해보세요</Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
          placeholderTextColor={PLACEHOLDER}
        />

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="name@email.com"
          placeholderTextColor={PLACEHOLDER}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호 입력"
          placeholderTextColor={PLACEHOLDER}
          secureTextEntry
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="비밀번호 재확인"
          placeholderTextColor={PLACEHOLDER}
          secureTextEntry
        />

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreed((prev) => !prev)}
        >
          <Icon
            name={agreed ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color={agreed ? PRIMARY_BLUE : TEXT_GRAY}
          />
          <Text style={styles.termsText}>
            저는 <Text style={styles.linkText}>규정약관</Text>을 숙지하였으며 동의합니다.
          </Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity
          style={styles.signupButton}
          disabled={!agreed}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signupButtonText}>계정 생성하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_GRAY,
    marginLeft: 8,
  },
  linkText: {
    color: PRIMARY_BLUE,
    textDecorationLine: 'underline',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;

