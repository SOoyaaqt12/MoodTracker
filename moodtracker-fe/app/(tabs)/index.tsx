import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function HomeScreen() {
  const [nama, setNama] = useState('');
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(null);
  const [moodList, setMoodList] = useState([
    { label: 'Senang', value: 'senang' },
    { label: 'Sedih', value: 'sedih' },
    { label: 'Stress', value: 'stress' },
  ]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateString, setDateString] = useState('');

  const formatDate = (dateObj: Date) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      setDateString(formatDate(selectedDate));
    }
  };



  return (
    <View>
      <SafeAreaView>
        <View style={tw`mx-5`}>
          <Text style={tw`text-white text-3xl font-bold`}>index</Text>
          <View style={tw`mt-5 gap-3`}>
            {/* input mood */}
            <TextInput
              value={nama}
              style={tw`border border-gray-300 rounded-lg h-13 p-2 text-black`}
              placeholder="Apa mood kamu hari ini?"
              placeholderTextColor="gray"
            />
            {/* dropdown mood */}
            <DropDownPicker
              open={open}
              value={mood}
              items={moodList}
              setOpen={setOpen}
              setValue={setMood}
              setItems={setMoodList}
              placeholder="Pilih mood"
              style={tw`border border-gray-500 bg-black rounded-lg`}
              dropDownContainerStyle={tw`border border-gray-500 bg-black`}
              textStyle={tw`text-white`}
              placeholderStyle={tw`text-white`}
              selectedItemLabelStyle={tw`text-white`}
            />
            {/* input tanggal manual */}
            <View style={tw`flex flex-row items-center gap-2`}>
              <TextInput
                style={tw`border border-gray-300 rounded-lg h-13 p-2 w-70 text-white`}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="gray"
                value={dateString}
                onChangeText={setDateString}
                editable={false} // Disable manual input
              />
              {/* button untuk datepicker */}
              <TouchableOpacity
                style={tw`border border-blue-500 rounded-lg h-13 items-center w-30 justify-center bg-blue-500`}
                onPress={() => setShowPicker(true)}
              >
                <Text style={tw`text-white text-center text-wrap`}>
                  Pilih Tanggal
                </Text>
              </TouchableOpacity>
              {/* datepicker */}
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <TouchableOpacity
              style={tw`bg-green-600 rounded-lg h-13 items-center justify-center mt-4`}
              onPress={() => {
                // TODO: Implement submit logic here (e.g., send data to API/database)
                console.log({
                  mood,
                  date: dateString,
                });
              }}
            >
              <Text style={tw`text-white text-lg font-bold`}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}