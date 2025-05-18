import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, KeyboardAvoidingView, Platform, Keyboard, StatusBar, Share, ScrollView, Dimensions, Switch } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { LeftArrowIcon } from '@/components/icons/LeftArrowIcon';
import Icon from 'react-native-vector-icons/Feather'; // or any icon library
import { LocationIcon } from '@/components/icons/LocationIcon';
import { GPSIcon } from '@/components/icons/GPSIcon';
import Slider from '@react-native-community/slider';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const HEADER_HEIGHT = 156;
const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#55B086',
  background: '#FFFFFF',
  backgroundWrapper: '#F5F5F5',
  text: '#212121',
  textSecondary: '#424242',
  buttonText: '#FFFFFF',
  subtitle: '#616161',
  divider: '#D9DFD9',
};

const SUPPORTED_LANGUAGES = [
  'English',
  'Hindi',
  'Spanish',
  'Arabic',
  'Portuguese',
  'Russian',
  'Japanese',
  'French',
  'Swedish',
  'German',
];

export default function AccountScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showSavedPlacesModal, setShowSavedPlacesModal] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [legalContent, setLegalContent] = useState({ title: '', content: '' });
  const [savedPlaces, setSavedPlaces] = useState([
    { id: 1, name: 'Home', address: '123 Main St, City, State' },
    { id: 2, name: 'Work', address: '456 Business Ave, City, State' },
    { id: 3, name: 'Gym', address: '789 Fitness Blvd, City, State' },
  ]);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [globalSearch, setGlobalSearch] = useState(false);
  const [enableDiscovery, setEnableDiscovery] = useState(false);
  const [locationMode, setLocationMode] = useState('map');
  const [marker, setMarker] = useState({
    latitude: 59.33422549602568,
    longitude: 18.05871074765847,
  });
  const [region, setRegion] = useState({
    latitude: 59.33422549602568,
    longitude: 18.05871074765847,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [distance, setDistance] = useState(250);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

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

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const openLegalModal = (title: string, content: string) => {
    setLegalContent({ title, content });
    setShowLegalModal(true);
  };

  const handleDeletePlace = (id: number) => {
    setSavedPlaces(savedPlaces.filter(place => place.id !== id));
  };

  const handleEditPlace = (id: number) => {
    // TODO: Implement edit functionality
    console.log('Edit place:', id);
  };

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
        setNewPlaceAddress(address);
        setNewPlaceName(place.region || place.city || place.name || '');
      } else {
        setNewPlaceAddress(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
        setNewPlaceName('');
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      setNewPlaceAddress(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      setNewPlaceName('');
    }
  };

  const handleAddPlace = () => {
    if (newPlaceName && newPlaceAddress) {
      const newPlace = {
        id: savedPlaces.length + 1,
        name: newPlaceName,
        address: newPlaceAddress,
      };
      setSavedPlaces([...savedPlaces, newPlace]);
      setNewPlaceName('');
      setNewPlaceAddress('');
      setShowAddPlaceModal(false);
    }
  };

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
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <TouchableOpacity style={styles.leftArrow} onPress={() => router.back()}>
            <LeftArrowIcon size={44} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Settings</Text>
        </Animated.View>

        <View style={styles.form}>
          <View style={styles.profileInfoRow}>
            <Image source={require('@/assets/images/profile_pic.jpg')} style={styles.profileImage} />
            <Text style={styles.profileName}>Amy Jackson</Text>
            <Text style={styles.profileUserName}>@Amy23</Text>
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Discovery</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.row} onPress={() => setShowAddPlaceModal(true)}>
                <View style={styles.rowLeft}>
                  <LocationIcon size={20} color={COLORS.text} />
                  <Text style={styles.rowLabel}>{newPlaceAddress || 'Add a Place'}</Text>
                </View>
                <GPSIcon size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.distanceRow}>
            <Text style={styles.distanceLabel}>Maximum Distance</Text>
            <Text style={styles.distanceValue}>{distance} km</Text>
          </View>
          <View style={styles.distanceSliderContainer}>
            <View style={styles.distanceSlider}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={300}
                value={distance}
                onValueChange={(value) => setDistance(Math.round(value))}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.divider}
                thumbTintColor={COLORS.primary}
              />
            </View>
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Global search activation</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowLabel}>Global</Text>
                </View>
                <Switch
                  trackColor={{
                    true: COLORS.primary,
                    false: COLORS.divider, 
                  }}
                  value={globalSearch}
                  onValueChange={setGlobalSearch}
                />
              </View>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowLabel}>Enable discovery</Text>
                </View>
                <Switch
                  trackColor={{
                    true: COLORS.primary,
                    false: COLORS.divider,
                  }}
                  value={enableDiscovery}
                  onValueChange={setEnableDiscovery}
                />
              </View>
            </View>
          </View>

        </View>
      </Animated.ScrollView>

      <Modal
        visible={showAddPlaceModal}
        animationType="slide"
        onRequestClose={() => setShowAddPlaceModal(false)}
      >
        <View>
          <View style={styles.addPlaceModalContainer}>
            <Animated.View style={[styles.header, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, paddingBottom: 24 }]}>
              <TouchableOpacity style={styles.leftArrow} onPress={() => setShowAddPlaceModal(false)}>
                <LeftArrowIcon size={44} />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>Location</Text>
            </Animated.View>

            <View style={styles.addPlaceForm}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={region}
                  onPress={handleMapPress}
                >
                  {marker && <Marker coordinate={marker}><Image source={require('@/assets/icons/pickup-marker.png')} style={{ width: 36, height: 36 }} /></Marker>}
                </MapView>
                <Text style={styles.mapHint}>Tap on the map to select location</Text>
              </View>

              <View style={[styles.modalBottomContainer, newPlaceAddress ? { display: 'flex' } : { display: 'none' }]} >
                <View style={styles.modalBottomContent}>
                  <View style={styles.modalToggleButton}></View>
                  <Text style={styles.modalTitle}>Current location</Text>
                  {/* Order Summary Card */}
                  <View style={styles.orderSummaryCard}>
                    <View style={styles.orderSummaryRow}>
                      <View style={styles.orderSummaryUserRow}>
                        <LocationIcon size={20} color={COLORS.primary} />
                        <View style={styles.orderSummaryUserColumn}>
                          <Text style={styles.orderSummaryUserName}>{newPlaceName}</Text>
                          <Text style={styles.orderSummaryAddress} numberOfLines={3}>{newPlaceAddress}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity 
                      style={styles.continueButton}
                      onPress={() => setShowAddPlaceModal(false)}
                    >
                      <Text style={styles.continueButtonText}>Select location and continue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 60,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  leftArrow: {
    width: 44,
    height: 44,
    position: 'absolute',
    left: 16,
    top: 52,
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'nunito-bold',
    color: COLORS.background,
    letterSpacing: 0.2,
    lineHeight: 44,
  },
  form: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundWrapper,
  },
  profileInfoRow: {
    flexDirection: 'column', 
    alignItems: 'center',
    marginBottom: 32,
    marginTop: -59,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 8,
  },
  profileName: {
    fontFamily: 'nunito-bold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  profileUserName: {
    fontFamily: 'nunito-semibold',
    fontSize: 14,
    letterSpacing: 0.2,
    color: COLORS.subtitle,
  },
  innerContainer: {
    paddingTop: 0,
    paddingBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    letterSpacing: 0.2,
    color: COLORS.subtitle,
    marginRight: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingVertical: 0,
    overflow: 'hidden',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 19,
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: width - 120,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontFamily: 'nunito-semibold',
    letterSpacing: 0.2,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 14,
  },
  savedPlacesModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  savedPlacesList: {
    padding: 20,
  },
  savedPlaceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  savedPlaceInfo: {
    flex: 1,
    marginRight: 16,
  },
  savedPlaceName: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  savedPlaceAddress: {
    fontSize: 14,
    fontFamily: 'nunito-regular',
    color: COLORS.subtitle,
  },
  savedPlaceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  savedPlaceActionButton: {
    padding: 8,
  },
  addPlaceModalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  addPlaceForm: {
    padding: 0,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapHint: {
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    color: '#444',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    marginTop: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    color: COLORS.buttonText,
  },
  label: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'nunito-regular',
    color: COLORS.text,
  },
  selectedLanguage: {
    fontSize: 14,
    fontFamily: 'nunito-regular',
    color: COLORS.subtitle,
  },
  languageOptions: {
    width: '100%',
    marginBottom: 24,
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectedLanguageOption: {
    backgroundColor: 'rgba(85, 176, 134, 0.1)',
  },
  languageOptionText: {
    fontSize: 16,
    fontFamily: 'nunito-semibold',
    color: COLORS.text,
  },
  selectedLanguageOptionText: {
    color: COLORS.primary,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalBottomContainer: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 255,
  },
  modalBottomContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
    paddingHorizontal: 30,
    paddingTop: 8,
    paddingBottom: 8,
  },
  modalOption: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center'
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'nunito-semibold',
    color: COLORS.text,
    letterSpacing: 0.2,
    lineHeight: 54,
    flex: 1,
  },
  orderSummaryUserColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  modalTitle: {
    fontFamily: 'nunito-extrabold',
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: 0.2,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButtonContainer: {
    paddingBottom: 24,
  },
  modalToggleButton: {
    width: 50,
    height: 5,
    backgroundColor: '#E3E6EC',
    borderRadius: 16,
    marginBottom: 22,
    alignSelf: 'center',
  },
  orderSummaryCard: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 18,
    marginBottom: 24,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderSummaryUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  orderSummaryUserName: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
    color: COLORS.text,
  },
  orderSummaryAddress: {
    fontFamily: 'nunito-medium',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 20,
    color: COLORS.subtitle,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  distanceLabel: {
    fontSize: 14,
    fontFamily: 'nunito-bold',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: COLORS.text,
  },
  distanceValue: {
    fontFamily: 'nunito-medium',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 20,
    color: COLORS.subtitle,
  },
  distanceSliderContainer: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  distanceSlider: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
