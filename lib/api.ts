import { supabase } from "./supabase"

// Types
export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  stock?: number
  description?: string
}

export type Category = {
  id: string
  name: string
  icon: string
  slug: string
}

export type CartItem = {
  id: string
  product_id: string
  user_id: string
  quantity: number
  product?: Product
}

export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

// API functions
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Transform the data to match our Category type
  return data.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: getCategoryIcon(category.name), // Helper function to assign icons
  }))
}

// Helper function to assign icons based on category name
function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    Electronics: "📱",
    Fashion: "👕",
    Home: "🏠",
    Beauty: "💄",
    Sports: "⚽",
    Books: "📚",
    Toys: "🧸",
    Groceries: "🛒",
  }

  return iconMap[categoryName] || "📦"
}

// Get featured products (using articles table as a temporary solution)
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("articles").select("*").eq("featured", true).limit(6)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  // Transform articles to products (temporary solution)
  return data.map((article) => ({
    id: article.id,
    name: article.title,
    price: generateRandomPrice(),
    originalPrice: generateRandomPrice(true),
    image: article.image_url || "/placeholder.svg?height=200&width=200",
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
    stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10 and 60
    description: article.excerpt || "",
  }))
}

// Helper function to generate random prices
function generateRandomPrice(higher = false): number {
  const base = higher ? 100 : 50
  return Number.parseFloat((Math.random() * base + 20).toFixed(2))
}

// Get user's cart
export async function getUserCart(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user cart:", error)
    return []
  }

  return data
}

// Add item to cart
export async function addToCart(userId: string, productId: string, quantity = 1): Promise<boolean> {
  // Check if item already exists in cart
  const { data: existingItems } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (existingItems) {
    // Update quantity if item exists
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItems.quantity + quantity })
      .eq("id", existingItems.id)

    return !error
  } else {
    // Insert new item if it doesn't exist
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity,
    })

    return !error
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string): Promise<boolean> {
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

  return !error
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
  const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId)

  return !error
}

// Authentication functions
export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { user: null, error: error.message }
  }

  return {
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata.full_name,
          avatar_url: data.user.user_metadata.avatar_url,
        }
      : null,
    error: null,
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }

  return {
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata.full_name,
          avatar_url: data.user.user_metadata.avatar_url,
        }
      : null,
    error: null,
  }
}

export async function signOut(): Promise<boolean> {
  const { error } = await supabase.auth.signOut()
  return !error
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()

  if (!data.user) return null

  return {
    id: data.user.id,
    email: data.user.email || "",
    full_name: data.user.user_metadata.full_name,
    avatar_url: data.user.user_metadata.avatar_url,
  }
}
