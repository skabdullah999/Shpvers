"use client"

import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  HelpCircle,
  CreditCard,
  MapPin,
  Bell,
} from "lucide-react-native"
import { useAuth } from "../context/AuthContext"

export default function ProfileScreen({ navigation }) {
  const { user, signOut, loading } = useAuth()

  const menuItems = [
    {
      id: "orders",
      title: "My Orders",
      icon: ShoppingBag,
      color: "#6366F1",
      onPress: () => navigation.navigate("Orders"),
    },
    {
      id: "saved",
      title: "Saved Items",
      icon: Heart,
      color: "#EF4444",
      onPress: () => console.log("Navigate to saved items"),
    },
    {
      id: "payment",
      title: "Payment Methods",
      icon: CreditCard,
      color: "#10B981",
      onPress: () => console.log("Navigate to payment methods"),
    },
    {
      id: "address",
      title: "Delivery Addresses",
      icon: MapPin,
      color: "#F59E0B",
      onPress: () => console.log("Navigate to addresses"),
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      color: "#3B82F6",
      onPress: () => console.log("Navigate to notifications"),
    },
    {
      id: "help",
      title: "Help Center",
      icon: HelpCircle,
      color: "#8B5CF6",
      onPress: () => console.log("Navigate to help center"),
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      color: "#6B7280",
      onPress: () => console.log("Navigate to settings"),
    },
  ]

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
        <Image source={{ uri: "/placeholder.svg?height=200&width=200" }} className="w-40 h-40 mb-4" />
        <Text className="text-xl font-bold text-gray-800 mb-2">Please sign in</Text>
        <Text className="text-gray-500 text-center mb-6">Sign in to view your profile and manage your orders</Text>
        <TouchableOpacity className="bg-indigo-600 rounded-lg py-3 px-6" onPress={() => navigation.navigate("Auth")}>
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View className="p-4 flex-row items-center">
          <Image
            source={{ uri: user.avatar_url || "/placeholder.svg?height=80&width=80" }}
            className="w-20 h-20 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-xl font-bold text-gray-800">{user.full_name || "User"}</Text>
            <Text className="text-gray-500">{user.email}</Text>
            <TouchableOpacity className="mt-1">
              <Text className="text-indigo-600 font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4 pt-2 pb-6">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-4 border-b border-gray-100"
              onPress={item.onPress}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon size={20} color={item.color} />
              </View>
              <Text className="flex-1 ml-3 text-gray-800 font-medium">{item.title}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            className="flex-row items-center py-4 px-4 bg-gray-100 rounded-lg"
            onPress={async () => {
              await signOut()
              navigation.navigate("Auth")
            }}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="ml-3 text-red-500 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center mb-8">
          <Text className="text-gray-400 text-sm">ShopVerse v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
