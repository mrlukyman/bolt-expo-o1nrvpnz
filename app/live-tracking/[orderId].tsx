import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, Phone, CircleCheck as CheckCircle, Circle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LiveOrderUpdate } from '@/types';

const orderStatuses = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, completed: true },
  { id: 'preparing', label: 'Preparing Your Order', icon: Circle, completed: true },
  { id: 'ready', label: 'Ready for Pickup', icon: Circle, completed: false },
  { id: 'completed', label: 'Order Complete', icon: Circle, completed: false },
];

export default function LiveTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [currentStatus, setCurrentStatus] = useState('preparing');
  const [estimatedTime, setEstimatedTime] = useState('12 min');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [updates, setUpdates] = useState<LiveOrderUpdate[]>([
    {
      orderId: orderId || '',
      status: 'confirmed',
      estimatedTime: '15-20 min',
      message: 'Your order has been confirmed and sent to the restaurant.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      orderId: orderId || '',
      status: 'preparing',
      estimatedTime: '12 min',
      message: 'The restaurant is now preparing your order.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
  ]);

  // Mock order data
  const order = {
    id: orderId,
    orderNumber: '#1234',
    restaurantName: 'Mario\'s Pizzeria',
    restaurantImage: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    restaurantAddress: '123 Main Street, Downtown',
    restaurantPhone: '+1 (555) 123-4567',
    total: 24.50,
    items: ['Margherita Pizza', 'Caesar Salad'],
  };

  useEffect(() => {
    // Animate the pulse effect for active status
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Simulate live updates
    const updateInterval = setInterval(() => {
      // Simulate status progression
      if (currentStatus === 'preparing') {
        const timeLeft = parseInt(estimatedTime);
        if (timeLeft > 1) {
          setEstimatedTime(`${timeLeft - 1} min`);
        } else {
          setCurrentStatus('ready');
          setEstimatedTime('Ready now');
          setUpdates(prev => [...prev, {
            orderId: orderId || '',
            status: 'ready',
            estimatedTime: 'Ready now',
            message: 'Your order is ready for pickup!',
            timestamp: new Date().toISOString(),
          }]);
          
          // Show iOS Live Activity update (mock)
          if (Platform.OS === 'ios') {
            // In a real app, you would update the Live Activity here
            console.log('Updating iOS Live Activity: Order Ready');
          }
        }
      }
    }, 30000); // Update every 30 seconds

    return () => {
      pulseAnimation.stop();
      clearInterval(updateInterval);
    };
  }, [currentStatus, estimatedTime]);

  const getStatusIcon = (statusId: string, isCompleted: boolean, isActive: boolean) => {
    if (isCompleted) {
      return <CheckCircle size={24} color="#10b981" fill="#10b981" />;
    } else if (isActive) {
      return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Circle size={24} color="#ff6b35" fill="#ff6b35" />
        </Animated.View>
      );
    } else {
      return <Circle size={24} color="#d1d5db" />;
    }
  };

  const handleCallRestaurant = () => {
    // In a real app, this would open the phone dialer
    console.log('Calling restaurant:', order.restaurantPhone);
  };

  const handleGetDirections = () => {
    // In a real app, this would open maps with directions
    console.log('Getting directions to:', order.restaurantAddress);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          </View>

          <View style={styles.currentStatusContainer}>
            {currentStatus === 'ready' ? (
              <AlertCircle size={32} color="#10b981" />
            ) : (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Clock size={32} color="#ff6b35" />
              </Animated.View>
            )}
            <View style={styles.statusTextContainer}>
              <Text style={styles.currentStatusText}>
                {currentStatus === 'ready' ? 'Ready for Pickup!' : 'Preparing Your Order'}
              </Text>
              <Text style={styles.estimatedTimeText}>
                {currentStatus === 'ready' ? 'Your order is ready' : `Estimated time: ${estimatedTime}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Order Progress</Text>
          {orderStatuses.map((status, index) => {
            const isCompleted = status.id === 'confirmed' || 
                              (status.id === 'preparing' && (currentStatus === 'preparing' || currentStatus === 'ready')) ||
                              (status.id === 'ready' && currentStatus === 'ready');
            const isActive = status.id === currentStatus;

            return (
              <View key={status.id} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  {getStatusIcon(status.id, isCompleted, isActive)}
                  {index < orderStatuses.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      isCompleted && styles.timelineLineCompleted
                    ]} />
                  )}
                </View>
                <Text style={[
                  styles.timelineLabel,
                  (isCompleted || isActive) && styles.timelineLabelActive
                ]}>
                  {status.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantCardName}>{order.restaurantName}</Text>
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
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCallRestaurant}>
            <Phone size={20} color="#ff6b35" />
            <Text style={styles.actionButtonText}>Call Restaurant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleGetDirections}>
            <MapPin size={20} color="#ff6b35" />
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Live Updates */}
        <View style={styles.updatesCard}>
          <Text style={styles.updatesTitle}>Live Updates</Text>
          {updates.map((update, index) => (
            <View key={index} style={styles.updateItem}>
              <View style={styles.updateTime}>
                <Text style={styles.updateTimeText}>{formatTime(update.timestamp)}</Text>
              </View>
              <View style={styles.updateContent}>
                <Text style={styles.updateMessage}>{update.message}</Text>
                {update.estimatedTime && (
                  <Text style={styles.updateEstimate}>ETA: {update.estimatedTime}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Your Order</Text>
          {order.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>• {item}</Text>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Ready for Pickup Banner */}
      {currentStatus === 'ready' && (
        <View style={styles.readyBanner}>
          <CheckCircle size={24} color="#ffffff" />
          <Text style={styles.readyBannerText}>Your order is ready for pickup!</Text>
        </View>
      )}
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
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusHeader: {
    marginBottom: 16,
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
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  currentStatusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  estimatedTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  timelineCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 24,
    width: 2,
    height: 32,
    backgroundColor: '#d1d5db',
  },
  timelineLineCompleted: {
    backgroundColor: '#10b981',
  },
  timelineLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  timelineLabelActive: {
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  restaurantCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantCardName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  restaurantDetails: {
    gap: 4,
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
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff5f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7cc',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ff6b35',
    marginLeft: 8,
  },
  updatesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  updatesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  updateItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  updateTime: {
    marginRight: 12,
    minWidth: 60,
  },
  updateTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginBottom: 2,
  },
  updateEstimate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  itemsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
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
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 12,
  },
  totalText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  readyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  readyBannerText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
});