"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search, SlidersHorizontal, X, ArrowUpDown, Check } from "lucide-react-native"
import ProductCard from "../components/ProductCard"

// Mock data
const allProducts = [
  { id: "1", name: "Smartphone X", price: 699.99, image: "/placeholder.svg?height=200&width=200", rating: 4.8 },
  { id: "2", name: "Laptop Pro", price: 1299.99, image: "/placeholder.svg?height=200&width=200", rating: 4.9 },
  { id: "3", name: "Wireless Headphones", price: 149.99, image: "/placeholder.svg?height=200&width=200", rating: 4.6 },
  { id: "4", name: 'Smart TV 55"', price: 499.99, image: "/placeholder.svg?height=200&width=200", rating: 4.7 },
  { id: "5", name: "Digital Camera", price: 399.99, image: "/placeholder.svg?height=200&width=200", rating: 4.5 },
  { id: "6", name: "Gaming Console", price: 349.99, image: "/placeholder.svg?height=200&width=200", rating: 4.8 },
  { id: "7", name: "Tablet Mini", price: 299.99, image: "/placeholder.svg?height=200&width=200", rating: 4.4 },
  { id: "8", name: "Smartwatch Pro", price: 199.99, image: "/placeholder.svg?height=200&width=200", rating: 4.3 },
  { id: "9", name: "Bluetooth Speaker", price: 79.99, image: "/placeholder.svg?height=200&width=200", rating: 4.2 },
  { id: "10", name: "Wireless Mouse", price: 29.99, image: "/placeholder.svg?height=200&width=200", rating: 4.1 },
]

// Recent searches
const recentSearches = ["smartphone", "laptop", "headphones", "camera", "smartwatch"]

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 })
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortOption, setSortOption] = useState("relevance")

  // Debounce search
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true)
      const debounceTimer = setTimeout(() => {
        performSearch()
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(debounceTimer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const performSearch = () => {
    // Filter products based on search query
    let results = allProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Apply filters
    if (priceRange.min > 0 || priceRange.max < 2000) {
      results = results.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max)
    }

    if (selectedRating > 0) {
      results = results.filter((product) => product.rating >= selectedRating)
    }

    // Apply sorting
    switch (sortOption) {
      case "price_low_high":
        results.sort((a, b) => a.price - b.price)
        break
      case "price_high_low":
        results.sort((a, b) => b.price - a.price)
        break
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      default:
        // relevance - no sorting needed
        break
    }

    setSearchResults(results)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const handleRecentSearch = (term) => {
    setSearchQuery(term)
  }

  const applyFilters = () => {
    performSearch()
    setShowFilterModal(false)
  }

  const applySorting = (option) => {
    setSortOption(option)
    performSearch()
    setShowSortModal(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Header */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter and Sort Bar */}
      {searchResults.length > 0 && (
        <View className="flex-row px-4 py-2 border-b border-gray-100">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2 border-r border-gray-200"
            onPress={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal size={18} color="#6366F1" />
            <Text className="ml-2 text-indigo-600 font-medium">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2"
            onPress={() => setShowSortModal(true)}
          >
            <ArrowUpDown size={18} color="#6366F1" />
            <Text className="ml-2 text-indigo-600 font-medium">Sort</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="mt-2 text-gray-600">Searching...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <View className="flex-1 p-2">
              <ProductCard product={item} onPress={() => navigation.navigate("ProductDetails", { product: item })} />
            </View>
          )}
        />
      ) : searchQuery.length > 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Image source={{ uri: "/placeholder.svg?height=150&width=150" }} className="w-32 h-32 mb-4" />
          <Text className="text-xl font-bold text-gray-800 mb-2">No results found</Text>
          <Text className="text-gray-500 text-center">
            We couldn't find any products matching "{searchQuery}". Try different keywords or browse categories.
          </Text>
        </View>
      ) : (
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Recent Searches</Text>
          {recentSearches.map((term, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={() => handleRecentSearch(term)}
            >
              <Search size={18} color="#9CA3AF" />
              <Text className="ml-3 text-gray-700">{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-10">
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-medium text-gray-800 mb-2">Price Range</Text>
            <View className="flex-row justify-between mb-6">
              <View className="flex-1 mr-2">
                <Text className="text-gray-500 mb-1">Min</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                  keyboardType="numeric"
                  value={priceRange.min.toString()}
                  onChangeText={(text) => setPriceRange({ ...priceRange, min: Number.parseInt(text) || 0 })}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-500 mb-1">Max</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                  keyboardType="numeric"
                  value={priceRange.max.toString()}
                  onChangeText={(text) => setPriceRange({ ...priceRange, max: Number.parseInt(text) || 0 })}
                />
              </View>
            </View>

            <Text className="text-lg font-medium text-gray-800 mb-2">Rating</Text>
            <View className="flex-row mb-6">
              {[4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  className={`flex-row items-center mr-4 px-3 py-2 rounded-full ${selectedRating === rating ? "bg-indigo-100 border border-indigo-300" : "bg-gray-100"}`}
                  onPress={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                >
                  <Text className={`${selectedRating === rating ? "text-indigo-600" : "text-gray-700"}`}>
                    {rating}+ ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity className="bg-indigo-600 rounded-lg py-3 items-center" onPress={applyFilters}>
              <Text className="text-white font-bold">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-10">
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {[
              { id: "relevance", label: "Relevance" },
              { id: "price_low_high", label: "Price: Low to High" },
              { id: "price_high_low", label: "Price: High to Low" },
              { id: "rating", label: "Rating" },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
                onPress={() => applySorting(option.id)}
              >
                <Text
                  className={`text-lg ${sortOption === option.id ? "text-indigo-600 font-medium" : "text-gray-700"}`}
                >
                  {option.label}
                </Text>
                {sortOption === option.id && <Check size={20} color="#6366F1" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
