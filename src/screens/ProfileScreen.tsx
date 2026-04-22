import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import ScreenShell from '../components/ScreenShell';
import SoftCard from '../components/SoftCard';
import { theme } from '../theme/theme';

type Language = 'en' | 'ar' | 'fr';

const settingsItems: {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  { id: 'company', title: 'Cooperative Details', icon: 'office-building-outline' },
  { id: 'security', title: 'Security & Access', icon: 'shield-lock-outline' },
  { id: 'help', title: 'Help Center', icon: 'help-circle-outline' },
  { id: 'about', title: 'About App', icon: 'information-outline' },
];

const ProfileScreen = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <SoftCard style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <MaterialCommunityIcons name="account" size={48} color={theme.colors.primaryAction} />
        </View>
        <View style={styles.profileText}>
          <AppText size={26} weight="bold">
            Salma El Idrissi
          </AppText>
          <AppText size={15} color={`${theme.colors.deepContrast}B3`}>
            Cooperative Manager
          </AppText>
          <AppText size={14} color={theme.colors.primaryAction}>
            Coopérative Al Amal - Fès
          </AppText>
        </View>
        <Pressable style={styles.editButton}>
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={20}
            color={theme.colors.deepContrast}
          />
        </Pressable>
      </SoftCard>

      <SoftCard style={styles.preferenceCard}>
        <AppText size={22} weight="bold">
          Preferences
        </AppText>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceLeft}>
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={20}
              color={theme.colors.primaryAction}
            />
            <AppText size={17} weight="semiBold">
              Notifications
            </AppText>
          </View>
          <Pressable
            onPress={() => setNotificationsEnabled((current) => !current)}
            style={[
              styles.toggleTrack,
              notificationsEnabled && styles.toggleTrackEnabled,
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                notificationsEnabled && styles.toggleThumbEnabled,
              ]}
            />
          </Pressable>
        </View>

        <View style={styles.languageWrap}>
          <AppText size={17} weight="semiBold">
            Language
          </AppText>
          <View style={styles.languageRow}>
            {[
              { code: 'en' as const, label: 'EN' },
              { code: 'fr' as const, label: 'FR' },
              { code: 'ar' as const, label: 'AR' },
            ].map((item) => {
              const selected = item.code === language;

              return (
                <Pressable
                  key={item.code}
                  onPress={() => setLanguage(item.code)}
                  style={[styles.languagePill, selected && styles.languagePillActive]}
                >
                  <AppText
                    size={14}
                    weight="semiBold"
                    align="center"
                    color={selected ? '#FFFFFF' : theme.colors.deepContrast}
                  >
                    {item.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SoftCard>

      <View style={styles.settingsList}>
        {settingsItems.map((item) => (
          <SoftCard key={item.id} style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name={item.icon} size={22} color={theme.colors.primaryAction} />
            </View>
            <AppText size={18} weight="semiBold" style={styles.settingTitle}>
              {item.title}
            </AppText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={`${theme.colors.deepContrast}A6`}
            />
          </SoftCard>
        ))}
      </View>

      <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}>
        <MaterialCommunityIcons name="logout" size={22} color="#FFFFFF" />
        <AppText size={19} weight="bold" color="#FFFFFF">
          Log Out
        </AppText>
      </Pressable>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.item,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  avatarWrap: {
    width: 66,
    height: 66,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6E7DF',
  },
  profileText: {
    flex: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFE4D6',
  },
  preferenceCard: {
    gap: 14,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleTrack: {
    width: 56,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#D3C1AE',
    padding: 3,
    justifyContent: 'center',
  },
  toggleTrackEnabled: {
    backgroundColor: theme.colors.primaryAction,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbEnabled: {
    alignSelf: 'flex-end',
  },
  languageWrap: {
    gap: 10,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  languagePill: {
    minWidth: 56,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2D2C2',
    backgroundColor: '#FAF6F1',
  },
  languagePillActive: {
    borderColor: theme.colors.primaryAction,
    backgroundColor: theme.colors.primaryAction,
  },
  settingsList: {
    gap: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8EDE5',
  },
  settingTitle: {
    flex: 1,
  },
  logoutButton: {
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryAction,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutPressed: {
    opacity: 0.88,
  },
});

export default ProfileScreen;
