"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { ShieldCheck, Stethoscope, Lock, Mail } from "lucide-react"
import Image from "next/image"

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Invalid credentials. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-primary-foreground rounded-full" />
          <div className="absolute bottom-32 right-10 w-96 h-96 border-2 border-primary-foreground rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border-2 border-primary-foreground rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Swasthya Sarathi Logo"
              width={180}
              height={80}
              className="brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground text-center mb-4">
            Swasthya Sarathi
          </h1>
          <p className="text-xl text-primary-foreground/80 text-center max-w-md">
            Your trusted digital companion for seamless healthcare management
          </p>
          
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-foreground">500+</div>
              <div className="text-sm text-primary-foreground/70">Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">1M+</div>
              <div className="text-sm text-primary-foreground/70">Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">10K+</div>
              <div className="text-sm text-primary-foreground/70">Doctors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-primary px-6 py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Swasthya Sarathi Logo"
              width={48}
              height={48}
              className="brightness-0 invert"
            />
            <div>
              <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
                Swasthya Sarathi
              </h1>
              <p className="text-xs text-primary-foreground/70">Healthcare Management</p>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md shadow-xl border-0 lg:border lg:border-border/50">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 shadow-inner">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground">
                Doctor Portal
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Sign in to access patient records
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 lg:px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldGroup className="gap-5">
                  <Field>
                    <FieldLabel htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 pl-12 text-base bg-muted/30 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password" className="text-sm font-medium">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-14 pl-12 text-base bg-muted/30 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                  </Field>
                </FieldGroup>

                {error && (
                  <p className="text-sm text-destructive text-center bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="mr-2 w-5 h-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-center text-sm text-muted-foreground">
                  Protected healthcare portal for authorized medical professionals
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border/50">
          <span className="font-medium">Swasthya Sarathi</span> - Secure Healthcare Management
        </footer>
      </div>
    </div>
  )
}
