import { TouchableOpacity, Text, View } from "react-native"

export default function CategoryItem({ category }) {
  return (
    <TouchableOpacity className="items-center mr-4 w-16">
      <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mb-1">
        <Text className="text-2xl">{category.icon}</Text>
      </View>
      <Text className="text-gray-700 text-xs text-center" numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  )
}
