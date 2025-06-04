// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen       from './screens/LoginScreen';
import SignupScreen      from './screens/SignupScreen';
import CheckScreen       from './screens/Check';
import CallHistoryScreen from './screens/CallHistoryScreen';
import ChatScreen        from './screens/ChatScreen';
import Profile           from './screens/Profile';

// CallItem 인터페이스를 App.tsx에서도 재사용하도록 export하거나,
// 바로 아래 RootStackParamList에 모양을 정의해 줌.
export interface CallItem {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
}

// 수정된 RootStackParamList: Profile에 contact 파라미터가 들어오도록 정의함
export type RootStackParamList = {
  Login:       undefined;
  Signup:      undefined;
  Check:       undefined;
  CallHistory: undefined;
  Profile:     { contact: CallItem };   // ← 여기를 undefined → { contact: CallItem } 으로 변경
  Chat:        { contact: CallItem };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"       component={LoginScreen}       />
      <Stack.Screen name="Signup"      component={SignupScreen}      />
      <Stack.Screen name="Check"       component={CheckScreen}       />
      <Stack.Screen name="CallHistory" component={CallHistoryScreen} />
      <Stack.Screen name="Chat"        component={ChatScreen}        />
      <Stack.Screen name="Profile"     component={Profile}           />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
