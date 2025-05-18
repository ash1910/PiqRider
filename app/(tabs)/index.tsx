import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar,KeyboardAvoidingView, Platform, Modal, Keyboard, ActivityIndicator, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { BellIcon } from '@/components/icons/BellIcon';
import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { TimeIcon } from '@/components/icons/TimeIcon';
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';
import { ExchangeIcon } from '@/components/icons/ExchangeIcon';
import { MapIcon } from '@/components/icons/MapIcon';
import { DashedIcon } from '@/components/icons/DashedIcon';
import { RightArrowIcon } from '@/components/icons/RightArrowIcon';

const HEADER_HEIGHT = 555;
const { width: screenWidth } = Dimensions.get('window');

const COLORS = {
  primary: '#55B086',
  danger: '#FF693B',
  background: '#FFFFFF',
  backgroundWrapper: '#F5F5F5',
  text: '#212121',
  textSecondary: '#919191',
  buttonText: '#FFFFFF',
  subtitle: '#616161',
  inputBorder: '#EEEEEE',
  iconBackground: '#F0F0F0',
};

export default function HomeScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [location, setLocation] = useState('');
  const [locationDropOff, setLocationDropOff] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDropOffVisible, setModalDropOffVisible] = useState(false);
  const [marker, setMarker] = useState<{latitude: number; longitude: number} | null>(null);
  const [markerDropOff, setMarkerDropOff] = useState<{latitude: number; longitude: number} | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [regionDropOff, setRegionDropOff] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('map');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleDateChange = (event: any, selectedDate: any) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS !== 'ios') setShowDateModal(false);
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    if (selectedTime) setTime(selectedTime);
    if (Platform.OS !== 'ios') setShowTimeModal(false);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatTime = (t: Date) =>
    t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const { latitude, longitude } = currentLocation.coords;
        const initialRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(initialRegion);
        setRegionDropOff(initialRegion);
        setLoading(false);
      } catch (error) {
        console.error('Error getting location:', error);
        alert('Error getting location. Please try again.');
        setLoading(false);
      }
    })();
  }, []);

  const handleMapPress = async (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setMarker(coords);

    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        const parts = [
          place.name,
          place.street,
          place.city,
          place.region,
          place.postalCode,
          place.country
        ];
        const uniqueParts = Array.from(new Set(parts.filter(Boolean)));
        const address = uniqueParts.join(', ');        
        setLocation(address);

        const newRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
      } else {
        setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      }
      //setModalVisible(false);
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      //setModalVisible(false);
    }
  };

  const handleMapPressDropOff = async (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setMarkerDropOff(coords);

    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        const parts = [
          place.name,
          place.street,
          place.city,
          place.region,
          place.postalCode,
          place.country
        ];
        const uniqueParts = Array.from(new Set(parts.filter(Boolean)));
        const address = uniqueParts.join(', ');        
        setLocationDropOff(address);

        const newRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegionDropOff(newRegion);
      } else {
        setLocationDropOff(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      }
      //setModalDropOffVisible(false);
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      setLocationDropOff(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      //setModalDropOffVisible(false);
    }
  };

  const handleReturnKey = () => {
    Keyboard.dismiss();
  };

  const exchangeLocations = () => {
    const tempLocation = location;
    setLocation(locationDropOff);
    setLocationDropOff(tempLocation);

    const tempRegion = region;
    setRegion(regionDropOff);
    setRegionDropOff(tempRegion); 

    const tempMarker = marker;
    setMarker(markerDropOff);
    setMarkerDropOff(tempMarker);
  };

  // Results
  const [results, setResults] = useState([
    {
      id: '1',
      name: 'Marvin McKinney',
      price: 20,
      from: '101 Kasr El Ainy Street P.O. 11516 Cairo, Egypt',
      to: 'Egypt, CairoLekki phase 1, 23480',
      date: '11 Apr 2025',
      avatar: '',
    },
    {
      id: '2',
      name: 'Gregory Smith',
      price: 80,
      from: 'Algeria, Algiers',
      to: 'Tunisia, Djerba',
      date: '12 Apr 2025',
      avatar: '',
    },
    {
      id: '3',
      name: 'Jhon doe',
      price: 50,
      from: 'Algeria, Algiers',
      to: 'Morocco, Rabat',
      date: '15 Apr 2025',
      avatar: '',
    },
    {
      id: '4',
      name: 'Marvin McKinney',
      price: 20,
      from: 'Algeria, Algiers',
      to: 'Egypt, Cairo',
      date: '11 Apr 2025',
      avatar: '',
    },
    {
      id: '5',
      name: 'Gregory Smith',
      price: 80,
      from: 'Algeria, Algiers',
      to: 'Tunisia, Djerba',
      date: '12 Apr 2025',
      avatar: '',
    },
    {
      id: '6',
      name: 'Jhon doe',
      price: 50,
      from: 'Algeria, Algiers',
      to: 'Morocco, Rabat',
      date: '15 Apr 2025',
      avatar: '',
    },
  ]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header]}>
          <View style={styles.headerTopContent}>
            <View style={styles.senderProfileImageContainer}>
              <Image source={require('@/assets/img/profile-blank.png')} style={styles.senderProfileImage} />
            </View>
            <View style={styles.senderProfileTextContainer}> 
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>User name</Text>
            </View>
            <TouchableOpacity style={styles.bellIcon} onPress={() => router.push('/(tabs)/notification')}>
              <BellIcon size={44} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.textWhereToTravel}>Where do you want 
          to <Text style={styles.textWhereToTravelBold}>travel</Text>?</Text>

          <Text style={styles.label}>Location</Text>
          <View style={styles.cardContainer}>
            <View style={styles.mapPinContainer}>
              <MapIcon size={24} color={COLORS.primary} />
              <DashedIcon />
              <MapIcon size={24} color={COLORS.danger} />
            </View>
            <View style={styles.itemRowContainer}>
              <View style={styles.itemRow}>                          
                <TouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
                  <Text style={[
                    styles.input,
                    !location && { color: COLORS.textSecondary }
                  ]}>
                    {location || 'Street address'}
                  </Text>
                </TouchableOpacity>
                  <Modal visible={modalVisible} animationType="slide">
                    <View style={{ flex: 1 }}>
                      {/* Map View */}
                      {mode === 'map' && (
                        <>
                          {region && (
                            <>
                            <MapView
                              style={{ flex: 1 }}
                              initialRegion={region || {
                                latitude: 0,
                                longitude: 0,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                              }}
                              onPress={handleMapPress}
                            >
                              {marker && <Marker coordinate={marker} />}
                            </MapView>
                            <Text style={styles.mapHint}>Tap on the map to select location</Text>
                            </>
                          )}
                        </>
                      )}

                      {/* Manual Entry */}
                      {mode === 'manual' && (
                        <View style={styles.manualContainer}>
                          <TextInput
                            placeholder="Type address here"
                            value={location}
                            onChangeText={setLocation}
                            style={styles.manualInput}
                            multiline
                            autoCapitalize="words"
                            autoComplete="off"
                            clearButtonMode="always"
                            textContentType="fullStreetAddress"
                            selectionColor={COLORS.primary}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={handleReturnKey}
                          />
                        </View>
                      )}
                      {/* Mode switch buttons */}
                      <View style={styles.toggleContainer}>
                        <TouchableOpacity
                          style={[styles.toggleButton, mode === 'map' && styles.activeToggle]}
                          onPress={() => setMode('map')}
                        >
                          <Text style={styles.toggleText}>Pick from Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.toggleButton, mode === 'manual' && styles.activeToggle]}
                          onPress={() => setMode('manual')}
                        >
                          <Text style={styles.toggleText}>Enter Manually</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.footer}>
                        <TouchableOpacity style={[styles.toggleButton, {backgroundColor: COLORS.primary, width: 160, alignSelf: 'center'}]} 
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.toggleText}>Use This Address</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setModalDropOffVisible(true)}>
                  <Text style={[
                    styles.input,
                    !locationDropOff && { color: COLORS.textSecondary }
                  ]}>
                    {locationDropOff || 'Arrival address'}
                  </Text>
                </TouchableOpacity>
                <Modal visible={modalDropOffVisible} animationType="slide">
                  <View style={{ flex: 1 }}>
                    {/* Map View */}
                    {mode === 'map' && (
                      <>
                        {regionDropOff && (
                          <>
                          <MapView
                            style={{ flex: 1 }}
                            initialRegion={regionDropOff || {
                              latitude: 0,
                              longitude: 0,
                              latitudeDelta: 0.01,
                              longitudeDelta: 0.01,
                            }}
                            onPress={handleMapPressDropOff}
                          >
                            {markerDropOff && <Marker coordinate={markerDropOff} />}
                          </MapView>
                          <Text style={styles.mapHint}>Tap on the map to select location</Text>
                          </>
                        )}
                      </>
                    )}

                    {/* Manual Entry */}
                    {mode === 'manual' && (
                      <View style={styles.manualContainer}>
                        <TextInput
                          placeholder="Type address here"
                          value={locationDropOff}
                          onChangeText={setLocationDropOff}
                          style={styles.manualInput}
                          multiline
                          autoCapitalize="words"
                          autoComplete="off"
                          clearButtonMode="always"
                          textContentType="fullStreetAddress"
                          selectionColor={COLORS.primary}
                          returnKeyType="done"
                          blurOnSubmit={true}
                          onSubmitEditing={handleReturnKey}
                        />
                      </View>
                    )}
                    {/* Mode switch buttons */}
                    <View style={styles.toggleContainer}>
                      <TouchableOpacity
                        style={[styles.toggleButton, mode === 'map' && styles.activeToggle]}
                        onPress={() => setMode('map')}
                      >
                        <Text style={styles.toggleText}>Pick from Map</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.toggleButton, mode === 'manual' && styles.activeToggle]}
                        onPress={() => setMode('manual')}
                      >
                        <Text style={styles.toggleText}>Enter Manually</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                      <TouchableOpacity style={[styles.toggleButton, {backgroundColor: COLORS.primary, width: 160, alignSelf: 'center'}]} 
                        onPress={() => setModalDropOffVisible(false)}
                      >
                        <Text style={styles.toggleText}>Use This Address</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            <TouchableOpacity onPress={() => exchangeLocations()}>
              <ExchangeIcon size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Pickup date and location</Text>
          <View style={styles.rowContainer}>
            <View style={styles.rowItem}>
              <TouchableOpacity onPress={() => setShowDateModal(true)} style={styles.inputContainer}>
                <CalendarIcon size={20} color={COLORS.primary} /> 
                <Text style={styles.input}>{formatDate(date) || 'Select Date'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowItem}>
              <TouchableOpacity onPress={() => setShowTimeModal(true)} style={styles.inputContainer}>
                <TimeIcon size={20} color={COLORS.primary} />
                <Text style={styles.input}>{formatTime(time) || 'Select Time'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <InfoCircleIcon size={12} color="#84BEFF" />
            <Text style={styles.infoText}>Time zone is based on pickup location</Text>
          </View>

          {/* Date Modal */}
          <Modal visible={showDateModal} transparent animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={handleDateChange}
                  style={styles.picker}
                />
                <TouchableOpacity onPress={() => setShowDateModal(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Time Modal */}
          <Modal visible={showTimeModal} transparent animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  style={styles.picker}
                />
                <TouchableOpacity onPress={() => setShowTimeModal(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/?refresh=true')}>
            <Text style={styles.loginText}>Search package</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.form}>
          {/* Results */}
          <Text style={styles.resultsLabel}>Available pick & drop</Text>
          <View style={{ flex: 1 }}>
            {results.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={[
                  styles.resultCard,
                  selectedCard === item.id && styles.resultCardSelected
                ]}
                onPress={() => setSelectedCard(item.id)}
              >
                {/* Order Summary Card */}
                <View style={styles.orderSummaryCard}>
                  <View style={styles.orderSummaryRow}>
                    {item.avatar && <Image source={item.avatar} style={styles.resultAvatar} />}
                    {!item.avatar && <View style={styles.userAvatar} />}
                    <View style={styles.orderSummaryUserRow}>
                      <Text style={styles.orderSummaryUserName}>{item.name}</Text>
                      <View style={styles.orderSummaryPriceBox}>
                        <Text style={styles.orderSummaryPrice}>${item.price.toFixed(2)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.orderSummaryArrow} onPress={() => router.push('/orderDetail')}>
                      <RightArrowIcon size={16} color={COLORS.background} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.pickupDetailsCard}>
                  <View style={styles.pickupDetailsRow}>
                    <Text style={styles.pickupDetailsLabel}>From:</Text>
                    <Text style={styles.pickupDetailsValue}>{item.from}</Text>
                  </View>
                  <View style={styles.pickupDetailsRow}>
                    <Text style={styles.pickupDetailsLabel}>To:</Text>
                    <Text style={styles.pickupDetailsValue}>{item.to}</Text>
                  </View>
                  <View style={styles.pickupDetailsRow}>
                    <Text style={styles.pickupDetailsLabel}>Date:</Text>
                    <Text style={styles.pickupDetailsValue}>{item.date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderRadius: 24,
    //height: HEADER_HEIGHT,
  },
  headerTopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 28,
  },
  logo: {
    width: 38,
    height: 41,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 14,
    fontFamily: 'nunito-bold',
    color: COLORS.background,
    letterSpacing: 0.2,
    lineHeight: 20,
    flex: 1,
    marginLeft: 12,
  },
  bellIcon: {
    marginLeft: 12,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'nunito-medium',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  senderProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  senderProfileImageContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
  },
  senderProfileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  senderProfileTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  form: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 86,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundWrapper,
  },
  title: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'nunito-regular',
    letterSpacing: 0.2,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'nunito-bold',
    letterSpacing: 0.2,
    color: COLORS.background,
    marginBottom: 0,
  },
  dropOffText: {
    fontSize: 14,
    fontFamily: 'nunito-bold',
    color: COLORS.background,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    letterSpacing: 0.2,
    marginLeft: 'auto',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  },
  rowItem: {
    flex: 1,
  },
  label: {
    marginBottom: 16,
    fontFamily: 'nunito-bold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
    color: COLORS.background,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#25282B',
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 44,
    gap: 15,
  },
  input: {
    flex: 1,
    fontFamily: 'nunito-regular',
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 12,
    letterSpacing: 0.2,
    color: COLORS.background,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: COLORS.buttonText,
    fontFamily: 'nunito-bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapHint: {
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    color: '#444',
  },
  manualContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundWrapper,
  },
  manualInput: {
    height: 120,
    borderRadius: 14,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: COLORS.background,
  },
  footer: {
    padding: 10,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary || '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 14,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'nunito-medium',
    letterSpacing: 0.2,
    lineHeight: 18,
    color: "#84BEFF",
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
    marginTop: 24,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: '#000',
  },
  tabText: {
    color: COLORS.background,
    fontFamily: 'nunito-bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  sliderContainer: {
    width: '100%',
  },
  animatedView: {
    flexDirection: 'row',
    width: screenWidth * 2,
    gap: 32,
    overflow: 'hidden',
  },
  tabContent: {
    width: screenWidth - 32,
  },
  textWhereToTravel: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'nunito-bold',
    letterSpacing: 0.2,
    color: COLORS.background,
    marginBottom: 16,
  },
  textWhereToTravelBold: {
    color: COLORS.primary,
  },
  itemRowContainer: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    gap: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flex: 1,
    marginBottom: 24,
  },
  mapPinContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  resultsLabel: {
    color: COLORS.text,
    fontFamily: 'nunito-extrabold',
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 14,
  },
  resultCard: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    flexDirection: 'column',
    padding: 14,
    marginBottom: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  resultCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  resultAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },
  orderSummaryCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 14,
    marginBottom: 14,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    alignItems: 'center',
    marginBottom: 0,
  },
  orderSummaryUserRow: {
    flex: 1,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
  },
  orderSummaryUserName: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
    letterSpacing: 0.2,
    color: COLORS.text,
    marginBottom: 8,
  },
  orderSummaryPriceBox: {
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  orderSummaryPrice: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    letterSpacing: 0.2,
    color: COLORS.text,
  },
  pickupDetailsCard: {
    flex: 1,
    flexDirection: 'column',
    gap: 6,
  },
  pickupDetailsTitle: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
    color: COLORS.text,
    letterSpacing: 0.2,
    marginBottom: 8,
    marginLeft: 8,
  },
  pickupDetailsDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 16,
  },
  pickupDetailsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  pickupDetailsLabel: {
    fontFamily: 'nunito-medium',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 16,
    width: 100,
    color: COLORS.subtitle,
  },
  pickupDetailsValue: {
    color: COLORS.text,
    fontFamily: 'nunito-semibold',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 16,
    flex: 1,
    textAlign: 'right',
  },
  orderSummaryArrow: {  
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

