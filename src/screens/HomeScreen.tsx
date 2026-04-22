import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import ScreenShell from '../components/ScreenShell';
import SoftCard from '../components/SoftCard';
import { theme } from '../theme/theme';

type TabKey = 'Home' | 'Scan' | 'Profile';

type HomeScreenProps = {
  onNavigate?: (tab: TabKey) => void;
};

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type StatCard = {
  title: string;
  value: string;
  delta: string;
  icon: IconName;
  tone: string;
};

type QuickAction = {
  title: string;
  icon: IconName;
  action: TabKey;
};

const chartBars = [11, 16, 21, 15, 24, 31, 28, 38];

const stats: StatCard[] = [
  { title: 'Revenus', value: '45,000 MAD', delta: '+15%', icon: 'cash-plus', tone: '#EAF6EE' },
  { title: 'Dépenses', value: '12,500 MAD', delta: '-4%', icon: 'cash-minus', tone: '#FCECE7' },
  { title: 'Résultat', value: '32,500 MAD', delta: '+9%', icon: 'chart-line', tone: '#EFE8E1' },
  { title: 'Factures', value: '24 docs', delta: '+3', icon: 'file-document-outline', tone: '#F8F3EC' },
];

const quickActions: QuickAction[] = [
  { title: 'Scan', icon: 'camera-outline', action: 'Scan' },
  { title: 'Add Expense', icon: 'plus-circle-outline', action: 'Home' },
  { title: 'Cash Flow', icon: 'chart-bar', action: 'Home' },
  { title: 'Profile', icon: 'account-cog-outline', action: 'Profile' },
];

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Pressable style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={22} color={theme.colors.deepContrast} />
          </Pressable>
          <AppText size={34} weight="bold" color={theme.colors.primaryAction}>
            Almohassib
          </AppText>
          <View style={styles.rightIcons}>
            <Pressable style={styles.iconButton}>
              <MaterialCommunityIcons
                name="tune-variant"
                size={20}
                color={theme.colors.deepContrast}
              />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color={theme.colors.deepContrast}
              />
            </Pressable>
          </View>
        </View>
        <AppText size={29} weight="bold">
          Welcome back, Salma
        </AppText>
        <AppText size={16} color={`${theme.colors.deepContrast}AA`}>
          Your cooperative is moving in a healthy direction.
        </AppText>
      </View>

      <SoftCard style={styles.dashboardCard}>
        <View style={styles.dashboardHead}>
          <AppText size={24} weight="bold">
            Dashboard
          </AppText>
          <View style={styles.monthChip}>
            <AppText size={15} weight="semiBold" color={theme.colors.deepContrast}>
              Mai
            </AppText>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={theme.colors.deepContrast}
            />
          </View>
        </View>
        <View style={styles.chartArea}>
          {[0, 1, 2, 3].map((line) => (
            <View key={line} style={styles.gridLine} />
          ))}
          <View style={styles.barRow}>
            {chartBars.map((value, index) => (
              <View key={`${value}-${index}`} style={styles.barWrap}>
                <View style={[styles.bar, { height: `${value * 2}%` }]} />
              </View>
            ))}
          </View>
        </View>
      </SoftCard>

      <View style={styles.sectionBlock}>
        <AppText size={23} weight="bold">
          4 Important Statistics
        </AppText>
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <SoftCard key={item.title} style={styles.statCard}>
              <View style={styles.statHead}>
                <View style={[styles.statIconWrap, { backgroundColor: item.tone }]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={21}
                    color={theme.colors.primaryAction}
                  />
                </View>
                <AppText size={14} weight="semiBold" color={theme.colors.primaryAction}>
                  {item.delta}
                </AppText>
              </View>
              <AppText size={16} color={`${theme.colors.deepContrast}B3`}>
                {item.title}
              </AppText>
              <AppText size={24} weight="bold">
                {item.value}
              </AppText>
            </SoftCard>
          ))}
        </View>
      </View>

      <SoftCard style={styles.quickActionsCard}>
        <View style={styles.quickHeader}>
          <AppText size={23} weight="bold">
            Quick Actions
          </AppText>
          <MaterialCommunityIcons name="flash-outline" size={24} color={theme.colors.primaryAction} />
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.title}
              onPress={() => onNavigate?.(action.action)}
              style={({ pressed }) => [styles.quickItem, pressed && styles.quickPressed]}
            >
              <View style={styles.quickIconWrap}>
                <MaterialCommunityIcons
                  name={action.icon}
                  size={24}
                  color={theme.colors.primaryAction}
                />
              </View>
              <AppText size={15} weight="semiBold" align="center">
                {action.title}
              </AppText>
            </Pressable>
          ))}
        </View>
      </SoftCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.item,
  },
  hero: {
    gap: 6,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFCC',
  },
  dashboardCard: {
    gap: 14,
  },
  dashboardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthChip: {
    minWidth: 88,
    height: 36,
    borderRadius: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#F5F2E6',
  },
  chartArea: {
    minHeight: 180,
    borderRadius: 18,
    backgroundColor: '#FDFCF8',
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'flex-end',
    gap: 8,
  },
  gridLine: {
    borderTopWidth: 1,
    borderTopColor: '#C09B7C4D',
  },
  barRow: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  barWrap: {
    flex: 1,
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 22,
    backgroundColor: theme.colors.primaryAction,
  },
  sectionBlock: {
    gap: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '50%',
    padding: 14,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2E7DA',
  },
  statHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsCard: {
    gap: 14,
  },
  quickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickItem: {
    width: '50%',
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 8,
  },
  quickIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F2E6',
    borderWidth: 1,
    borderColor: '#E6D5C4',
  },
  quickPressed: {
    opacity: 0.72,
  },
});

export default HomeScreen;
