export const theme = {
  colors: {
    background: '#F5F2E6',
    primaryAction: '#DF5022',
    secondaryNature: '#C09B7C',
    warningHighlights: '#C09B7C',
    surfaceCards: '#FFFFFF',
    deepContrast: '#4B3A31',
  },
  spacing: {
    screen: 20,
    section: 20,
    item: 16,
    compact: 12,
  },
  radius: {
    soft: 28,
    button: 28,
    pill: 999,
  },
  typography: {
    base: 18,
    subtitle: 20,
    title: 28,
    display: 34,
  },
  shadow: {
    shadowColor: '#4B3A31',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;
