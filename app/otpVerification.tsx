import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, KeyboardAvoidingView, Platform, Keyboard, StatusBar } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { LeftArrowIcon } from '@/components/icons/LeftArrowIcon';

const HEADER_HEIGHT = 207;

const COLORS = {
  primary: '#55B086',
  background: '#FFFFFF',
  backgroundWrapper: '#F5F5F5',
  text: '#212121',
  buttonText: '#FFFFFF',
  subtitle: '#616161',
  inputBorder: '#EEEEEE',
  iconBackground: '#F0F0F0',
};

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
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
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(30);
    // Add your resend OTP logic here
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
        <Animated.View style={styles.header}>
          <TouchableOpacity style={styles.leftArrow} onPress={() => router.back()}>
            <LeftArrowIcon size={44} color={"#212121"} />
          </TouchableOpacity>
          <Image source={require('@/assets/img/otp-bg.png')} style={styles.logo} />
          <Text style={styles.appName}>OTP Verification</Text>
          <Text style={styles.tagline}>Please enter the One-Time Password (OTP) {'\n'}sent to your registered number.</Text>
        </Animated.View>

        <View style={styles.form}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={[
                  styles.otpInput,
                  focusedIndex === index && styles.otpInputFocused
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive any code?</Text>
            <View style={styles.resendLinkContainer}>
              <TouchableOpacity onPress={handleResend} disabled={timeLeft > 0}>
                <Text style={[styles.resendLink, timeLeft > 0 && styles.resendLinkDisabled]}>
                  Resend
                </Text>
              </TouchableOpacity>
              <Text style={styles.timeLeftText}>
                {timeLeft > 0 && ` - ${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`}
              </Text>
            </View>
          </View>
        </View>
        {isKeyboardVisible && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => {
                // Add your verification logic here
                console.log('OTP:', otp.join(''));
                router.push('/success');
              }}
            >
              <Text style={styles.continueButtonText}>Tap to continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>

      {!isKeyboardVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => {
              // Add your verification logic here
              console.log('OTP:', otp.join(''));
              router.push('/success');
            }}
          >
            <Text style={styles.continueButtonText}>Tap to continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 86,
  },
  header: {
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundWrapper,
  },
  leftArrow: {
    width: 44,
    height: 44,
    marginBottom: 37,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'nunito-extrabold',
    color: COLORS.text,
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  tagline: {
    color: COLORS.subtitle,
    fontFamily: 'nunito-medium',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  logo: {
    width: 280,
    height: 272,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 45,
  },
  form: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 46,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundWrapper,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 0,
    marginBottom: 0,
  },
  otpInput: {
    width: 74,
    height: 61,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    fontFamily: 'nunito-bold',
  },
  otpInputFocused: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(85, 176, 134, 0.08)',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 28,
  },
  resendText: {
    fontFamily: 'nunito-semibold',
    fontSize: 14,
    color: COLORS.subtitle,
  },
  timeLeftText: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: COLORS.subtitle,
  },
  resendLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  resendLink: {
    color: COLORS.primary,
    fontFamily: 'nunito-bold',
  },
  resendLinkDisabled: {
    color: COLORS.subtitle,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 22,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: COLORS.buttonText,
    fontFamily: 'nunito-bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
