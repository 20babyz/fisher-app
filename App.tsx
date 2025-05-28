// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen         from './screens/LoginScreen';
import SignupScreen        from './screens/SignupScreen';
import CheckScreen         from './screens/Check';
import CallHistoryScreen   from './screens/CallHistoryScreen';
import ChatScreen          from './screens/ChatScreen';

export type RootStackParamList = {
  Login:      undefined;
  Signup:     undefined;
  Check:      undefined;
  CallHistory: undefined;
  Chat: {
    contact: {
      id: string;
      name: string;
      lastMessage: string;
      unread: number;
    };
  };
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
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
