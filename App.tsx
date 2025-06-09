import React from 'react';
import { NavigationContainer }            from '@react-navigation/native';
import { createNativeStackNavigator }     from '@react-navigation/native-stack';

import { RiskProvider }           from './context/RiskContext';
import { CallHistoryProvider }    from './context/CallHistoryContext';

import LoginScreen        from './screens/LoginScreen';
import SignupScreen       from './screens/SignupScreen';
import CheckScreen        from './screens/Check';
import CallHistoryScreen  from './screens/CallHistoryScreen';
import ChatScreen         from './screens/ChatScreen';
import ChatScreen2        from './screens/ChatScreen2';
import Profile            from './screens/Profile';
import Profile2           from './screens/Profile2';       // ★ NEW
import EditRiskScreen     from './screens/EditRiskScreen';
import AddCallScreen      from './screens/AddCallScreen';

export interface CallItem {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
}

export type RootStackParamList = {
  Login:        undefined;
  Signup:       undefined;
  Check:        undefined;
  CallHistory:  undefined;
  /* 기존 프로필 (샘플 데이터용) */
  Profile:      { contact: CallItem };

  /* 새 채팅 & 분석 */
  Chat:         { contact: CallItem; updatedRiskNumbers?: string[] };
  Chat2:        { callId: string; name: string };

  /* 새 프로필2 – 통화 내역에서 이동 */
  Profile2:     { callId: string };

  /* 설정/관리 */
  EditRisk:     undefined;
  AddCall:      undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <RiskProvider>
    <CallHistoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login"        component={LoginScreen}      />
          <Stack.Screen name="Signup"       component={SignupScreen}     />
          <Stack.Screen name="Check"        component={CheckScreen}      />

          <Stack.Screen name="CallHistory"  component={CallHistoryScreen}/>
          <Stack.Screen name="AddCall"      component={AddCallScreen}    />

          <Stack.Screen name="Chat"         component={ChatScreen}       />
          <Stack.Screen name="Chat2"        component={ChatScreen2}      />

          <Stack.Screen name="Profile"      component={Profile}          />
          <Stack.Screen name="Profile2"     component={Profile2}         />

          <Stack.Screen name="EditRisk"     component={EditRiskScreen}   />
        </Stack.Navigator>
      </NavigationContainer>
    </CallHistoryProvider>
  </RiskProvider>
);

export default App;
