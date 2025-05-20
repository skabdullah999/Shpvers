"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Minus, Plus, Trash2, Tag } from "lucide-react-native"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { getUserCart, removeFromCart, updateCartItemQuantity, type CartItem, type Product } from "../lib/api"
import { useAuth } from "../context/AuthContext"

export default function CartScreen({ navigation }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const deliveryFee = 5.99

  // Fetch cart items
  useEffect(() => {
    async function fetchCart() {
      if (!user) return

      try {
        setLoading(true)
        const cartData = await getUserCart(user.id)
        setCartItems(cartData)

        // In a real app, you would fetch product details for each cart item
        // For now, we'll use mock data
        const productMap: Record<string, Product> = {}
        cartData.forEach((item) => {
          productMap[item.product_id] = {
            id: item.product_id,
            name: `Product ${item.product_id.substring(0, 8)}`,
            price: Math.floor(Math.random() * 100) + 20,
            image: "/placeholder.svg?height=100&width=100",
            rating: (Math.random() * 2 + 3).toFixed(1),
          }
        })
        setProducts(productMap)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user])

  useEffect(() => {
    calculateSubtotal()
  }, [cartItems, products])

  const calculateSubtotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const product = products[item.product_id]
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
    setSubtotal(total)
  }

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCartItemQuantity(id, newQuantity)
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id)
      setCartItems(cartItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      Alert.alert("Success", "Promo code applied successfully!")
    } else {
      Alert.alert("Invalid Code", "Please enter a valid promo code.")
      setDiscount(0)
    }
  }

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity className="bg-red-500 w-20 justify-center items-center" onPress={() => handleRemoveItem(id)}>
        <Trash2 size={24} color="#FFFFFF" />
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-4 text-gray-600">Loading your cart...</Text>
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
        <Image source={{ uri: "/placeholder.svg?height=200&width=200" }} className="w-40 h-40 mb-4" />
        <Text className="text-xl font-bold text-gray-800 mb-2">Please sign in</Text>
        <Text className="text-gray-500 text-center mb-6">You need to sign in to view your cart</Text>
        <TouchableOpacity className="bg-indigo-600 rounded-lg py-3 px-6" onPress={() => navigation.navigate("Auth")}>
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4 py-4 border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-800">My Cart</Text>
          <Text className="text-gray-500">{cartItems.length} items</Text>
        </View>

        {cartItems.length > 0 ? (
          <>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Cart Items */}
              <View className="p-4">
                {cartItems.map((item) => {
                  const product = products[item.product_id]
                  if (!product) return null

                  return (
                    <Swipeable key={item.id} renderRightActions={() => renderRightActions(item.id)}>
                      <View className="flex-row bg-white p-3 rounded-lg shadow-sm mb-3 border border-gray-100">
                        <Image source={{ uri: product.image }} className="w-20 h-20 rounded-md" />
                        <View className="flex-1 ml-3 justify-between">
                          <View>
                            <Text className="text-gray-800 font-medium">{product.name}</Text>
                            <Text className="text-indigo-600 font-bold mt-1">${product.price}</Text>
                          </View>
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center bg-gray-100 rounded-full">
                              <TouchableOpacity
                                className="w-8 h-8 rounded-full justify-center items-center"
                                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={16} color="#4B5563" />
                              </TouchableOpacity>
                              <Text className="mx-2 font-medium">{item.quantity}</Text>
                              <TouchableOpacity
                                className="w-8 h-8 rounded-full justify-center items-center"
                                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={16} color="#4B5563" />
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                              <Trash2 size={20} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Swipeable>
                  )
                })}
              </View>

              {/* Promo Code */}
              <View className="px-4 mb-4">
                <Text className="text-lg font-bold text-gray-800 mb-2">Promo Code</Text>
                <View className="flex-row">
                  <View className="flex-row flex-1 items-center bg-gray-100 rounded-l-lg px-3">
                    <Tag size={20} color="#6366F1" />
                    <TextInput
                      className="flex-1 ml-2 h-12 text-gray-800"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChangeText={setPromoCode}
                    />
                  </View>
                  <TouchableOpacity className="bg-indigo-600 rounded-r-lg px-4 justify-center" onPress={applyPromoCode}>
                    <Text className="text-white font-bold">Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Price Details */}
              <View className="px-4 mb-24">
                <Text className="text-lg font-bold text-gray-800 mb-2">Price Details</Text>
                <View className="bg-gray-50 rounded-lg p-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Subtotal</Text>
                    <Text className="text-gray-800 font-medium">${subtotal.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Discount</Text>
                    <Text className="text-green-600 font-medium">-${discount.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Delivery Fee</Text>
                    <Text className="text-gray-800 font-medium">${deliveryFee.toFixed(2)}</Text>
                  </View>
                  <View className="border-t border-gray-200 my-2" />
                  <View className="flex-row justify-between">
                    <Text className="text-gray-800 font-bold">Total</Text>
                    <Text className="text-indigo-600 font-bold text-lg">
                      ${(subtotal - discount + deliveryFee).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Checkout Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <TouchableOpacity className="bg-indigo-600 rounded-lg py-4 items-center">
                <Text className="text-white font-bold text-lg">Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Image source={{ uri: "/placeholder.svg?height=200&width=200" }} className="w-40 h-40 mb-4" />
            <Text className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</Text>
            <Text className="text-gray-500 text-center mb-6">
              Looks like you haven't added anything to your cart yet.
            </Text>
            <TouchableOpacity
              className="bg-indigo-600 rounded-lg py-3 px-6"
              onPress={() => navigation.navigate("Home")}
            >
              <Text className="text-white font-bold">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
