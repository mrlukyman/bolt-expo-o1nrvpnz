import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Clock, MapPin, Phone, Plus, Minus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { restaurants, menuItems } from '@/data/mockData';
import { MenuItem, Customization } from '@/types';
import { useCart } from '@/context/CartContext';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dispatch } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<{ [key: string]: string[] }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const restaurant = restaurants.find(r => r.id === id);
  const menu = menuItems[id || ''] || [];

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  const categories = ['All', ...Array.from(new Set(menu.map(item => item.category)))];
  const filteredMenu = selectedCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  const handleItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setCustomizations({});
    setSpecialInstructions('');
  };

  const handleCustomizationChange = (customizationId: string, optionId: string, isMultiple: boolean) => {
    setCustomizations(prev => {
      if (isMultiple) {
        const current = prev[customizationId] || [];
        const exists = current.includes(optionId);
        return {
          ...prev,
          [customizationId]: exists 
            ? current.filter(id => id !== optionId)
            : [...current, optionId]
        };
      } else {
        return {
          ...prev,
          [customizationId]: [optionId]
        };
      }
    });
  };

  const calculateItemPrice = () => {
    if (!selectedItem) return 0;
    
    let basePrice = selectedItem.price;
    let customizationPrice = 0;

    Object.values(customizations).flat().forEach(optionId => {
      selectedItem.customizations?.forEach(customization => {
        const option = customization.options.find(opt => opt.id === optionId);
        if (option) customizationPrice += option.price;
      });
    });

    return (basePrice + customizationPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        menuItem: selectedItem,
        quantity,
        customizations,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
      }
    });

    setSelectedItem(null);
    // Show success feedback or navigate to cart
  };

  const renderCustomizationModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedItem(null)}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Customize Item</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedItem.image }} style={styles.modalItemImage} />
            
            <View style={styles.modalItemInfo}>
              <Text style={styles.modalItemName}>{selectedItem.name}</Text>
              <Text style={styles.modalItemDescription}>{selectedItem.description}</Text>
              <Text style={styles.modalItemPrice}>${selectedItem.price.toFixed(2)}</Text>
            </View>

            {selectedItem.customizations?.map((customization: Customization) => (
              <View key={customization.id} style={styles.customizationSection}>
                <Text style={styles.customizationTitle}>
                  {customization.name}
                  {customization.required && <Text style={styles.required}> *</Text>}
                </Text>
                
                {customization.options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.customizationOption}
                    onPress={() => handleCustomizationChange(
                      customization.id, 
                      option.id, 
                      customization.type === 'multiple'
                    )}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.optionSelector,
                        customization.type === 'single' ? styles.radioButton : styles.checkbox,
                        (customizations[customization.id] || []).includes(option.id) && styles.optionSelected
                      ]} />
                      <Text style={styles.optionName}>{option.name}</Text>
                    </View>
                    {option.price > 0 && (
                      <Text style={styles.optionPrice}>+${option.price.toFixed(2)}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.specialInstructionsSection}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <TextInput
                style={styles.instructionsInput}
                placeholder="Any special requests..."
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={20} color="#ff6b35" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus size={20} color="#ff6b35" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>
                Add to Cart - ${calculateItemPrice().toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Image */}
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />

        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          
          <View style={styles.restaurantMeta}>
            <View style={styles.metaItem}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.metaText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#9ca3af" />
              <Text style={styles.metaText}>{restaurant.prepTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#9ca3af" />
              <Text style={styles.metaText}>{restaurant.distance}</Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.contactText}>{restaurant.address}</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.contactText}>{restaurant.phone}</Text>
            </View>
          </View>
        </View>

        {/* Menu Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {filteredMenu.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleItemPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.menuItemImage} />
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  {item.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <View style={styles.menuItemFooter}>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.menuItemTags}>
                    {item.vegetarian && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>🌱</Text>
                      </View>
                    )}
                    {item.spicy && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>🌶️</Text>
                      </View>
                    )}
                    {item.calories && (
                      <Text style={styles.caloriesText}>{item.calories} cal</Text>
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={20} color="#ffffff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderCustomizationModal()}
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
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  restaurantDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  restaurantMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 4,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
  },
  categoriesSection: {
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
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
    overflow: 'hidden',
  },
  menuItemImage: {
    width: 100,
    height: 100,
  },
  menuItemContent: {
    flex: 1,
    padding: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#d97706',
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ff6b35',
  },
  menuItemTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
  },
  caloriesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    backgroundColor: '#ff6b35',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
  },
  modalItemImage: {
    width: '100%',
    height: 200,
  },
  modalItemInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalItemDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 8,
  },
  modalItemPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ff6b35',
  },
  customizationSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customizationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  required: {
    color: '#ef4444',
  },
  customizationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionSelector: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
  },
  radioButton: {
    borderRadius: 10,
  },
  checkbox: {
    borderRadius: 4,
  },
  optionSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  optionName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  optionPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  specialInstructionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
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
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});