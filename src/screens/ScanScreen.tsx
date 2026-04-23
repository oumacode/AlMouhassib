import React, { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AppText from '../components/AppText';
import ScreenShell from '../components/ScreenShell';
import SoftCard from '../components/SoftCard';
import { acquireImage, requestAcquisitionPermissions } from '../services/imageAcquisition';
import { extractTextWithGemini } from '../services/ocr/geminiOcr';
import { parseFinancialText } from '../services/ocr/parseFinancialText';
import { FinancialDocumentDraft, ImageSource } from '../types/financialDocument';
import { theme } from '../theme/theme';

type ScanItem = {
  id: string;
  merchantName: string;
  date: string;
  amount: string;
  tax: string;
  status: 'Processed' | 'Pending';
  source: 'Camera' | 'Gallery';
  uri?: string;
};

const initialHistory: ScanItem[] = [
  {
    id: 'doc-1',
    merchantName: 'Coop Marché Central',
    date: '22/04/2026',
    amount: '1,120.00',
    tax: '186.67',
    status: 'Processed',
    source: 'Camera',
  },
  {
    id: 'doc-2',
    merchantName: 'Transport Atlas',
    date: '20/04/2026',
    amount: '260.00',
    tax: '43.33',
    status: 'Processed',
    source: 'Gallery',
  },
];

const makeDefaultDraft = (imageUri: string, source: ImageSource): FinancialDocumentDraft => ({
  id: `${Date.now()}`,
  imageUri,
  rawText: '',
  merchantName: '',
  transactionDate: '',
  totalTTC: '',
  taxTVA: '',
  source,
  createdAtIso: new Date().toISOString(),
});

const ScanScreen = () => {
  const [history, setHistory] = useState<ScanItem[]>(initialHistory);
  const [draft, setDraft] = useState<FinancialDocumentDraft | null>(null);
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const processed = history.filter((item) => item.status === 'Processed').length;
    return { total: history.length, processed };
  }, [history]);

  const setDraftField = (
    key: keyof Pick<
      FinancialDocumentDraft,
      'merchantName' | 'transactionDate' | 'totalTTC' | 'taxTVA'
    >,
    value: string
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const runOcrPipeline = async (source: ImageSource) => {
    setOcrError(null);

    const permissions = await requestAcquisitionPermissions();

    if (source === 'camera' && !permissions.cameraGranted) {
      Alert.alert(
        'Camera permission required',
        'Please enable camera permission to capture receipts.'
      );
      return;
    }

    if (source === 'gallery' && !permissions.galleryGranted) {
      Alert.alert(
        'Gallery permission required',
        'Please enable photo library permission to import receipts.'
      );
      return;
    }

    const imageUri = await acquireImage(source);
    if (!imageUri) {
      return;
    }

    setLastImage(imageUri);
    setIsProcessing(true);

    try {
      const rawText = await extractTextWithGemini(imageUri);
      const parsedFields = parseFinancialText(rawText);

      setDraft({
        ...makeDefaultDraft(imageUri, source),
        rawText,
        merchantName: parsedFields.merchantName ?? '',
        transactionDate: parsedFields.transactionDate ?? '',
        totalTTC: parsedFields.totalTTC ?? '',
        taxTVA: parsedFields.taxTVA ?? '',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected OCR error. Please retry.';
      setOcrError(message);
      Alert.alert('OCR failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDraft = () => {
    if (!draft) {
      return;
    }

    const sourceLabel = draft.source === 'camera' ? 'Camera' : 'Gallery';

    setHistory((current) => [
      {
        id: draft.id,
        merchantName: draft.merchantName || 'Unknown merchant',
        date: draft.transactionDate || new Date(draft.createdAtIso).toLocaleDateString('fr-MA'),
        amount: draft.totalTTC || '0.00',
        tax: draft.taxTVA || 'N/A',
        status: 'Processed',
        source: sourceLabel,
        uri: draft.imageUri,
      },
      ...current,
    ]);

    setDraft(null);
  };

  const handleDiscardDraft = () => {
    setDraft(null);
    setOcrError(null);
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText size={30} weight="bold">
          Document Capture
        </AppText>
        <AppText size={16} color={`${theme.colors.deepContrast}AA`}>
          Capture or import invoices, then review OCR fields before saving.
        </AppText>
      </View>

      <SoftCard style={styles.captureCard}>
        <View style={styles.captureActions}>
          <Pressable
            onPress={() => runOcrPipeline('camera')}
            style={({ pressed }) => [
              styles.captureButton,
              styles.cameraButton,
              pressed && styles.capturePressed,
            ]}
          >
            <MaterialCommunityIcons name="camera-outline" size={26} color="#FFFFFF" />
            <AppText size={16} weight="bold" color="#FFFFFF" align="center">
              Take Photo
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => runOcrPipeline('gallery')}
            style={({ pressed }) => [
              styles.captureButton,
              styles.galleryButton,
              pressed && styles.capturePressed,
            ]}
          >
            <MaterialCommunityIcons name="image-outline" size={26} color={theme.colors.deepContrast} />
            <AppText size={16} weight="bold" align="center">
              Pick from Gallery
            </AppText>
          </Pressable>
        </View>

        <View style={styles.scanStats}>
          <View style={styles.scanStatsItem}>
            <AppText size={14} color={`${theme.colors.deepContrast}B3`}>
              Total docs
            </AppText>
            <AppText size={22} weight="bold">
              {stats.total}
            </AppText>
          </View>
          <View style={styles.scanStatsItem}>
            <AppText size={14} color={`${theme.colors.deepContrast}B3`}>
              OCR processed
            </AppText>
            <AppText size={22} weight="bold" color={theme.colors.primaryAction}>
              {stats.processed}
            </AppText>
          </View>
        </View>

        {isProcessing ? (
          <View style={styles.processingBox}>
            <ActivityIndicator size="small" color={theme.colors.primaryAction} />
            <AppText size={15}>Analyzing image with OCR...</AppText>
          </View>
        ) : null}

        {ocrError ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#8A2E21" />
            <AppText size={14} color="#8A2E21">
              {ocrError}
            </AppText>
          </View>
        ) : null}
      </SoftCard>

      {lastImage ? (
        <SoftCard style={styles.previewCard}>
          <AppText size={18} weight="semiBold">
            Latest document image
          </AppText>
          <Image source={{ uri: lastImage }} style={styles.previewImage} />
        </SoftCard>
      ) : null}

      {draft ? (
        <SoftCard style={styles.reviewCard}>
          <AppText size={22} weight="bold">
            Review extracted fields
          </AppText>

          <View style={styles.fieldGroup}>
            <AppText size={14}>Merchant / Supplier</AppText>
            <TextInput
              value={draft.merchantName}
              onChangeText={(text) => setDraftField('merchantName', text)}
              placeholder="Merchant name"
              placeholderTextColor={`${theme.colors.deepContrast}70`}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText size={14}>Date</AppText>
            <TextInput
              value={draft.transactionDate}
              onChangeText={(text) => setDraftField('transactionDate', text)}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={`${theme.colors.deepContrast}70`}
              style={styles.input}
            />
          </View>

          <View style={styles.twoColumns}>
            <View style={styles.fieldGroupColumn}>
              <AppText size={14}>Total (TTC)</AppText>
              <TextInput
                value={draft.totalTTC}
                onChangeText={(text) => setDraftField('totalTTC', text)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={`${theme.colors.deepContrast}70`}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroupColumn}>
              <AppText size={14}>TVA</AppText>
              <TextInput
                value={draft.taxTVA}
                onChangeText={(text) => setDraftField('taxTVA', text)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={`${theme.colors.deepContrast}70`}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.reviewActions}>
            <Pressable onPress={handleDiscardDraft} style={styles.secondaryAction}>
              <AppText size={15} weight="semiBold" align="center">
                Discard
              </AppText>
            </Pressable>
            <Pressable onPress={handleSaveDraft} style={styles.primaryAction}>
              <AppText size={15} weight="bold" align="center" color="#FFFFFF">
                Save Document
              </AppText>
            </Pressable>
          </View>
        </SoftCard>
      ) : null}

      <View style={styles.historySection}>
        <AppText size={23} weight="bold">
          Scan History
        </AppText>
        <View style={styles.historyList}>
          {history.map((item) => (
            <SoftCard key={item.id} style={styles.historyItem}>
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons name="file-document-outline" size={22} color={theme.colors.primaryAction} />
              </View>
              <View style={styles.itemContent}>
                <AppText size={17} weight="semiBold">
                  {item.merchantName}
                </AppText>
                <AppText size={13} color={`${theme.colors.deepContrast}B3`}>
                  {item.date} - {item.source}
                </AppText>
              </View>
              <View style={styles.itemMeta}>
                <AppText size={14} weight="semiBold">
                  TTC: {item.amount}
                </AppText>
                <AppText size={13} color={`${theme.colors.deepContrast}B3`}>
                  TVA: {item.tax}
                </AppText>
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
  captureCard: {
    gap: 14,
  },
  captureActions: {
    flexDirection: 'row',
    gap: 10,
  },
  captureButton: {
    flex: 1,
    minHeight: 110,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  cameraButton: {
    backgroundColor: theme.colors.primaryAction,
  },
  galleryButton: {
    backgroundColor: '#F8F3ED',
    borderWidth: 1,
    borderColor: '#E8D7C7',
  },
  capturePressed: {
    opacity: 0.85,
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
  processingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF6E8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEDE8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  previewCard: {
    gap: 10,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  reviewCard: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldGroupColumn: {
    flex: 1,
    gap: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D7C7',
    backgroundColor: '#FCFAF7',
    paddingHorizontal: 12,
    color: theme.colors.deepContrast,
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 15,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryAction: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryAction,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E4D7',
  },
  historySection: {
    gap: 12,
    paddingBottom: 70,
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
    gap: 2,
  },
});

export default ScanScreen;
