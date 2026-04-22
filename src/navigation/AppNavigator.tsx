import React, { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScanScreen from '../screens/ScanScreen';
import { theme } from '../theme/theme';
import AppText from '../components/AppText';

type TabKey = 'Home' | 'Scan' | 'Profile';

const tabs: {
  key: TabKey;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  activeIcon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  {
    key: 'Home',
    label: 'Home',
    icon: 'view-dashboard-outline',
    activeIcon: 'view-dashboard',
  },
  {
    key: 'Scan',
    label: 'Scan',
    icon: 'camera-outline',
    activeIcon: 'camera',
  },
  {
    key: 'Profile',
    label: 'Profile',
    icon: 'account-circle-outline',
    activeIcon: 'account-circle',
  },
];

const AppNavigator = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('Home');

  const content = useMemo(() => {
    if (activeTab === 'Home') {
      return <HomeScreen onNavigate={setActiveTab} />;
    }

    if (activeTab === 'Scan') {
      return <ScanScreen />;
    }

    return <ProfileScreen />;
  }, [activeTab]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>{content}</View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const focused = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={({ pressed }) => [
                styles.tabItem,
                focused && styles.tabItemActive,
                pressed && styles.tabItemPressed,
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? tab.activeIcon : tab.icon}
                size={24}
                color={focused ? '#FFFFFF' : `${theme.colors.deepContrast}80`}
              />
              <AppText
                size={12}
                weight="semiBold"
                align="center"
                color={focused ? '#FFFFFF' : `${theme.colors.deepContrast}80`}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    height: 74,
    borderRadius: 24,
    backgroundColor: '#FFFDFB',
    borderWidth: 1,
    borderColor: '#EADBCD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    ...theme.shadow,
  },
  tabItem: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabItemActive: {
    backgroundColor: theme.colors.primaryAction,
  },
  tabItemPressed: {
    opacity: 0.82,
  },
});

export default AppNavigator;
