import React, { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import ScreenShell from '../components/ScreenShell';
import SoftCard from '../components/SoftCard';
import { theme } from '../theme/theme';

type ScanItem = {
  id: string;
  title: string;
  date: string;
  amount: string;
  status: 'Processed' | 'Pending';
  source: 'Camera' | 'Upload';
  uri?: string;
};

const initialHistory: ScanItem[] = [
  {
    id: 'doc-1',
    title: 'Invoice - Market Supplies',
    date: '22 Apr 2026',
    amount: '1,120 MAD',
    status: 'Processed',
    source: 'Camera',
  },
  {
    id: 'doc-2',
    title: 'Transportation Receipt',
    date: '20 Apr 2026',
    amount: '260 MAD',
    status: 'Processed',
    source: 'Upload',
  },
  {
    id: 'doc-3',
    title: 'Packaging Expense',
    date: '18 Apr 2026',
    amount: '410 MAD',
    status: 'Pending',
    source: 'Camera',
  },
];

const ScanScreen = () => {
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanItem[]>(initialHistory);

  const stats = useMemo(() => {
    const processed = history.filter((item) => item.status === 'Processed').length;
    return { total: history.length, processed };
  }, [history]);

  const handleScan = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert('Camera Permission', 'Please allow camera access to scan documents.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      setLastImage(result.assets[0].uri);
      setHistory((current) => [
        {
          id: `${now.getTime()}`,
          title: 'New Scanned Document',
          date: formatted,
          amount: '0 MAD',
          status: 'Pending',
          source: 'Camera',
          uri: result.assets[0].uri,
        },
        ...current,
      ]);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText size={30} weight="bold">
          Scan Center
        </AppText>
        <AppText size={16} color={`${theme.colors.deepContrast}AA`}>
          Capture your document and keep all scanned records organized.
        </AppText>
      </View>

      <SoftCard style={styles.scanCard}>
        <Pressable
          onPress={handleScan}
          style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
        >
          <MaterialCommunityIcons name="camera-outline" size={42} color="#FFFFFF" />
          <AppText size={24} weight="bold" color="#FFFFFF" align="center">
            Scan Document
          </AppText>
          <AppText size={14} color="#FFFFFFD9" align="center">
            Tap to open the camera
          </AppText>
        </Pressable>

        <View style={styles.scanStats}>
          <View style={styles.scanStatsItem}>
            <AppText size={14} color={`${theme.colors.deepContrast}B3`}>
              Total Scanned
            </AppText>
            <AppText size={22} weight="bold">
              {stats.total}
            </AppText>
          </View>
          <View style={styles.scanStatsItem}>
            <AppText size={14} color={`${theme.colors.deepContrast}B3`}>
              Processed
            </AppText>
            <AppText size={22} weight="bold" color={theme.colors.primaryAction}>
              {stats.processed}
            </AppText>
          </View>
        </View>
      </SoftCard>

      {lastImage ? (
        <SoftCard style={styles.previewCard}>
          <AppText size={18} weight="semiBold">
            Last Scan Preview
          </AppText>
          <Image source={{ uri: lastImage }} style={styles.previewImage} />
        </SoftCard>
      ) : null}

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <AppText size={23} weight="bold">
            Scan History
          </AppText>
          <View style={styles.filterPill}>
            <MaterialCommunityIcons name="history" size={15} color={theme.colors.deepContrast} />
            <AppText size={13} weight="semiBold">
              Recent
            </AppText>
          </View>
        </View>

        <View style={styles.historyList}>
          {history.map((item) => (
            <SoftCard key={item.id} style={styles.historyItem}>
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons
                  name={item.status === 'Processed' ? 'file-check-outline' : 'file-clock-outline'}
                  size={24}
                  color={theme.colors.primaryAction}
                />
              </View>
              <View style={styles.itemContent}>
                <AppText size={18} weight="semiBold">
                  {item.title}
                </AppText>
                <AppText size={14} color={`${theme.colors.deepContrast}B3`}>
                  {item.date} • {item.source}
                </AppText>
              </View>
              <View style={styles.itemMeta}>
                <AppText size={16} weight="bold">
                  {item.amount}
                </AppText>
                <View
                  style={[
                    styles.statusPill,
                    item.status === 'Processed' ? styles.statusProcessed : styles.statusPending,
                  ]}
                >
                  <AppText
                    size={12}
                    weight="semiBold"
                    color={item.status === 'Processed' ? '#2D7A35' : '#8A5B20'}
                  >
                    {item.status}
                  </AppText>
                </View>
              </View>
            </SoftCard>
          ))}
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.item,
  },
  header: {
    gap: 6,
  },
  scanCard: {
    gap: 16,
  },
  scanButton: {
    minHeight: 176,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: theme.colors.primaryAction,
  },
  scanButtonPressed: {
    opacity: 0.88,
  },
  scanStats: {
    flexDirection: 'row',
    gap: 10,
  },
  scanStatsItem: {
    flex: 1,
    backgroundColor: '#F8F3ED',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  previewCard: {
    gap: 10,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  historySection: {
    gap: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECE4DA',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 22,
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8EDE8',
  },
  itemContent: {
    flex: 1,
    gap: 1,
  },
  itemMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusProcessed: {
    backgroundColor: '#EAF6EE',
  },
  statusPending: {
    backgroundColor: '#FBEEDB',
  },
});

export default ScanScreen;
