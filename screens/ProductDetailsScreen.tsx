"use client"

import { useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, ChevronRight, Store } from "lucide-react-native"
import ProductCard from "../components/ProductCard"

const { width } = Dimensions.get("window")

// Mock data
const similarProducts = [
  { id: "1", name: "Smartphone Y", price: 649.99, image: "/placeholder.svg?height=200&width=200", rating: 4.6 },
  { id: "2", name: "Smartphone Z", price: 749.99, image: "/placeholder.svg?height=200&width=200", rating: 4.7 },
  { id: "3", name: "Smartphone Pro", price: 899.99, image: "/placeholder.svg?height=200&width=200", rating: 4.9 },
]

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const scrollX = useRef(new Animated.Value(0)).current

  // Generate multiple images for the carousel
  const productImages = [
    product.image,
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Product Details</Text>
        <View className="flex-row">
          <TouchableOpacity className="mr-4" onPress={() => setIsFavorite(!isFavorite)}>
            <Heart size={24} color={isFavorite ? "#EF4444" : "#374151"} fill={isFavorite ? "#EF4444" : "none"} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Share2 size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View>
          <FlatList
            data={productImages}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={{ width }}>
                <Image source={{ uri: item }} className="w-full h-80" resizeMode="contain" />
              </View>
            )}
          />
          <View className="flex-row justify-center mt-2">
            {productImages.map((_, index) => {
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

        {/* Product Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800">{product.name}</Text>

          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center">
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <Text className="ml-1 text-gray-700">{product.rating}</Text>
              <Text className="ml-1 text-gray-500">(120 reviews)</Text>
            </View>
            <View className="flex-1" />
            <Text className="text-green-600">In Stock</Text>
          </View>

          <Text className="text-2xl font-bold text-indigo-600 mt-4">${product.price}</Text>

          {/* Seller Info */}
          <TouchableOpacity className="flex-row items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
            <View className="flex-row items-center">
              <Store size={20} color="#6366F1" />
              <View className="ml-2">
                <Text className="font-medium text-gray-800">TechGadgets Official</Text>
                <Text className="text-gray-500 text-sm">98% Positive Feedback</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Description */}
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">Description</Text>
            <Text className="text-gray-600 leading-6">
              Experience the next generation of technology with the {product.name}. Featuring cutting-edge performance,
              stunning display, and all-day battery life. Perfect for work, gaming, and everything in between.
            </Text>
          </View>

          {/* Specifications */}
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">Specifications</Text>
            <View className="bg-gray-50 rounded-lg p-3">
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-500">Brand</Text>
                <Text className="text-gray-800 font-medium">TechGadgets</Text>
              </View>
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-500">Model</Text>
                <Text className="text-gray-800 font-medium">X Pro 2023</Text>
              </View>
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-500">Color</Text>
                <Text className="text-gray-800 font-medium">Midnight Black</Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-500">Warranty</Text>
                <Text className="text-gray-800 font-medium">1 Year</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Similar Products */}
        <View className="mt-2 mb-24">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <Text className="text-lg font-bold text-gray-800">Similar Products</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-indigo-600 mr-1">See All</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
            {similarProducts.map((item) => (
              <View key={item.id} className="mr-4 w-40">
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate("ProductDetails", { product: item })}
                  isHorizontal
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex-row">
        <TouchableOpacity className="flex-1 bg-white border border-indigo-600 rounded-lg mr-2 py-3 flex-row justify-center items-center">
          <ShoppingCart size={20} color="#6366F1" />
          <Text className="ml-2 font-bold text-indigo-600">Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-indigo-600 rounded-lg py-3 flex-row justify-center items-center">
          <Text className="font-bold text-white">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
