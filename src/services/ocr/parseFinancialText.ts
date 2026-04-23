import { ParsedFinancialFields } from '../../types/financialDocument';

const amountRegex =
  /((?:\d{1,3}(?:[ .]\d{3})*|\d+)(?:[.,]\d{2})?)\s*(?:MAD|DHS?|DH|د\.?م|درهم)?/i;

const datePatterns = [
  /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/,
  /\b(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/,
];

const hasLetters = (value: string) => /[A-Za-z\u0600-\u06FF]/.test(value);

const sanitize = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();

const formatAmount = (raw: string) => sanitize(raw).replace(/\s+/g, '');

const pickByKeyword = (lines: string[], keywords: string[]) => {
  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (!keywords.some((keyword) => normalized.includes(keyword))) {
      continue;
    }

    const amountMatch = line.match(amountRegex);
    if (amountMatch) {
      return formatAmount(amountMatch[1]);
    }
  }

  return null;
};

const extractDate = (rawText: string) => {
  for (const pattern of datePatterns) {
    const match = rawText.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const extractMerchantName = (lines: string[]) => {
  const ignoredKeywords = [
    'facture',
    'ticket',
    'receipt',
    'reçu',
    'date',
    'tva',
    'total',
    'ttc',
    'ht',
    'ice',
    'if',
    'patente',
    'tel',
    'phone',
    'adresse',
  ];

  for (const line of lines) {
    if (line.length < 3 || /\d/.test(line) || !hasLetters(line)) {
      continue;
    }

    const normalized = line.toLowerCase();
    if (ignoredKeywords.some((word) => normalized.includes(word))) {
      continue;
    }

    return line;
  }

  return null;
};

export const parseFinancialText = (rawText: string): ParsedFinancialFields => {
  const cleanedLines = rawText
    .split(/\r?\n/)
    .map((line) => sanitize(line))
    .filter(Boolean);

  const totalTTC =
    pickByKeyword(cleanedLines, ['ttc', 'total', 'à payer', 'a payer', 'net']) ??
    cleanedLines
      .map((line) => line.match(amountRegex)?.[1] ?? null)
      .filter((candidate): candidate is string => Boolean(candidate))
      .map((candidate) => formatAmount(candidate))
      .at(-1) ??
    null;

  const taxTVA = pickByKeyword(cleanedLines, ['tva', 'taxe']);
  const transactionDate = extractDate(rawText);
  const merchantName = extractMerchantName(cleanedLines);

  return {
    merchantName,
    transactionDate,
    totalTTC,
    taxTVA,
  };
};
