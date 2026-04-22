import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import SoftCard from './SoftCard';
import { theme } from '../theme/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type MetricCardProps = {
  title: string;
  value: string;
  accentColor: string;
  icon: IconName;
};

const MetricCard = ({ title, value, accentColor, icon }: MetricCardProps) => {
  return (
    <SoftCard style={styles.card}>
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={30} color={accentColor} />
      </View>
      <AppText size={16} weight="semiBold">
        {title}
      </AppText>
      <AppText size={20} weight="bold" color={accentColor}>
        {value}
      </AppText>
    </SoftCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    minHeight: 174,
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  accentLine: {
    width: '64%',
    height: 8,
    borderRadius: theme.radius.pill,
    marginBottom: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.pill,
    backgroundColor: '#FFFFFFB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MetricCard;
