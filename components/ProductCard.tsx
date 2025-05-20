"use client"

import { View, Text, TouchableOpacity, Image } from "react-native"
import { Star, ShoppingCart } from "lucide-react-native"
import { addToCart } from "../lib/api"
import { useAuth } from "../context/AuthContext"

export default function ProductCard({ product, onPress, isHorizontal = false }) {
  const { user } = useAuth()

  const handleAddToCart = async () => {
    if (!user) return

    try {
      await addToCart(user.id, product.id, 1)
      // You could add a toast notification here
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  return (
    <TouchableOpacity
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 ${isHorizontal ? "w-full" : "w-full mb-4"}`}
      onPress={onPress}
    >
      <Image
        source={{ uri: product.image }}
        className={`${isHorizontal ? "w-full h-32" : "w-full h-40"} object-cover`}
      />
      <View className="p-3">
        <Text className="text-gray-800 font-medium" numberOfLines={1}>
          {product.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-indigo-600 font-bold">${product.price}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text className="text-gray-600 text-xs ml-1">{product.rating}</Text>
          </View>
          <TouchableOpacity
            className="w-8 h-8 bg-indigo-100 rounded-full items-center justify-center"
            onPress={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
          >
            <ShoppingCart size={14} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}
