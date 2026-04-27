import React from 'react';
import { StatusBar, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ToolsScreen, { type ToolsStackParamList } from './screens/ToolsScreen';
import CaloriesCalculatorScreen from './screens/CaloriesCalculatorScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabParamList = {
  Home: undefined;
  Tools: undefined;
};

// ─── Tools Stack ──────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<ToolsStackParamList>();
const GOLD = '#e5ae51';

function ToolsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { color: GOLD, fontWeight: '700' },
        headerTintColor: GOLD,
        headerBackTitle: 'Tools',
      }}
    >
      <Stack.Screen name="ToolsList" component={ToolsScreen} options={{ title: 'Tools', headerShown: false }} />
      <Stack.Screen name="CaloriesCalculator" component={CaloriesCalculatorScreen} options={{ title: 'Calorie Calculator' }} />
    </Stack.Navigator>
  );
}

// ─── Tab Icon ─────────────────────────────────────────────────────────────────

function TabIcon({ label, color }: Readonly<{ label: string; color: string }>) {
  return <Text style={{ fontSize: 18, color }}>{label}</Text>;
}

// ─── Bottom Tabs ─────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<TabParamList>();

const homeTabIcon = ({ color }: { color: string }) => <TabIcon label="🏠" color={color} />;
const toolsTabIcon = ({ color }: { color: string }) => <TabIcon label="🔧" color={color} />;

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#1a1a1a', borderTopColor: '#333' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: homeTabIcon }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStack}
        options={{ tabBarLabel: 'Tools', tabBarIcon: toolsTabIcon }}
      />
    </Tab.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
