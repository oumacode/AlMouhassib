import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';

const ProfileScreen = () => {
  const user = {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    cooperative: 'تعاونية الزراعة',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color={colors.olive} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.cooperative}>{user.cooperative}</Text>
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="settings" size={24} color={colors.sea} />
          <Text style={styles.settingText}>الإعدادات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle" size={24} color={colors.sea} />
          <Text style={styles.settingText}>المساعدة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="log-out" size={24} color={colors.sea} />
          <Text style={styles.settingText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.sea,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: colors.sea,
    marginTop: 5,
  },
  cooperative: {
    fontSize: 16,
    color: colors.olive,
    marginTop: 5,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    color: colors.sea,
    marginLeft: 15,
    textAlign: 'right',
    flex: 1,
  },
});

export default ProfileScreen;