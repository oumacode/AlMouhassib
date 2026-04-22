import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../../colors';
import { RootTabParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const userName = 'أحمد'; // Placeholder name

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>السلام عليكم، {userName}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="wallet" size={40} color={colors.olive} />
          <Text style={styles.cardTitle}>الدخل</Text>
          <Text style={styles.cardValue}>5000 درهم</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="card" size={40} color={colors.terracotta} />
          <Text style={styles.cardTitle}>المصروفات</Text>
          <Text style={styles.cardValue}>3000 درهم</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="trending-up" size={40} color={colors.ochre} />
          <Text style={styles.cardTitle}>الربح</Text>
          <Text style={styles.cardValue}>2000 درهم</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Scan')}>
            <Ionicons name="camera" size={30} color={colors.white} />
            <Text style={styles.actionText}>مسح</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => {/* Open chatbot */}}>
            <Ionicons name="chatbubble" size={30} color={colors.white} />
            <Text style={styles.actionText}>اسأل</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.sea,
    textAlign: 'right',
  },
  cardsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: colors.sea,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.sea,
    marginTop: 10,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.terracotta,
    marginTop: 5,
  },
  actionsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.sea,
    marginBottom: 20,
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: colors.olive,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: 120,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 10,
  },
});

export default HomeScreen;