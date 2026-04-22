import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';
import { theme } from '../theme/theme';

type TextWeight = 'regular' | 'semiBold' | 'bold';

const fontFamilyByWeight: Record<TextWeight, string> = {
  regular: 'Cairo_400Regular',
  semiBold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold',
};

type AppTextProps = TextProps & {
  weight?: TextWeight;
  color?: string;
  size?: number;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
};

const AppText = ({
  weight = 'regular',
  color = theme.colors.deepContrast,
  size = theme.typography.base,
  align = 'left',
  style,
  ...textProps
}: AppTextProps) => {
  return (
    <Text
      {...textProps}
      style={[
        styles.base,
        {
          fontFamily: fontFamilyByWeight[weight],
          fontSize: size,
          lineHeight: Math.round(size * 1.45),
          color,
          textAlign: align,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    writingDirection: 'auto',
    includeFontPadding: false,
  },
});

export default AppText;
