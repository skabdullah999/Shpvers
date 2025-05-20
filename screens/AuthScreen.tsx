"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react-native"
import { useAuth } from "../context/AuthContext"

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleAuth = async () => {
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error)
        } else {
          navigation.navigate("Home")
        }
      } else {
        if (!fullName) {
          setError("Please enter your full name")
          setLoading(false)
          return
        }

        const { error } = await signUp(email, password, fullName)
        if (error) {
          setError(error)
        } else {
          navigation.navigate("Home")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6 py-12">
            {/* Logo and Title */}
            <View className="items-center mb-10">
              <Image source={{ uri: "/placeholder.svg?height=80&width=80" }} className="w-20 h-20 rounded-full mb-4" />
              <Text className="text-2xl font-bold text-gray-800">Welcome to ShopVerse</Text>
              <Text className="text-gray-500 text-center mt-2">
                {isLogin ? "Sign in to continue shopping" : "Create an account to get started"}
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {!isLogin && (
                <View className="space-y-2">
                  <Text className="text-gray-700 font-medium ml-1">Full Name</Text>
                  <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <User size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-2 text-gray-800 h-12"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                </View>
              )}

              <View className="space-y-2">
                <Text className="text-gray-700 font-medium ml-1">Email</Text>
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Mail size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-800 h-12"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="space-y-2">
                <Text className="text-gray-700 font-medium ml-1">Password</Text>
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Lock size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-800 h-12"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              {error && (
                <View className="bg-red-50 p-3 rounded-lg">
                  <Text className="text-red-500">{error}</Text>
                </View>
              )}

              {isLogin && (
                <TouchableOpacity className="self-end">
                  <Text className="text-indigo-600 font-medium">Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="bg-indigo-600 rounded-lg py-4 items-center flex-row justify-center mt-4"
                onPress={handleAuth}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg mr-2">{isLogin ? "Sign In" : "Create Account"}</Text>
                {loading ? (
                  <View className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <ArrowRight size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Toggle Login/Register */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}</Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text className="text-indigo-600 font-medium ml-1">{isLogin ? "Sign Up" : "Sign In"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
