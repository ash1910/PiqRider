import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Button, Platform, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const COLORS = {
  primary: '#55B086',
  background: '#181A20',
  card: '#23262F',
  text: '#fff',
  textSecondary: '#B0B0B0',
  buttonText: '#fff',
  input: '#23262F',
  border: '#393E46',
};

export default function HomeScreen() {
  // Location state
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupModal, setPickupModal] = useState(false);
  const [dropoffModal, setDropoffModal] = useState(false);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [region, setRegion] = useState<Region>({
    latitude: 36.75,
    longitude: 3.06,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  // Date/time state
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // Results
  const [results, setResults] = useState([
    {
      id: '1',
      name: 'Marvin McKinney',
      price: 20,
      from: 'Algeria, Algiers',
      to: 'Egypt, Cairo',
      date: '11 Apr 2025',
      avatar: require('@/assets/img/profile-blank.png'),
    },
    {
      id: '2',
      name: 'Gregory Smith',
      price: 80,
      from: 'Algeria, Algiers',
      to: 'Tunisia, Djerba',
      date: '12 Apr 2025',
      avatar: require('@/assets/img/profile-blank.png'),
    },
    {
      id: '3',
      name: 'Jhon doe',
      price: 50,
      from: 'Algeria, Algiers',
      to: 'Morocco, Rabat',
      date: '15 Apr 2025',
      avatar: require('@/assets/img/profile-blank.png'),
    },
  ]);

  // Map pickers
  const handleMapPress = async (e, type) => {
    const coords = e.nativeEvent.coordinate;
    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      let address = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      if (geocode.length > 0) {
        const place = geocode[0];
        address = [place.name, place.street, place.city, place.region, place.country].filter(Boolean).join(', ');
      }
      if (type === 'pickup') {
        setPickup(address);
        setPickupMarker(coords);
        setPickupModal(false);
      } else {
        setDropoff(address);
        setDropoffMarker(coords);
        setDropoffModal(false);
      }
    } catch {
      if (type === 'pickup') {
        setPickup(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
        setPickupMarker(coords);
        setPickupModal(false);
      } else {
        setDropoff(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
        setDropoffMarker(coords);
        setDropoffModal(false);
      }
    }
  };

  // Date/time formatting
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (t: Date) =>
    t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Search (mock)
  const handleSearch = () => {
    // You can filter results here based on pickup, dropoff, date, etc.
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <View style={styles.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.username}>User name</Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <Feather name="bell" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Where do you want to <Text style={{ color: COLORS.primary }}>travel</Text>?</Text>
      </View>

      {/* Search Card */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Location</Text>
        {/* Pickup */}
        <TouchableOpacity style={styles.inputRow} onPress={() => setPickupModal(true)}>
          <Feather name="map-pin" size={18} color={COLORS.primary} />
          <TextInput
            style={styles.input}
            placeholder="Start address"
            placeholderTextColor={COLORS.textSecondary}
            value={pickup}
            onChangeText={setPickup}
          />
        </TouchableOpacity>
        {/* Dropoff */}
        <TouchableOpacity style={styles.inputRow} onPress={() => setDropoffModal(true)}>
          <Feather name="map-pin" size={18} color="#FF6B6B" />
          <TextInput
            style={styles.input}
            placeholder="Arrival address"
            placeholderTextColor={COLORS.textSecondary}
            value={dropoff}
            onChangeText={setDropoff}
          />
        </TouchableOpacity>
        {/* Date & Time */}
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <TouchableOpacity style={[styles.inputRow, { flex: 1, marginRight: 8 }]} onPress={() => setShowDate(true)}>
            <Feather name="calendar" size={18} color={COLORS.primary} />
            <Text style={styles.input}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.inputRow, { flex: 1, marginLeft: 8 }]} onPress={() => setShowTime(true)}>
            <Feather name="clock" size={18} color={COLORS.primary} />
            <Text style={styles.input}>{formatTime(date)}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.timezoneNote}>Time zone is based on pickup location</Text>
        {/* Search Button */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search Package</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <Text style={styles.resultsLabel}>Available pick & drop</Text>
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Image source={item.avatar} style={styles.resultAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.resultRoute}>From: {item.from}</Text>
              <Text style={styles.resultRoute}>To: {item.to}</Text>
              <Text style={styles.resultDate}>Date: {item.date}</Text>
            </View>
            <TouchableOpacity style={styles.resultArrow}>
              <Feather name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Pickup Map Modal */}
      <Modal visible={pickupModal} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={region}
            onPress={e => handleMapPress(e, 'pickup')}
          >
            {pickupMarker && <Marker coordinate={pickupMarker} />}
          </MapView>
          <Button title="Close" onPress={() => setPickupModal(false)} />
        </View>
      </Modal>
      {/* Dropoff Map Modal */}
      <Modal visible={dropoffModal} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={region}
            onPress={e => handleMapPress(e, 'dropoff')}
          >
            {dropoffMarker && <Marker coordinate={dropoffMarker} />}
          </MapView>
          <Button title="Close" onPress={() => setDropoffModal(false)} />
        </View>
      </Modal>
      {/* Date/Time Pickers */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={(_, selected) => {
            setShowDate(false);
            if (selected) setDate(selected);
          }}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selected) => {
            setShowTime(false);
            if (selected) setDate(selected);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
  },
  welcome: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  username: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 8,
    marginBottom: 6,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: -30,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
  },
  timezoneNote: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 10,
    marginBottom: 2,
  },
  searchBtnText: {
    color: COLORS.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsLabel: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  resultName: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultPrice: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  resultRoute: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  resultDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  resultArrow: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
});
