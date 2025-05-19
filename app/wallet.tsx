import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, Keyboard, StatusBar, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { LeftArrowIcon } from '@/components/icons/LeftArrowIcon';
import Icon from 'react-native-vector-icons/Feather';
import { RightArrowIcon } from '@/components/icons/RightArrowIcon';
import { WalletIcon } from '@/components/icons/WalletIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { CardIcon } from '@/components/icons/CardIcon';

const HEADER_HEIGHT = 350;
const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#55B086',
  background: '#FFFFFF',
  backgroundWrapper: '#F5F5F5',
  text: '#212121',
  textSecondary: '#424242',
  buttonText: '#FFFFFF',
  subtitle: '#616161',
  divider: '#EEEEEE',
  danger: '#FF4949',
};

interface Transaction {
  id: number;
  date: string;
  amount: number;
  credit: boolean;
  type: string;
  paymentMethod: string;
  status: 'Completed' | 'Pending';
}

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  swiftCode: string;
}

export default function WalletScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [savedBankDetails, setSavedBankDetails] = useState<BankDetails | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
    swiftCode: '',
  });
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

  var transactionHistory: Transaction[] = [
    { id: 1, date: 'Jan 01, 2025 12:00 pm', amount: 1025.25, "credit": true, type: 'Top up Wallet', paymentMethod: 'Paypal', status: 'Completed' },
    { id: 2, date: 'Jan 02, 2025 02:30 pm', amount: 1220.40, "credit": false, type: 'Withdrawal', paymentMethod: 'Paypal', status: 'Pending' },
    { id: 3, date: 'Jan 03, 2025 04:45 pm', amount: 900.50, "credit": true, type: 'Top up Wallet', paymentMethod: 'Paypal', status: 'Completed' },
    { id: 4, date: 'Jan 04, 2025 12:00 pm', amount: 1025.25, "credit": true, type: 'Top up Wallet', paymentMethod: 'Paypal', status: 'Completed' },
    { id: 5, date: 'Jan 05, 2025 06:15 pm', amount: 1220.40, "credit": false, type: 'Withdrawal', paymentMethod: 'Paypal', status: 'Completed' },
    { id: 6, date: 'Jan 06, 2025 08:30 pm', amount: 900.50, "credit": true, type: 'Top up Wallet', paymentMethod: 'Paypal', status: 'Completed' },
  ];

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
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.leftArrow} onPress={() => router.back()}>
              <LeftArrowIcon size={44} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Wallet</Text>
          </View>
          <View style={styles.balanceInfoRow}>
            <View style={styles.balanceImage}>
              <CardIcon size={width - 32} />
            </View>
            <TouchableOpacity style={styles.balanceRightArrow} onPress={() => {
              console.log('Right arrow pressed');
            }}>
              <RightArrowIcon size={20} color={COLORS.background} />
            </TouchableOpacity>
            <Text style={styles.balanceTitle}>Your Balance</Text>
            <Text style={styles.balanceAmount}>$22.883.25</Text>
            <Text style={styles.balanceDescription}>
              {savedBankDetails 
                ? `${savedBankDetails.bankName} ****${savedBankDetails.accountNumber.slice(-4)}`
                : 'Add the bank account you want to withdraw with'
              }
            </Text>
            <TouchableOpacity style={styles.balanceButton} onPress={() => setShowBankDetailsModal(true)}>
              <PlusIcon size={16} color={COLORS.text} />
              <Text style={styles.balanceButtonText}>
                {savedBankDetails ? 'Update Bank Account' : 'Add Bank Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.form}>
          <View style={styles.innerContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              <TouchableOpacity style={styles.sectionRight} onPress={() => {
                console.log('View All pressed');
              }}>
                <Text style={styles.sectionSubtitle}>View All</Text>
                <RightArrowIcon size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              {transactionHistory.map((transaction) => (
                <TouchableOpacity 
                  key={transaction.id} 
                  style={[styles.row, { borderBottomWidth: transaction.id === transactionHistory.length ? 0 : 1 }]} 
                  onPress={() => {
                    setSelectedTransaction(transaction);
                    setShowTransactionModal(true);
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowLabelType}>{transaction.type}</Text>
                    <Text style={styles.rowLabelDate}>{transaction.date}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={[styles.rowLabelAmount, { color: transaction.credit ? COLORS.primary : COLORS.danger }]}> {transaction.credit ? '+' : '-'} ${transaction.amount}</Text>
                    <Text style={styles.rowLabelPaymentMethod}>{transaction.paymentMethod}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        visible={showTransactionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTransactionModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContainer, { width: '90%' }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTransactionModal(false)}
            >
              <Icon name="x" size={24} color={COLORS.text} />
            </TouchableOpacity>
            
            <View style={styles.modalIconContainer}>
              <WalletIcon size={40} color={COLORS.primary} />
            </View>
            
            <Text style={styles.modalTitle}>Transaction Details</Text>

            {selectedTransaction && (
              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.type}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={[
                    styles.detailValue, 
                    { color: selectedTransaction.credit ? COLORS.primary : COLORS.danger }
                  ]}>
                    {selectedTransaction.credit ? '+' : '-'} ${selectedTransaction.amount}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.paymentMethod}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: selectedTransaction.status === 'Completed' ? 'rgba(85, 176, 134, 0.1)' : 'rgba(255, 73, 73, 0.1)' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: selectedTransaction.status === 'Completed' ? COLORS.primary : COLORS.danger }
                    ]}>
                      {selectedTransaction.status}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowTransactionModal(false)}
            >
              <Text style={styles.continueButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bank Details Modal */}
      <Modal
        visible={showBankDetailsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBankDetailsModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContainer, { width: '90%' }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBankDetailsModal(false)}
            >
              <Icon name="x" size={24} color={COLORS.text} />
            </TouchableOpacity>
            
            <View style={styles.modalIconContainer}>
              <WalletIcon size={40} color={COLORS.primary} />
            </View>
            
            <Text style={styles.modalTitle}>Add Bank Account</Text>
            <Text style={styles.modalText}>Please enter your bank account details</Text>

            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <View style={styles.addPlaceForm}>
                <Text style={styles.label}>Account Holder Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={bankDetails.accountHolderName}
                    onChangeText={(text) => setBankDetails({ ...bankDetails, accountHolderName: text })}
                    placeholder="Enter account holder name"
                  />
                </View>

                <Text style={styles.label}>Bank Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={bankDetails.bankName}
                    onChangeText={(text) => setBankDetails({ ...bankDetails, bankName: text })}
                    placeholder="Enter bank name"
                  />
                </View>

                <Text style={styles.label}>Account Number</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={bankDetails.accountNumber}
                    onChangeText={(text) => setBankDetails({ ...bankDetails, accountNumber: text })}
                    placeholder="Enter account number"
                    keyboardType="number-pad"
                  />
                </View>

                <Text style={styles.label}>Routing Number</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={bankDetails.routingNumber}
                    onChangeText={(text) => setBankDetails({ ...bankDetails, routingNumber: text })}
                    placeholder="Enter routing number"
                    keyboardType="number-pad"
                  />
                </View>

                <Text style={styles.label}>SWIFT Code</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={bankDetails.swiftCode}
                    onChangeText={(text) => setBankDetails({ ...bankDetails, swiftCode: text })}
                    placeholder="Enter SWIFT code"
                    autoCapitalize="characters"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    !Object.values(bankDetails).every(value => value.trim()) && styles.disabledButton
                  ]}
                  onPress={() => {
                    console.log('Bank details:', bankDetails);
                    setSavedBankDetails(bankDetails);
                    setShowBankDetailsModal(false);
                    setBankDetails({
                      accountHolderName: '',
                      accountNumber: '',
                      bankName: '',
                      routingNumber: '',
                      swiftCode: '',
                    });
                  }}
                  disabled={!Object.values(bankDetails).every(value => value.trim())}
                >
                  <Text style={styles.continueButtonText}>Add Bank Account</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  headerRow: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  leftArrow: {
    width: 44,
    height: 44,
    position: 'absolute',
    left: 16,
    top: 0,
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
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundWrapper,
  },
  innerContainer: {
    paddingTop: 0,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'nunito-bold',
    fontSize: 20,
    color: COLORS.text,
    marginRight: 12,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '80%',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(85, 176, 134, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'nunito-bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'nunito-medium',
    color: COLORS.subtitle,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  balanceInfoRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
    height: 220,
    marginTop: 32,
    padding: 24,
  },
  balanceImage: {
    width: width - 32,
    height: 220,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceRightArrow: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 38,
    right: 24,
  },
  balanceTitle: {
    fontSize: 14,
    fontFamily: 'nunito-medium',
    letterSpacing: 0.2,
    color: COLORS.background,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'nunito-bold',
    lineHeight: 42,
    color: COLORS.background,
    marginTop: 4,
    marginBottom: 10,
  },
  balanceDescription: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    lineHeight: 20,
    color: COLORS.background,
  },
  balanceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  balanceButtonText: {
    fontSize: 16,
    fontFamily: 'nunito-semibold',
    letterSpacing: 0.2,
    color: COLORS.text,
  },
  sectionRight: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'nunito-bold',
    color: COLORS.primary,
  },
  rowLabelType: {
    fontSize: 18,
    fontFamily: 'nunito-bold',
    color: COLORS.text,
  },
  rowLabelDate: {
    fontSize: 10,
    fontFamily: 'nunito-medium',
    color: COLORS.subtitle,
    letterSpacing: 0.2,
    lineHeight: 12,
  },
  rowLabelAmount: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    color: COLORS.primary,
    lineHeight: 20,
  },
  rowLabelPaymentMethod: {
    fontSize: 10,
    fontFamily: 'nunito-medium',
    letterSpacing: 0.2,
    lineHeight: 12,
    color: COLORS.subtitle,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
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
  addPlaceForm: {
    padding: 20,
  },
  transactionDetails: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'nunito-medium',
    color: COLORS.subtitle,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'nunito-bold',
  },
});
