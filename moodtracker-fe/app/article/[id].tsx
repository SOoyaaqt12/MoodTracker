import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export const options = {
  headerShown: false,
};

export default function ArticleDetail() {
  const { article } = useLocalSearchParams();

  // Jika artikel dikirim sebagai JSON string, parse dulu
  const parsedArticle = typeof article === 'string' ? JSON.parse(article) : article;

  if (!parsedArticle) return <Text>Artikel tidak ditemukan</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: parsedArticle.urlToImage }} style={styles.image} />
      <Text style={styles.title}>{parsedArticle.title}</Text>
      <Text style={styles.source}>Source: {parsedArticle.source.name}</Text>
      <Text style={styles.author}>By: {parsedArticle.author}</Text>
      <Text style={styles.content}>{parsedArticle.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  source: { fontSize: 14, fontStyle: 'italic', marginBottom: 4 },
  author: { fontSize: 14, marginBottom: 8 },
  content: { fontSize: 16 },
});