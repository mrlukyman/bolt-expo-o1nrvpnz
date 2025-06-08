import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, Clock, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { restaurants } from '@/data/mockData';

const cuisineTypes = ['All', 'Italian', 'American', 'Japanese', 'Mexican', 'Indian', 'Thai', 'Chinese', 'Healthy'];
const priceRanges = ['$', '$$', '$$$', '$$$$'];
const sortOptions = ['Recommended', 'Rating', 'Prep Time', 'Distance'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSort, setSelectedSort] = useState('Recommended');

  const filteredResults = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = !selectedPriceRange || restaurant.priceRange === selectedPriceRange;
    
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  const clearFilters = () => {
    setSelectedCuisine('All');
    setSelectedPriceRange('');
    setSelectedSort('Recommended');
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or dishes"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#ff6b35" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Cuisine</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearButton}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cuisineTypes.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.filterChip,
                    selectedCuisine === cuisine && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCuisine(cuisine)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCuisine === cuisine && styles.filterChipTextActive
                  ]}>
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {priceRanges.map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.filterChip,
                    selectedPriceRange === price && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedPriceRange(selectedPriceRange === price ? '' : price)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPriceRange === price && styles.filterChipTextActive
                  ]}>
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sortOptions.map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.filterChip,
                    selectedSort === sort && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedSort(sort)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSort === sort && styles.filterChipTextActive
                  ]}>
                    {sort}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {filteredResults.length} restaurant{filteredResults.length !== 1 ? 's' : ''} found
        </Text>
        
        {filteredResults.map((restaurant) => (
          <TouchableOpacity 
            key={restaurant.id} 
            style={styles.restaurantCard}
            onPress={() => handleRestaurantPress(restaurant.id)}
          >
            <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantContent}>
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
              </View>
              <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.rating}>{restaurant.rating}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Clock size={14} color="#9ca3af" />
                  <Text style={styles.prepTime}>{restaurant.prepTime}</Text>
                </View>
                <Text style={styles.distance}>{restaurant.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredResults.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No restaurants found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#fff5f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  filtersContainer: {
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterSection: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  clearButton: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ff6b35',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginVertical: 16,
  },
  restaurantCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  restaurantContent: {
    flex: 1,
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  priceRange: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ff6b35',
  },
  restaurantCuisine: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  prepTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 4,
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
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
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});