import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, Clock, MapPin, Phone } from 'lucide-react-native';
import { router } from 'expo-router';

export default function OrderConfirmationScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Mock order data - in real app this would come from navigation params or state
  const order = {
    id: '1234',
    orderNumber: '#1234',
    restaurantName: 'Mario\'s Pizzeria',
    restaurantImage: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    restaurantAddress: '123 Main Street, Downtown',
    restaurantPhone: '+1 (555) 123-4567',
    estimatedTime: '15-20 min',
    total: 24.50,
    items: ['Margherita Pizza', 'Caesar Salad'],
  };

  useEffect(() => {
    // Animate the confirmation screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate to live tracking after 3 seconds
    const timer = setTimeout(() => {
      router.replace(`/live-tracking/${order.id}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleTrackOrder = () => {
    router.replace(`/live-tracking/${order.id}`);
  };

  const handleViewOrders = () => {
    router.replace('/(tabs)/orders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <CheckCircle size={80} color="#10b981" fill="#10b981" />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        <Text style={styles.successSubtitle}>
          Your order has been placed successfully
        </Text>

        {/* Order Details */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>{order.orderNumber}</Text>
              <Text style={styles.restaurantName}>{order.restaurantName}</Text>
              <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.estimatedTime}>
            <Clock size={20} color="#ff6b35" />
            <Text style={styles.estimatedTimeText}>
              Estimated pickup time: {order.estimatedTime}
            </Text>
          </View>

          <View style={styles.restaurantDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.detailText}>{order.restaurantAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.detailText}>{order.restaurantPhone}</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>• {item}</Text>
          ))}
        </View>

        {/* Auto-redirect message */}
        <Text style={styles.autoRedirectText}>
          Redirecting to live tracking in a few seconds...
        </Text>
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.ordersButton} onPress={handleViewOrders}>
          <Text style={styles.ordersButtonText}>View All Orders</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ff6b35',
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  estimatedTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ff6b35',
    marginLeft: 8,
  },
  restaurantDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
  },
  itemsCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  autoRedirectText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  trackButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  ordersButton: {
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ordersButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
});