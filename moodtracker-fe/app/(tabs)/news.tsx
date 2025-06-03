import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import NewsList from '@/components/ui/Newslist';

export default function News() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>📰 Berita Terkini</Text>
        <Text style={styles.headerSubtitle}>
          Update berita terbaru untuk kesehatan mentalmu
        </Text>
      </View>
      <NewsList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FF', // lebih soft dan cerah dari sebelumnya
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#4A90E2', // biru cerah sebagai header
    borderBottomWidth: 1,
    borderBottomColor: '#d1d9e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#d9e4f5',
    fontWeight: '500',
    lineHeight: 22,
  },
});
