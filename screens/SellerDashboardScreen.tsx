"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Plus, MoreVertical, Edit, Trash2, TrendingUp, Package, AlertTriangle, DollarSign } from "lucide-react-native"

// Mock data
const products = [
  {
    id: "1",
    name: "Smartphone X",
    price: 699.99,
    image: "/placeholder.svg?height=100&width=100",
    stock: 45,
    sold: 120,
  },
  {
    id: "2",
    name: "Wireless Earbuds",
    price: 49.99,
    image: "/placeholder.svg?height=100&width=100",
    stock: 8,
    sold: 250,
  },
  {
    id: "3",
    name: "Smart Watch",
    price: 129.99,
    image: "/placeholder.svg?height=100&width=100",
    stock: 32,
    sold: 85,
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "/placeholder.svg?height=100&width=100",
    stock: 18,
    sold: 65,
  },
  {
    id: "5",
    name: "Tablet Pro",
    price: 349.99,
    image: "/placeholder.svg?height=100&width=100",
    stock: 12,
    sold: 40,
  },
]

export default function SellerDashboardScreen({ navigation }) {
  const [showActionMenu, setShowActionMenu] = useState(null)

  const todayOrders = 24
  const todayRevenue = 2845.75
  const lowStockItems = products.filter((p) => p.stock < 10).length

  const handleEdit = (product) => {
    setShowActionMenu(null)
    // Navigate to edit product screen
    Alert.alert("Edit Product", `Editing ${product.name}`)
  }

  const handleDelete = (product) => {
    setShowActionMenu(null)
    Alert.alert("Delete Product", `Are you sure you want to delete ${product.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => console.log("Delete product", product.id) },
    ])
  }

  const renderProductItem = ({ item }) => (
    <View className="flex-row bg-white p-3 rounded-lg shadow-sm mb-3 border border-gray-100">
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md" />
      <View className="flex-1 ml-3 justify-between">
        <View>
          <Text className="text-gray-800 font-medium">{item.name}</Text>
          <Text className="text-indigo-600 font-bold">${item.price}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className={`text-sm ${item.stock < 10 ? "text-red-500" : "text-gray-500"}`}>
              Stock: {item.stock} units
            </Text>
            <Text className="text-gray-500 text-sm">Sold: {item.sold}</Text>
          </View>
          <View className="relative">
            <TouchableOpacity onPress={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}>
              <MoreVertical size={20} color="#4B5563" />
            </TouchableOpacity>

            {showActionMenu === item.id && (
              <View className="absolute right-0 top-6 bg-white rounded-lg shadow-lg z-10 w-32 border border-gray-200">
                <TouchableOpacity
                  className="flex-row items-center p-3 border-b border-gray-100"
                  onPress={() => handleEdit(item)}
                >
                  <Edit size={16} color="#6366F1" />
                  <Text className="ml-2 text-gray-700">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center p-3" onPress={() => handleDelete(item)}>
                  <Trash2 size={16} color="#EF4444" />
                  <Text className="ml-2 text-red-500">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">Seller Dashboard</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Analytics Cards */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Today's Overview</Text>
          <View className="flex-row flex-wrap">
            <View className="w-1/2 pr-2 mb-3">
              <View className="bg-indigo-50 p-4 rounded-lg">
                <View className="bg-indigo-100 w-10 h-10 rounded-full items-center justify-center mb-2">
                  <Package size={20} color="#6366F1" />
                </View>
                <Text className="text-gray-600">Orders</Text>
                <Text className="text-2xl font-bold text-gray-800">{todayOrders}</Text>
                <Text className="text-indigo-600 text-sm">+12% from yesterday</Text>
              </View>
            </View>
            <View className="w-1/2 pl-2 mb-3">
              <View className="bg-green-50 p-4 rounded-lg">
                <View className="bg-green-100 w-10 h-10 rounded-full items-center justify-center mb-2">
                  <DollarSign size={20} color="#10B981" />
                </View>
                <Text className="text-gray-600">Revenue</Text>
                <Text className="text-2xl font-bold text-gray-800">${todayRevenue.toFixed(2)}</Text>
                <Text className="text-green-600 text-sm">+8% from yesterday</Text>
              </View>
            </View>
            <View className="w-1/2 pr-2">
              <View className="bg-amber-50 p-4 rounded-lg">
                <View className="bg-amber-100 w-10 h-10 rounded-full items-center justify-center mb-2">
                  <AlertTriangle size={20} color="#F59E0B" />
                </View>
                <Text className="text-gray-600">Low Stock</Text>
                <Text className="text-2xl font-bold text-gray-800">{lowStockItems}</Text>
                <Text className="text-amber-600 text-sm">Items need restock</Text>
              </View>
            </View>
            <View className="w-1/2 pl-2">
              <View className="bg-blue-50 p-4 rounded-lg">
                <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mb-2">
                  <TrendingUp size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-600">Conversion</Text>
                <Text className="text-2xl font-bold text-gray-800">5.2%</Text>
                <Text className="text-blue-600 text-sm">+1.2% from last week</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Products List */}
        <View className="px-4 mb-20">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Your Products</Text>
            <Text className="text-indigo-600">{products.length} items</Text>
          </View>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => Alert.alert("Add Product", "Navigate to add product screen")}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
