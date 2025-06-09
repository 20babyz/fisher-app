import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RiskProvider }       from './context/RiskContext';
import LoginScreen            from './screens/LoginScreen';
import SignupScreen           from './screens/SignupScreen';
import CheckScreen            from './screens/Check';
import CallHistoryScreen      from './screens/CallHistoryScreen';
import ChatScreen             from './screens/ChatScreen';
import Profile                from './screens/Profile';
import EditRiskScreen         from './screens/EditRiskScreen';

export interface CallItem {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
}

export type RootStackParamList = {
  Login:       undefined;
  Signup:      undefined;
  Check:       undefined;
  CallHistory: undefined;
  Profile:     { contact: CallItem };
  Chat:        { contact: CallItem; updatedRiskNumbers?: string[] };
  EditRisk:    undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <RiskProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login"       component={LoginScreen}       />
        <Stack.Screen name="Signup"      component={SignupScreen}      />
        <Stack.Screen name="Check"       component={CheckScreen}       />
        <Stack.Screen name="CallHistory" component={CallHistoryScreen} />
        <Stack.Screen name="Chat"        component={ChatScreen}        />
        <Stack.Screen name="Profile"     component={Profile}           />
        <Stack.Screen name="EditRisk"    component={EditRiskScreen}    />
      </Stack.Navigator>
    </NavigationContainer>
  </RiskProvider>
);

export default App;
