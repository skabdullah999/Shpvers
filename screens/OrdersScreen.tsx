"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Package, Truck, CheckCircle, ChevronRight } from "lucide-react-native"

// Mock data
const orders = [
  {
    id: "ORD-001",
    date: "2023-05-15",
    status: "delivered",
    items: [
      { id: "1", name: "Smartphone X", price: 699.99, image: "/placeholder.svg?height=80&width=80", quantity: 1 },
    ],
    total: 699.99,
  },
  {
    id: "ORD-002",
    date: "2023-05-10",
    status: "shipped",
    items: [
      { id: "2", name: "Wireless Earbuds", price: 49.99, image: "/placeholder.svg?height=80&width=80", quantity: 1 },
      { id: "3", name: "Smart Watch", price: 129.99, image: "/placeholder.svg?height=80&width=80", quantity: 1 },
    ],
    total: 179.98,
  },
  {
    id: "ORD-003",
    date: "2023-05-05",
    status: "pending",
    items: [
      { id: "4", name: "Bluetooth Speaker", price: 79.99, image: "/placeholder.svg?height=80&width=80", quantity: 2 },
    ],
    total: 159.98,
  },
  {
    id: "ORD-004",
    date: "2023-04-28",
    status: "delivered",
    items: [{ id: "5", name: "Tablet Pro", price: 349.99, image: "/placeholder.svg?height=80&width=80", quantity: 1 }],
    total: 349.99,
  },
  {
    id: "ORD-005",
    date: "2023-04-20",
    status: "delivered",
    items: [
      { id: "6", name: "Wireless Mouse", price: 29.99, image: "/placeholder.svg?height=80&width=80", quantity: 1 },
      { id: "7", name: "Keyboard", price: 59.99, image: "/placeholder.svg?height=80&width=80", quantity: 1 },
    ],
    total: 89.98,
  },
]

export default function OrdersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package size={16} color="#92400E" />
      case "shipped":
        return <Truck size={16} color="#1E40AF" />
      case "delivered":
        return <CheckCircle size={16} color="#166534" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100"
      onPress={() => console.log("View order details", item.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-gray-800">{item.id}</Text>
        <View className={`flex-row items-center px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
          {getStatusIcon(item.status)}
          <Text className={`ml-1 text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text className="text-gray-500 mb-3">Ordered on {formatDate(item.date)}</Text>

      <View className="border-t border-gray-100 pt-3">
        {item.items.map((product) => (
          <View key={product.id} className="flex-row items-center mb-2">
            <Image source={{ uri: product.image }} className="w-12 h-12 rounded-md" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-800">{product.name}</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500">Qty: {product.quantity}</Text>
                <Text className="text-indigo-600 font-medium ml-auto">${product.price}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <Text className="text-gray-500">Total:</Text>
        <Text className="text-lg font-bold text-indigo-600">${item.total.toFixed(2)}</Text>
      </View>

      <View className="flex-row justify-end mt-3">
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-indigo-600 font-medium mr-1">View Details</Text>
          <ChevronRight size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold text-gray-800">My Orders</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-2 border-b border-gray-100">
        {[
          { id: "all", label: "All" },
          { id: "pending", label: "Pending" },
          { id: "shipped", label: "Shipped" },
          { id: "delivered", label: "Delivered" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`mr-4 py-2 ${activeTab === tab.id ? "border-b-2 border-indigo-600" : ""}`}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text className={`font-medium ${activeTab === tab.id ? "text-indigo-600" : "text-gray-500"}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Image source={{ uri: "/placeholder.svg?height=150&width=150" }} className="w-32 h-32 mb-4" />
          <Text className="text-xl font-bold text-gray-800 mb-2">No orders found</Text>
          <Text className="text-gray-500 text-center mb-6">
            You don't have any {activeTab !== "all" ? activeTab : ""} orders yet.
          </Text>
          <TouchableOpacity className="bg-indigo-600 rounded-lg py-3 px-6" onPress={() => navigation.navigate("Home")}>
            <Text className="text-white font-bold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}
