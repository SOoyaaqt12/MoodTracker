import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ScrollView,
} from 'react-native';

export default function WeatherApp() {
  const [location, setLocation] = useState('Jakarta');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otherWeather, setOtherWeather] = useState([]);
  const API_KEY = '581e1067fc3b43d297430426250306';

  const otherCities = ['Surabaya', 'Bandung', 'Medan', 'Denpasar'];

  const fetchWeather = async (loc) => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${loc}`
      );
      const data = await response.json();
      if (!data.error) {
        setWeather(data);
        setLocation(loc);
        setSuggestions([]);
      } else {
        alert('Lokasi tidak ditemukan.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengambil data cuaca.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (text) => {
    setSearch(text);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${text}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Gagal mengambil saran lokasi:', error);
    }
  };

  const fetchOtherWeather = async () => {
    try {
      const results = await Promise.all(
        otherCities.map(async (city) => {
          const res = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
          );
          return await res.json();
        })
      );
      setOtherWeather(results);
    } catch (error) {
      console.error('Gagal mengambil data kota lain:', error);
    }
  };

  const handleSelectSuggestion = (name) => {
    setSearch(name);
    fetchWeather(name);
  };

  useEffect(() => {
    fetchWeather(location);
    fetchOtherWeather();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6F0FF" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.appTitle}>🌤️ Weather App</Text>

        <View style={styles.searchBox}>
          <TextInput
            value={search}
            onChangeText={fetchSuggestions}
            placeholder="Cari lokasi..."
            style={styles.input}
          />
        </View>

        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id?.toString() || item.name}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item.name)}
              >
                <Text>{item.name}, {item.country}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {loading && <ActivityIndicator size="large" color="#0077FF" />}

        {!loading && weather && (
          <>
            <Text style={styles.city}>{weather.location.name}, {weather.location.country}</Text>
            <Image source={{ uri: `https:${weather.current.condition.icon}` }} style={styles.icon} />
            <Text style={styles.temp}>{weather.current.temp_c}°C</Text>
            <Text style={styles.condition}>{weather.current.condition.text}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.info}>💧 Kelembapan: {weather.current.humidity}%</Text>
              <Text style={styles.info}>🌬️ Angin: {weather.current.wind_kph} kph</Text>
              <Text style={styles.info}>🌡️ Terasa seperti: {weather.current.feelslike_c}°C</Text>
            </View>

            <Text style={styles.updated}>Terakhir diperbarui: {weather.current.last_updated}</Text>

            <Text style={styles.sectionTitle}>🌍 Cuaca di Kota Lain</Text>
            <FlatList
              data={otherWeather}
              horizontal
              keyExtractor={(item) => item.location.name}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => fetchWeather(item.location.name)}
                  style={styles.otherCard}
                >
                  <Text style={styles.otherCity}>{item.location.name}</Text>
                  <Image source={{ uri: `https:${item.current.condition.icon}` }} style={styles.otherIcon} />
                  <Text style={styles.otherTemp}>{item.current.temp_c}°C</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E6F0FF',
    paddingTop: 20,
  },
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  searchBox: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 44,
    elevation: 2,
  },
  suggestionList: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  city: {
    fontSize: 28,
    fontWeight: '600',
    color: '#003366',
    textAlign: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 12,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#0055CC',
  },
  condition: {
    fontSize: 22,
    color: '#333',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#ffffffcc',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginVertical: 10,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  updated: {
    fontSize: 12,
    color: '#555',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  otherCard: {
    backgroundColor: '#ffffffcc',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
  },
  otherCity: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#003366',
  },
  otherIcon: {
    width: 40,
    height: 40,
    marginVertical: 6,
  },
  otherTemp: {
    fontSize: 16,
    color: '#0055CC',
  },
});