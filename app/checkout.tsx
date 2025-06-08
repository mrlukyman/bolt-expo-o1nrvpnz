import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, CreditCard, Clock, Plus, CreditCard as Edit } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

const paymentMethods = [
  { id: '1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
  { id: '2', type: 'card', last4: '5555', brand: 'Mastercard', isDefault: false },
  { id: '3', type: 'apple', name: 'Apple Pay', isDefault: false },
];

const pickupTimes = [
  { id: '1', label: 'ASAP', time: '15-20 min', isAvailable: true },
  { id: '2', label: '3:30 PM', time: '25 min', isAvailable: true },
  { id: '3', label: '4:00 PM', time: '55 min', isAvailable: true },
  { id: '4', label: '4:30 PM', time: '1h 25min', isAvailable: true },
];

export default function CheckoutScreen() {
  const { state, getCartTotal, dispatch } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('1');
  const [selectedPickupTime, setSelectedPickupTime] = useState('1');
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax + tipAmount;

  const tipOptions = [
    { label: '15%', amount: subtotal * 0.15 },
    { label: '18%', amount: subtotal * 0.18 },
    { label: '20%', amount: subtotal * 0.20 },
    { label: 'Custom', amount: 0 },
  ];

  const handleTipSelect = (option: typeof tipOptions[0]) => {
    if (option.label === 'Custom') {
      setTipAmount(0);
    } else {
      setTipAmount(option.amount);
      setCustomTip('');
    }
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    const amount = parseFloat(value) || 0;
    setTipAmount(amount);
  };

  const handlePlaceOrder = () => {
    if (state.items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    // Create order object
    const order = {
      id: Date.now().toString(),
      restaurantName: state.restaurant?.name || '',
      restaurantImage: state.restaurant?.image || '',
      items: state.items,
      subtotal,
      tax,
      tip: tipAmount,
      total,
      status: 'pending' as const,
      estimatedTime: pickupTimes.find(t => t.id === selectedPickupTime)?.time || '15-20 min',
      orderTime: new Date().toLocaleTimeString(),
      orderNumber: `#${Math.floor(Math.random() * 10000)}`,
      isActive: true,
    };

    // Clear cart
    dispatch({ type: 'CLEAR_CART' });

    // Navigate to order confirmation
    router.replace('/order-confirmation');
  };

  if (state.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order from</Text>
          <View style={styles.restaurantInfo}>
            <Image source={{ uri: state.restaurant?.image }} style={styles.restaurantImage} />
            <Text style={styles.restaurantName}>{state.restaurant?.name}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {state.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <View style={styles.orderItemDetails}>
                  <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
                  {Object.keys(item.customizations).length > 0 && (
                    <Text style={styles.orderItemCustomizations}>
                      {Object.values(item.customizations).flat().join(', ')}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.orderItemPrice}>${item.totalPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Pickup Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Time</Text>
          <View style={styles.pickupTimeContainer}>
            {pickupTimes.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[
                  styles.pickupTimeOption,
                  selectedPickupTime === time.id && styles.pickupTimeSelected,
                  !time.isAvailable && styles.pickupTimeDisabled,
                ]}
                onPress={() => time.isAvailable && setSelectedPickupTime(time.id)}
                disabled={!time.isAvailable}
              >
                <View style={styles.pickupTimeContent}>
                  <Clock size={16} color={selectedPickupTime === time.id ? '#ffffff' : '#6b7280'} />
                  <Text style={[
                    styles.pickupTimeLabel,
                    selectedPickupTime === time.id && styles.pickupTimeSelectedText,
                    !time.isAvailable && styles.pickupTimeDisabledText,
                  ]}>
                    {time.label}
                  </Text>
                </View>
                <Text style={[
                  styles.pickupTimeText,
                  selectedPickupTime === time.id && styles.pickupTimeSelectedText,
                  !time.isAvailable && styles.pickupTimeDisabledText,
                ]}>
                  {time.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity>
              <Plus size={20} color="#ff6b35" />
            </TouchableOpacity>
          </View>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPayment === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <CreditCard size={20} color="#6b7280" />
                <View style={styles.paymentMethodInfo}>
                  {method.type === 'card' ? (
                    <>
                      <Text style={styles.paymentMethodText}>
                        {method.brand} •••• {method.last4}
                      </Text>
                      {method.isDefault && (
                        <Text style={styles.defaultText}>Default</Text>
                      )}
                    </>
                  ) : (
                    <Text style={styles.paymentMethodText}>{method.name}</Text>
                  )}
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.radioButtonSelected,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Tip</Text>
          <View style={styles.tipContainer}>
            {tipOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.tipOption,
                  (option.label !== 'Custom' && tipAmount === option.amount) ||
                  (option.label === 'Custom' && customTip !== '') ? styles.tipOptionSelected : null,
                ]}
                onPress={() => handleTipSelect(option)}
              >
                <Text style={[
                  styles.tipOptionText,
                  (option.label !== 'Custom' && tipAmount === option.amount) ||
                  (option.label === 'Custom' && customTip !== '') ? styles.tipOptionSelectedText : null,
                ]}>
                  {option.label}
                </Text>
                {option.label !== 'Custom' && (
                  <Text style={[
                    styles.tipOptionAmount,
                    tipAmount === option.amount ? styles.tipOptionSelectedText : null,
                  ]}>
                    ${option.amount.toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {customTip !== '' && (
            <TextInput
              style={styles.customTipInput}
              placeholder="Enter custom tip amount"
              value={customTip}
              onChangeText={handleCustomTipChange}
              keyboardType="numeric"
            />
          )}
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Any special requests for the restaurant..."
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip</Text>
            <Text style={styles.summaryValue}>${tipAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order - ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginRight: 12,
    minWidth: 20,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  orderItemCustomizations: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  orderItemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  pickupTimeContainer: {
    gap: 12,
  },
  pickupTimeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pickupTimeSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  pickupTimeDisabled: {
    opacity: 0.5,
  },
  pickupTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupTimeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  pickupTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  pickupTimeSelectedText: {
    color: '#ffffff',
  },
  pickupTimeDisabledText: {
    color: '#9ca3af',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: '#ff6b35',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodInfo: {
    marginLeft: 12,
  },
  paymentMethodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  defaultText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  radioButtonSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  tipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tipOption: {
    flex: 1,
    minWidth: '22%',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tipOptionSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  tipOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  tipOptionAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  tipOptionSelectedText: {
    color: '#ffffff',
  },
  customTipInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ff6b35',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  placeOrderButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});