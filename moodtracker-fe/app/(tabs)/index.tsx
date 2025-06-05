import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Index() {
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState("senang");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [entries, setEntries] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Tambahkan state untuk multi select
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const emotionEmojis = {
    senang: "😊",
    sedih: "😢",
    stress: "😣",
  };

  const emotionColors = {
    senang: "#FFF9C4", // kuning lembut
    sedih: "#BBDEFB", // biru muda
    stress: "#F8BBD0", // pink lembut
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/api/moods");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async () => {
    if (!isDescriptionValid) {
      Alert.alert("Validasi", "Deskripsi minimal 3 karakter!");
      return;
    }
    try {
      await axios.post("http://10.0.2.2:8000/api/moods", {
        description,
        emotion,
        date: date.toISOString().split("T")[0],
      });
      setDescription("");
      setEmotion("senang");
      setDate(new Date());
      fetchEntries();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (item: any) => {
    setIsEdit(true);
    setEditId(item.id);
    setDescription(item.description);
    setEmotion(item.emotion);
    setDate(new Date(item.date));
  };

  const handleUpdate = async () => {
    if (!isDescriptionValid) {
      Alert.alert("Validasi", "Deskripsi minimal 3 karakter!");
      return;
    }
    if (!editId) return;
    try {
      await axios.put(`http://10.0.2.2:8000/api/moods/${editId}`, {
        description,
        emotion,
        date: date.toISOString().split("T")[0],
      });
      setDescription("");
      setEmotion("senang");
      setDate(new Date());
      setIsEdit(false);
      setEditId(null);
      fetchEntries();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://10.0.2.2:8000/api/moods/${id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const formatDate = (dateObj: Date) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [selectedEmotions, setSelectedEmotions] = useState({
    senang: true,
    sedih: true,
    stress: true,
  });
  const [selectedEmotion, setSelectedEmotion] = useState<
    keyof typeof emotionEmojis | "all"
  >("all");

  const isDescriptionValid = description.trim().length >= 3;

  const toggleEmotionFilter = (emotionKey: keyof typeof emotionEmojis) => {
    setSelectedEmotion((prev) => (prev === emotionKey ? "all" : emotionKey));
  };

  const filteredEntries =
    selectedEmotion === "all"
      ? entries
      : entries.filter((item) => item.emotion === selectedEmotion);

  // Fungsi toggle checkbox
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yang sedang dirasakan"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#666"
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={emotion}
            onValueChange={(itemValue) => setEmotion(itemValue)}
            style={styles.picker}
            itemStyle={{ fontSize: 16 }}
            dropdownIconColor="#344055"
          >
            <Picker.Item
              label={`${emotionEmojis["senang"]} Senang`}
              value="senang"
            />
            <Picker.Item
              label={`${emotionEmojis["sedih"]} Sedih`}
              value="sedih"
            />
            <Picker.Item
              label={`${emotionEmojis["stress"]} Stress`}
              value="stress"
            />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>
            📅 Tanggal: {formatDate(date)}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={[
            styles.button,
            isEdit && styles.buttonUpdate,
            !isDescriptionValid && { backgroundColor: "#9ca3af" }, // abu-abu saat disabled
          ]}
          onPress={isEdit ? handleUpdate : handleSubmit}
          activeOpacity={0.85}
          disabled={!isDescriptionValid}
        >
          <Text style={styles.buttonText}>{isEdit ? "Update" : "Submit"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyTitle}>Riwayat Mood</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
          gap: 6,
        }}
      >
        {Object.keys(emotionEmojis).map((emo) => (
          <TouchableOpacity
            key={emo}
            onPress={() =>
              toggleEmotionFilter(emo as keyof typeof emotionEmojis)
            }
            style={{
              backgroundColor: selectedEmotion === emo ? "#3b82f6" : "#e5e7eb",
              borderRadius: 14,
              paddingVertical: 5,
              paddingHorizontal: 12,
              marginHorizontal: 1,
              borderWidth: selectedEmotion === emo ? 0 : 1,
              borderColor: "#cbd5e1",
            }}
          >
            <Text
              style={{
                color: selectedEmotion === emo ? "#fff" : "#334155",
                fontWeight: "bold",
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              {emo}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key="all"
          onPress={() => setSelectedEmotion("all")}
          style={{
            backgroundColor: selectedEmotion === "all" ? "#3b82f6" : "#e5e7eb",
            borderRadius: 14,
            paddingVertical: 5,
            paddingHorizontal: 12,
            marginHorizontal: 1,
            borderWidth: selectedEmotion === "all" ? 0 : 1,
            borderColor: "#cbd5e1",
          }}
        >
          <Text
            style={{
              color: selectedEmotion === "all" ? "#fff" : "#334155",
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            Semua
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.entryCard,
              { backgroundColor: emotionColors[item.emotion] || "#ddd" },
            ]}
          >
            <View style={styles.entryHeader}>
              <Text style={styles.emojiLarge}>
                {emotionEmojis[item.emotion] || "❓"}
              </Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.entryDate}>
                  {formatDate(new Date(item.date))}
                </Text>
                <Text style={styles.entryDesc}>{item.description}</Text>
                <Text style={styles.entryEmotion}>Emosi: {item.emotion}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.iconButton}
                >
                  <Icon name="edit" size={28} color="#1e40af" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.iconButton}
                >
                  <Icon name="delete" size={28} color="#b91c1c" />
                </TouchableOpacity>
                {/* Checkbox Multi Select */}
                <TouchableOpacity
                  onPress={() => toggleSelect(item.id)}
                  style={{
                    marginLeft: 18,
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: selectedIds.includes(item.id)
                      ? "#3b82f6"
                      : "#cbd5e1",
                    backgroundColor: selectedIds.includes(item.id)
                      ? "#3b82f6"
                      : "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedIds.includes(item.id) && (
                    <Icon name="check" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Belum ada data mood.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F0FE", // warna background soft biru muda
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1e293b",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 30,
    letterSpacing: 2,
  },
  inputContainer: {
    paddingHorizontal: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#1e293b",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  picker: {
    height: 50,
    color: "#344055",
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#1e293b",
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 36,
    shadowColor: "#2563eb",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonUpdate: {
    backgroundColor: "#f59e0b",
    shadowColor: "#d97706",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  entryCard: {
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiLarge: {
    fontSize: 48,
  },
  entryDate: {
    fontWeight: "700",
    fontSize: 15,
    color: "#334155",
  },
  entryDesc: {
    fontSize: 18,
    marginVertical: 6,
    color: "#0f172a",
    fontWeight: "600",
  },
  entryEmotion: {
    fontSize: 16,
    color: "#334155",
  },
  actionButtons: {
    flexDirection: "row",
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 18,
  },
  emptyListText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 40,
    fontSize: 17,
  },
});
