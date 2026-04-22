import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';

const ScanScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('غير مدعوم', 'أداة اختيار الصور غير متوفرة على الويب');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('إذن مطلوب', 'أذونات مكتبة الوسائط مطلوبة!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Mock extracted data
      setExtractedData({
        amount: '150 درهم',
        date: '2024-04-22',
        type: 'فاتورة شراء',
      });
    }
  };

  const history = [
    { id: 1, amount: '200 درهم', date: '2024-04-20', type: 'فاتورة بيع' },
    { id: 2, amount: '50 درهم', date: '2024-04-18', type: 'فاتورة خدمات' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>مسح الفاتورة</Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Ionicons name="camera" size={50} color={colors.white} />
        <Text style={styles.uploadText}>📷 مسح الفاتورة</Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>معاينة الصورة</Text>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      {extractedData && (
        <View style={styles.dataContainer}>
          <Text style={styles.sectionTitle}>البيانات المستخرجة</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>المبلغ:</Text>
            <Text style={styles.dataValue}>{extractedData.amount}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>التاريخ:</Text>
            <Text style={styles.dataValue}>{extractedData.date}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>النوع:</Text>
            <Text style={styles.dataValue}>{extractedData.type}</Text>
          </View>
        </View>
      )}

      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>الوثائق المحللة</Text>
        {history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.historyText}>{item.type} - {item.amount} - {item.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.sea,
  },
  uploadButton: {
    backgroundColor: colors.terracotta,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadText: {
    color: colors.white,
    fontSize: 20,
    marginTop: 10,
  },
  previewContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.sea,
    marginBottom: 15,
    textAlign: 'right',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  dataContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataLabel: {
    fontSize: 16,
    color: colors.sea,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.terracotta,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: colors.sea,
    textAlign: 'right',
  },
});

export default ScanScreen;