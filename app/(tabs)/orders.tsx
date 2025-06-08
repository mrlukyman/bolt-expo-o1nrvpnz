import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, Star, RefreshCw, ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

const orderStatuses = ['Cart', 'Active', 'Past'];

const mockOrders = [
  {
    id: '1',
    restaurantName: 'Mario\'s Pizzeria',
    restaurantImage: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: ['Margherita Pizza', 'Caesar Salad'],
    total: 24.50,
    status: 'preparing',
    estimatedTime: '15 min',
    orderTime: '2:30 PM',
    orderNumber: '#1234',
    isActive: true,
  },
  {
    id: '2',
    restaurantName: 'Burger Palace',
    restaurantImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: ['Classic Burger', 'Fries', 'Coke'],
    total: 18.75,
    status: 'ready',
    estimatedTime: 'Ready now',
    orderTime: '1:45 PM',
    orderNumber: '#1233',
    isActive: true,
  },
  {
    id: '3',
    restaurantName: 'Sakura Sushi',
    restaurantImage: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: ['Salmon Roll', 'Tuna Sashimi', 'Miso Soup'],
    total: 32.00,
    status: 'completed',
    estimatedTime: 'Picked up',
    orderTime: 'Yesterday, 7:20 PM',
    orderNumber: '#1232',
    isActive: false,
    rating: 4.8,
  },
  {
    id: '4',
    restaurantName: 'Green Bowl',
    restaurantImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: ['Buddha Bowl', 'Green Smoothie'],
    total: 16.25,
    status: 'completed',
    estimatedTime: 'Picked up',
    orderTime: 'Dec 15, 12:30 PM',
    orderNumber: '#1231',
    isActive: false,
    rating: 4.5,
  },
];

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState('Cart');
  const { state, getCartTotal, getCartItemCount } = useCart();

  const filteredOrders = mockOrders.filter(order => 
    selectedTab === 'Active' ? order.isActive : !order.isActive
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return '#f59e0b';
      case 'ready':
        return '#10b981';
      case 'completed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for pickup';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleTrackOrder = (orderId: string) => {
    router.push(`/live-tracking/${orderId}`);
  };

  const renderCartContent = () => {
    if (state.items.length === 0) {
      return (
        <View style={styles.emptyState}>
          <ShoppingCart size={48} color="#9ca3af" />
          <Text style={styles.emptyStateText}>Your cart is empty</Text>
          <Text style={styles.emptyStateSubtext}>Add items from restaurants to get started</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cartContainer}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartRestaurantName}>{state.restaurant?.name}</Text>
          <Text style={styles.cartItemCount}>{getCartItemCount()} items</Text>
        </View>

        <ScrollView style={styles.cartItems}>
          {state.items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.menuItem.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemContent}>
                <Text style={styles.cartItemName}>{item.menuItem.name}</Text>
                <Text style={styles.cartItemPrice}>${item.totalPrice.toFixed(2)}</Text>
                <Text style={styles.cartItemQuantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.cartFooter}>
          <View style={styles.cartTotal}>
            <Text style={styles.cartTotalLabel}>Total</Text>
            <Text style={styles.cartTotalAmount}>${getCartTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {orderStatuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tab,
              selectedTab === status && styles.tabActive
            ]}
            onPress={() => setSelectedTab(status)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === status && styles.tabTextActive
            ]}>
              {status}
              {status === 'Cart' && state.items.length > 0 && (
                <Text style={styles.tabBadge}> ({getCartItemCount()})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {selectedTab === 'Cart' ? (
        renderCartContent()
      ) : (
        <ScrollView style={styles.ordersContainer} showsVerticalScrollIndicator={false}>
          {filteredOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
                <View style={styles.orderInfo}>
                  <Text style={styles.restaurantName}>{order.restaurantName}</Text>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderTime}>{order.orderTime}</Text>
                </View>
                <View style={styles.orderStatus}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderItems}>
                <Text style={styles.itemsText}>
                  {order.items.join(', ')}
                </Text>
              </View>

              <View style={styles.orderFooter}>
                <View style={styles.orderMeta}>
                  <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
                  {order.isActive && (
                    <View style={styles.timeContainer}>
                      <Clock size={14} color="#9ca3af" />
                      <Text style={styles.estimatedTime}>{order.estimatedTime}</Text>
                    </View>
                  )}
                  {!order.isActive && order.rating && (
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#fbbf24" fill="#fbbf24" />
                      <Text style={styles.rating}>{order.rating}</Text>
                    </View>
                  )}
                </View>

                {order.isActive && (
                  <View style={styles.orderActions}>
                    {order.status === 'ready' && (
                      <TouchableOpacity style={styles.primaryButton}>
                        <MapPin size={16} color="#ffffff" />
                        <Text style={styles.primaryButtonText}>Get Directions</Text>
                      </TouchableOpacity>
                    )}
                    {order.status === 'preparing' && (
                      <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={() => handleTrackOrder(order.id)}
                      >
                        <RefreshCw size={16} color="#ff6b35" />
                        <Text style={styles.secondaryButtonText}>Track Order</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {!order.isActive && (
                  <View style={styles.orderActions}>
                    <TouchableOpacity style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>Reorder</Text>
                    </TouchableOpacity>
                    {!order.rating && (
                      <TouchableOpacity style={styles.primaryButton}>
                        <Star size={16} color="#ffffff" />
                        <Text style={styles.primaryButtonText}>Rate</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {filteredOrders.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {selectedTab === 'Active' ? 'No active orders' : 'No past orders'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedTab === 'Active' 
                  ? 'Your active orders will appear here' 
                  : 'Your order history will appear here'
                }
              </Text>
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#ff6b35',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  cartContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cartRestaurantName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  cartItemCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  cartItems: {
    flex: 1,
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ff6b35',
    marginBottom: 2,
  },
  cartItemQuantity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  cartFooter: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTotalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  cartTotalAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ff6b35',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  browseButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 4,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 4,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
});