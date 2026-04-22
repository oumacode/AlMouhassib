import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

type SoftCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const SoftCard = ({ children, style }: SoftCardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceCards,
    borderRadius: theme.radius.soft,
    padding: theme.spacing.item,
    ...theme.shadow,
  },
});

export default SoftCard;
