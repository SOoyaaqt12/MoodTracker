import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const { width } = Dimensions.get('window');

const NewsList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=4b3e2ee00e7f4f73b1c2a53f672d73aa'
        );
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.cardShadow}
      onPress={() =>
        router.push({
          pathname: `/article/${encodeURIComponent(item.title)}`,
          params: { article: JSON.stringify(item) },
        })
      }
    >
      <View style={styles.card}>
        <Image
          source={{
            uri:
              item.urlToImage ||
              'https://via.placeholder.com/400x200?text=No+Image',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.source}>{item.source.name}</Text>
            <Text style={styles.date}>
              {new Date(item.publishedAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.readMoreRow}>
            <Text style={styles.author}>
              {item.author ? `By ${item.author}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/article/${encodeURIComponent(item.title)}`,
                  params: { article: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.link}>Read more →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading News...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.url}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
    backgroundColor: '#E6F0FF',
    paddingBottom: 24,
  },
  cardShadow: {
    marginBottom: 18,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: '#fff', // putih biar kontras dan rapi
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: width - 48,
    height: 180,
    backgroundColor: '#e0e0e0',
  },
  textContainer: {
    padding: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  source: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#4a4e69',
  },
  date: {
    fontSize: 12,
    color: '#9a8c98',
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  readMoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    flex: 1,
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default NewsList;
