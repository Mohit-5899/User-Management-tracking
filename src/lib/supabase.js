// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lkymiqkjmemapbxrrrrt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreW1pcWtqbWVtYXBieHJycnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNTc5NjUsImV4cCI6MjA1NzYzMzk2NX0.bjbNsjysRVnlMaronPi13hTY5wFXTwagNfLxC0sMLDY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const signUp = async (email, password) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin
    }
  })
  return { error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  return { error }
}

export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { error }
}