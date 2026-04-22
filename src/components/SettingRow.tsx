import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import SoftCard from './SoftCard';
import { theme } from '../theme/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type SettingRowProps = {
  icon: IconName;
  title: string;
  onPress?: () => void;
};

const SettingRow = ({ icon, title, onPress }: SettingRowProps) => {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <SoftCard style={styles.card}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={theme.colors.deepContrast}
          />
          <AppText size={18} weight="semiBold" style={styles.title}>
            {title}
          </AppText>
          <View style={styles.iconBubble}>
            <MaterialCommunityIcons name={icon} size={24} color={theme.colors.deepContrast} />
          </View>
        </View>
      </SoftCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: theme.radius.soft,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: '#FFFFFFB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingRow;
