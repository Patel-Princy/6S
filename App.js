import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from './src/context/AppStateContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import StudentPortal from './src/screens/StudentPortal';
import SubZonalDashboard from './src/screens/SubZonalDashboard';
import ZonalDashboard from './src/screens/ZonalDashboard';
import AdminDashboard from './src/screens/AdminDashboard';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppStateProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="StudentPortal" component={StudentPortal} />
            <Stack.Screen name="SubZonalDashboard" component={SubZonalDashboard} />
            <Stack.Screen name="ZonalDashboard" component={ZonalDashboard} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppStateProvider>
  );
}

export default App;
