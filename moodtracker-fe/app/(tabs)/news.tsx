import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import axios from 'axios';


export default function News() {

    const [news, setNews] = useState([]);

    const getNews = async () => {
        try {
            const response = await axios.get("https://newsapi.org/v2/everything?q=tesla&from=2025-05-02&sortBy=publishedAt&apiKey=4b3e2ee00e7f4f73b1c2a53f672d73aa");
            setNews(response.data.articles);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }

    useEffect(() => {
        getNews();
    }, []);

  return (
    <View>
        <SafeAreaView>
            <View style={tailwind`mx-5`}>
                <Text style={tailwind`text-white text-4xl font-bold`}>News</Text>
            </View>
            <FlatList
                data={news}
                keyExtractor={(item, index) => item.url ? item.url + index : index.toString()}
                renderItem={({ item }) => (
                    <View style={tailwind`p-4 border-b border-gray-700`}>
                        <Image
                            source={{ uri: item.urlToImage }} style={tailwind`w-full h-60 rounded-lg mb-4`}
                        />
                        <Text style={tailwind`text-white text-lg font-bold`}>{item.title}</Text>
                        <Text style={tailwind`text-gray-400 text-sm`}>{item.description}</Text>
                        <Text style={tailwind`text-white mt-2`}>{item.description}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    </View>
  )
}