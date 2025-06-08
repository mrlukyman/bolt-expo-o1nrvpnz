import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, CreditCard, Bell, CircleHelp as HelpCircle, Settings, Star, Gift, ChevronRight, LogOut } from 'lucide-react-native';

const menuItems = [
  {
    id: '1',
    title: 'Account Settings',
    subtitle: 'Personal information, password',
    icon: User,
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Addresses',
    subtitle: 'Manage pickup locations',
    icon: MapPin,
    color: '#10b981',
  },
  {
    id: '3',
    title: 'Payment Methods',
    subtitle: 'Cards, digital wallets',
    icon: CreditCard,
    color: '#f59e0b',
  },
  {
    id: '4',
    title: 'Notifications',
    subtitle: 'Order updates, promotions',
    icon: Bell,
    color: '#8b5cf6',
  },
  {
    id: '5',
    title: 'Rewards',
    subtitle: 'Points, coupons, offers',
    icon: Gift,
    color: '#ef4444',
  },
  {
    id: '6',
    title: 'Help & Support',
    subtitle: 'FAQ, contact us',
    icon: HelpCircle,
    color: '#06b6d4',
  },
  {
    id: '7',
    title: 'App Settings',
    subtitle: 'Language, preferences',
    icon: Settings,
    color: '#6b7280',
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john.doe@email.com</Text>
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Star size={16} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.statText}>4.8</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statText}>•</Text>
                  <Text style={styles.statText}>127 orders</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Rewards Card */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsContent}>
            <View style={styles.rewardsInfo}>
              <Text style={styles.rewardsTitle}>Pick-up Rewards</Text>
              <Text style={styles.rewardsSubtitle}>850 points available</Text>
              <Text style={styles.rewardsProgress}>150 points to next reward</Text>
            </View>
            <View style={styles.rewardsIcon}>
              <Gift size={24} color="#ff6b35" />
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Pick-up v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Pick-up. All rights reserved.</Text>
        </View>
      </ScrollView>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 2,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  rewardsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff5f2',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7cc',
  },
  rewardsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardsInfo: {
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  rewardsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ff6b35',
    marginBottom: 2,
  },
  rewardsProgress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  rewardsIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#fed7cc',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff6b35',
    borderRadius: 2,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
  },
});