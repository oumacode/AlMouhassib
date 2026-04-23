export type ImageSource = 'camera' | 'gallery';

export type FinancialDocumentDraft = {
  id: string;
  imageUri: string;
  rawText: string;
  merchantName: string;
  transactionDate: string;
  totalTTC: string;
  taxTVA: string;
  source: ImageSource;
  createdAtIso: string;
};

export type ParsedFinancialFields = {
  merchantName: string | null;
  transactionDate: string | null;
  totalTTC: string | null;
  taxTVA: string | null;
};
