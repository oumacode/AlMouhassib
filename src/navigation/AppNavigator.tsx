import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootTabParamList = {
  Home: undefined;
  Scan: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Scan') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.terracotta,
          tabBarInactiveTintColor: colors.sea,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.sand,
          },
          headerStyle: {
            backgroundColor: colors.sand,
          },
          headerTintColor: colors.sea,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'الرئيسية' }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: 'المسح' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'الملف الشخصي' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;