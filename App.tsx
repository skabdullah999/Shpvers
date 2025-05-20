"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "react-native"
import { Home, Search, ShoppingBag, User, LayoutGrid } from "lucide-react-native"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Screens
import HomeScreen from "./screens/HomeScreen"
import ProductDetailsScreen from "./screens/ProductDetailsScreen"
import CartScreen from "./screens/CartScreen"
import SearchScreen from "./screens/SearchScreen"
import SellerDashboardScreen from "./screens/SellerDashboardScreen"
import ProfileScreen from "./screens/ProfileScreen"
import OrdersScreen from "./screens/OrdersScreen"
import AuthScreen from "./screens/AuthScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <Home size={size} color={color} />
          } else if (route.name === "Search") {
            return <Search size={size} color={color} />
          } else if (route.name === "Cart") {
            return <ShoppingBag size={size} color={color} />
          } else if (route.name === "Profile") {
            return <User size={size} color={color} />
          } else if (route.name === "Seller") {
            return <LayoutGrid size={size} color={color} />
          }
        },
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Seller" component={SellerDashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { user, loading } = useAuth()

  // Show loading screen while checking authentication
  if (loading) {
    return null // You could add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={HomeTabs} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
