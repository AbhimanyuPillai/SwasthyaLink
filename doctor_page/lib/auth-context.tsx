"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface HospitalProfile {
  id: string
  name: string
  address: string
  phone: string
  email: string
  doctorName: string
  specialization: string
  registrationNumber: string
}

interface AuthContextType {
  isAuthenticated: boolean
  hospital: HospitalProfile | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock hospital data
const mockHospital: HospitalProfile = {
  id: "hosp-001",
  name: "City General Hospital",
  address: "123 Healthcare Avenue, Medical District, Mumbai - 400001",
  phone: "+91 22 1234 5678",
  email: "admin@citygeneralhospital.com",
  doctorName: "Dr. Rajesh Kumar",
  specialization: "General Medicine",
  registrationNumber: "MCI-2024-78542",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hospital, setHospital] = useState<HospitalProfile | null>(null)

  useEffect(() => {
    // Check if user was previously logged in
    const stored = localStorage.getItem("swasthya-auth")
    if (stored === "true") {
      setIsAuthenticated(true)
      setHospital(mockHospital)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 6) {
      setIsAuthenticated(true)
      setHospital(mockHospital)
      localStorage.setItem("swasthya-auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setHospital(null)
    localStorage.removeItem("swasthya-auth")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, hospital, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
