"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapPin, Bell, Search, ChevronRight, Star } from "lucide-react-native"
import ProductCard from "../components/ProductCard"
import CategoryItem from "../components/CategoryItem"
import { getCategories, getFeaturedProducts, type Category, type Product } from "../lib/api"
import { useAuth } from "../context/AuthContext"

const { width } = Dimensions.get("window")

// Mock data for banners
const banners = [
  { id: "1", image: "/placeholder.svg?height=200&width=400" },
  { id: "2", image: "/placeholder.svg?height=200&width=400" },
  { id: "3", image: "/placeholder.svg?height=200&width=400" },
]

export default function HomeScreen({ navigation }) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [hours, setHours] = useState(5)
  const [minutes, setMinutes] = useState(30)
  const [seconds, setSeconds] = useState(0)
  const scrollX = new Animated.Value(0)

  // State for data from Supabase
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Fetch featured products
        const productsData = await getFeaturedProducts()
        setFeaturedProducts(productsData)

        // Use some of the featured products as flash sale products
        setFlashSaleProducts(productsData.slice(0, 4))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Auto scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else if (hours > 0) {
        setHours(hours - 1)
        setMinutes(59)
        setSeconds(59)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [hours, minutes, seconds])

  // Search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      // Filter products based on search query
      const filteredProducts = featuredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchSuggestions(filteredProducts)
      setShowSuggestions(true)
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, featuredProducts])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-4 text-gray-600">Loading products...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} className="w-10 h-10 rounded-full" />
          <Text className="ml-2 text-xl font-bold text-indigo-600">ShopVerse</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="flex-row items-center mr-4">
            <MapPin size={18} color="#6366F1" />
            <Text className="ml-1 text-gray-700">New York</Text>
          </TouchableOpacity>
          <TouchableOpacity className="relative">
            <Bell size={24} color="#6366F1" />
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <Text className="text-white text-xs">3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-2 relative">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Search Suggestions */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <View className="absolute top-14 left-4 right-4 bg-white rounded-lg shadow-lg z-10 max-h-60">
            <FlatList
              data={searchSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center p-3 border-b border-gray-100"
                  onPress={() => {
                    setSearchQuery("")
                    setShowSuggestions(false)
                    navigation.navigate("ProductDetails", { product: item })
                  }}
                >
                  <Image source={{ uri: item.image }} className="w-10 h-10 rounded" />
                  <Text className="ml-3 text-gray-800">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View className="py-4">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <Text className="text-lg font-bold text-gray-800">Categories</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-indigo-600 mr-1">See All</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Banner Slider */}
        <View className="mb-6">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            scrollEventThrottle={16}
          >
            {banners.map((banner, index) => (
              <View key={banner.id} style={{ width }}>
                <Image source={{ uri: banner.image }} className="h-40 mx-4 rounded-xl" style={{ width: width - 32 }} />
              </View>
            ))}
          </ScrollView>
          <View className="flex-row justify-center mt-2">
            {banners.map((_, index) => {
              const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 16, 8],
                extrapolate: "clamp",
              })
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              })
              return (
                <Animated.View
                  key={index}
                  className="h-2 rounded-full bg-indigo-600 mx-1"
                  style={{ width: dotWidth, opacity }}
                />
              )
            })}
          </View>
        </View>

        {/* Flash Sale */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-gray-800 mr-2">Flash Sale</Text>
              <View className="bg-red-500 px-2 py-1 rounded">
                <Text className="text-white font-bold">
                  {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-indigo-600 mr-1">See All</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
            {flashSaleProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="mr-4 bg-white rounded-lg shadow-sm overflow-hidden w-36"
                onPress={() => navigation.navigate("ProductDetails", { product })}
              >
                <View className="relative">
                  <Image source={{ uri: product.image }} className="w-36 h-36" />
                  {product.originalPrice && (
                    <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded">
                      <Text className="text-white text-xs font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-2">
                  <Text className="text-gray-800 font-medium" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-indigo-600 font-bold">${product.price}</Text>
                    {product.originalPrice && (
                      <Text className="text-gray-500 text-xs line-through ml-1">${product.originalPrice}</Text>
                    )}
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-gray-600 text-xs ml-1">{product.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Popular Products</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-indigo-600 mr-1">See All</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => navigation.navigate("ProductDetails", { product })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
