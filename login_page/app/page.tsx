"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth"
import {
  IdCard,
  Smartphone,
  QrCode,
  User,
  Calendar,
  Droplets,
  Mail,
  Phone,
  AlertCircle,
  Ruler,
  Scale,
  CheckCircle2,
  Download,
  ArrowRight,
  Shield,
  Heart,
} from "lucide-react"
import { useRouter } from "next/navigation" 
// (Make sure it's next/navigation, NOT next/router!)

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

type AuthMode = "login" | "register"
type LoginMethod = "swasthya-id" | "mobile" | "qr"
type AuthState = "initial" | "otp" | "success"

interface FormData {
  fullName: string
  dob: string
  gender: string
  bloodGroup: string
  email: string
  mobile: string
  emergencyContact: string
  height: string
  weight: string
  healthConcerns: string[]
}

const healthConcernOptions = [
  "Diabetes",
  "Hypertension (BP)",
  "Migraine",
  "Asthma",
  "Thyroid",
  "None",
]

export default function AuthPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("swasthya-id")
  const [authState, setAuthState] = useState<AuthState>("initial")
  const [loginInput, setLoginInput] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""]) 
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    fullName: "", dob: "", gender: "", bloodGroup: "", email: "",
    mobile: "", emergencyContact: "", height: "", weight: "", healthConcerns: [],
  })

  const otpRefs = [
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
  ]

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) {
        otpRefs[index + 1].current?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  const handleHealthConcernToggle = (concern: string) => {
    if (concern === "None") {
      setFormData((prev) => ({
        ...prev,
        healthConcerns: prev.healthConcerns.includes("None") ? [] : ["None"],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        healthConcerns: prev.healthConcerns.includes(concern)
          ? prev.healthConcerns.filter((c) => c !== concern)
          : [...prev.healthConcerns.filter((c) => c !== "None"), concern],
      }))
    }
  }

  const resetToInitial = () => {
    setAuthState("initial")
    setOtp(["", "", "", "", "", ""]) 
    setLoginInput("")
    setConfirmationResult(null)
  }

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode)
    resetToInitial()
  }

  useEffect(() => {
    if (authState === "otp") {
      otpRefs[0].current?.focus()
    }
  }, [authState])

  // --- FIREBASE LOGIC ---
  const handleSendOtp = async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 10) return alert("Please enter a valid mobile number")
    
    setIsLoading(true)
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined as any
      }
      
      const container = document.getElementById("recaptcha-container")
      if (container) container.innerHTML = ""

      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" })
      const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '').slice(-10)}`
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier)
      setConfirmationResult(confirmation)
      setAuthState("otp")
      
    } catch (error) {
      console.error("SMS Error:", error)
      alert("Failed to send OTP. Check console.")
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined as any
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpString = otp.join("")
    if (otpString.length !== 6 || !confirmationResult) return
    
    setIsLoading(true)
    try {
      await confirmationResult.confirm(otpString)
      
      if (authMode === "register") {
        setAuthState("success")
      } else {
        alert("Login successful! Redirecting to dashboard...")
        router.push("/dashboard")
      }
    } catch (error) {
      alert("Incorrect OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Blurred Healthcare Background with Logo */}
      <div className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-12 min-h-[200px] lg:min-h-screen overflow-hidden">
        {/* Background image with blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/healthcare-bg.jpg")`,
            filter: "blur(6px)",
            transform: "scale(1.1)",
          }}
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-navy/70" />
        
        <div className="relative z-10 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            {/* Logo image */}
            <div className="w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-2xl flex items-center justify-center shadow-lg p-3">
              <img 
                src="/swasthyalink-logo.png" 
                alt="Swasthya Link Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Swasthya Link</h1>
              {/* Saffron accent line */}
              <div className="w-16 h-1 bg-saffron mx-auto mt-3 mb-3 rounded-full" />
              <p className="text-sm lg:text-base text-white/80 tracking-wide">Your Digital Health Companion</p>
            </div>
          </div>
          
          {/* Additional decorative elements for desktop */}
          <div className="hidden lg:block mt-12 space-y-4 text-white/70 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Your Health, Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - White with Auth Card */}
      <div className="lg:w-1/2 bg-background flex items-center justify-center p-4 lg:p-8 flex-1">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden relative">
            
            {/* FIREBASE RECAPTCHA */}
            <div id="recaptcha-container"></div>

            {authState === "success" ? (
              <SuccessScreen formData={formData} onProceed={() => switchAuthMode("login")} />
            ) : (
              <>
                <div className="flex border-b border-border">
                  <button
                    type="button"
                    onClick={() => switchAuthMode("login")}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                      authMode === "login" ? "text-primary border-b-2 border-primary bg-muted/30" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => switchAuthMode("register")}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                      authMode === "register" ? "text-primary border-b-2 border-primary bg-muted/30" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Register
                  </button>
                </div>

                <div className="p-6">
                  {authState === "otp" ? (
                    <OtpVerification
                      otp={otp}
                      otpRefs={otpRefs}
                      onOtpChange={handleOtpChange}
                      onOtpKeyDown={handleOtpKeyDown}
                      onVerify={handleVerifyOtp}
                      onBack={resetToInitial}
                      isRegistration={authMode === "register"}
                      isLoading={isLoading}
                    />
                  ) : authMode === "login" ? (
                    <LoginForm
                      loginMethod={loginMethod}
                      setLoginMethod={setLoginMethod}
                      loginInput={loginInput}
                      setLoginInput={setLoginInput}
                      onGetOtp={() => handleSendOtp(loginInput)}
                      isLoading={isLoading}
                    />
                  ) : (
                    <RegisterForm
                      formData={formData}
                      setFormData={setFormData}
                      healthConcernOptions={healthConcernOptions}
                      onHealthConcernToggle={handleHealthConcernToggle}
                      onSendOtp={() => handleSendOtp(formData.mobile)}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>Your data is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function LoginForm({ loginMethod, setLoginMethod, loginInput, setLoginInput, onGetOtp, isLoading }: any) {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraOpen(false)
  }

  const handleScanQrClick = async () => {
    if (isCameraOpen) {
      stopCamera()
      return
    }

    setCameraError("")
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported on this browser.")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })

      streamRef.current = stream
      setIsCameraOpen(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (error) {
      setCameraError("Unable to access camera. Please allow camera permission and try again.")
      console.error("Camera error:", error)
      stopCamera()
    }
  }

  useEffect(() => {
    if (loginMethod !== "qr") {
      stopCamera()
      setCameraError("")
    }
  }, [loginMethod])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[
          { id: "swasthya-id", icon: IdCard, label: "Swasthya ID" },
          { id: "mobile", icon: Smartphone, label: "Mobile" },
          { id: "qr", icon: QrCode, label: "Scan QR" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setLoginMethod(id as LoginMethod)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border transition-all ${
              loginMethod === id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {loginMethod === "qr" ? (
        <div className="space-y-4">
          <div className="aspect-square max-w-[200px] mx-auto border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-muted/20">
            {isCameraOpen ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full rounded-lg object-cover" />
            ) : (
              <div className="text-center p-4">
                <div className="relative">
                  <div className="w-32 h-32 relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleScanQrClick}
            className="w-full py-3 bg-saffron text-saffron-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" /> {isCameraOpen ? "Stop Scan" : "Tap to Scan"}
          </button>
          {cameraError && <p className="text-xs text-destructive text-center">{cameraError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {loginMethod === "swasthya-id" ? "Enter your Swasthya ID" : "Enter your Mobile Number"}
            </label>
            <div className="relative">
              <input
                type={loginMethod === "mobile" ? "tel" : "text"}
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder={loginMethod === "swasthya-id" ? "XX-XXXX-XXXX-XXXX" : "+91 XXXXX XXXXX"}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              />
              {loginMethod === "mobile" ? (
                <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              ) : (
                <IdCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onGetOtp}
            disabled={!loginInput || isLoading}
            className="w-full py-3 bg-success text-success-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Sending..." : "Get OTP"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  )
}

// Helper function to calculate age from DOB
function calculateAge(dob: string): number | null {
  if (!dob) return null
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= 0 ? age : null
}

function RegisterForm({ formData, setFormData, healthConcernOptions, onHealthConcernToggle, onSendOtp, isLoading }: any) {
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  // Auto-calculate age from DOB
  const calculatedAge = useMemo(() => calculateAge(formData.dob), [formData.dob])

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <User className="w-4 h-4" /> Personal Information
        </div>
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
            <input type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Enter your full name" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5"><Calendar className="w-3 h-3 inline mr-1" />Date of Birth</label>
            <input type="date" value={formData.dob} onChange={(e) => updateField("dob", e.target.value)} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
            {calculatedAge !== null && (
              <p className="text-xs text-muted-foreground mt-1.5">Age: {calculatedAge} years</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gender</label>
              <select value={formData.gender} onChange={(e) => updateField("gender", e.target.value)} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5"><Droplets className="w-3 h-3 inline mr-1" />Blood Group</label>
              <select value={formData.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm">
                <option value="">Select</option>
                <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Phone className="w-4 h-4" /> Contact Information
        </div>
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5"><Mail className="w-3 h-3 inline mr-1" />Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="your@email.com" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Mobile Number</label>
            <input type="tel" value={formData.mobile} onChange={(e) => updateField("mobile", e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5"><AlertCircle className="w-3 h-3 inline mr-1" />Emergency Contact Number</label>
            <input type="tel" value={formData.emergencyContact} onChange={(e) => updateField("emergencyContact", e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Heart className="w-4 h-4" /> Health & Vitals
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5"><Ruler className="w-3 h-3 inline mr-1" />Height (cm)</label>
              <input type="number" value={formData.height} onChange={(e) => updateField("height", e.target.value)} placeholder="170" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5"><Scale className="w-3 h-3 inline mr-1" />Weight (kg)</label>
              <input type="number" value={formData.weight} onChange={(e) => updateField("weight", e.target.value)} placeholder="65" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Major Health Concerns</label>
            <div className="grid grid-cols-2 gap-2">
              {healthConcernOptions.map((concern: string) => (
                <div
                  key={concern}
                  role="checkbox"
                  aria-checked={formData.healthConcerns.includes(concern)}
                  tabIndex={0}
                  onClick={() => onHealthConcernToggle(concern)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onHealthConcernToggle(concern)
                    }
                  }}
                  className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all text-sm select-none ${formData.healthConcerns.includes(concern) ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/50"}`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${formData.healthConcerns.includes(concern) ? "bg-primary border-primary" : "border-input"}`}>
                    {formData.healthConcerns.includes(concern) && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-xs">{concern}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSendOtp}
        disabled={!formData.fullName || !formData.mobile || isLoading}
        className="w-full py-3 bg-success text-success-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? "Sending..." : "Send OTP"}
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

function OtpVerification({ otp, otpRefs, onOtpChange, onOtpKeyDown, onVerify, onBack, isRegistration, isLoading }: any) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">OTP Verification</h3>
        <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your mobile</p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit: string, index: number) => (
          <input
            key={index}
            ref={otpRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onOtpChange(index, e.target.value)}
            onKeyDown={(e) => onOtpKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
          />
        ))}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onVerify}
          disabled={otp.some((d: string) => !d) || isLoading}
          className="w-full py-3 bg-success text-success-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? "Verifying..." : (isRegistration ? "Verify & Register" : "Verify & Login")}
          {!isLoading && <CheckCircle2 className="w-4 h-4" />}
        </button>
        <button type="button" onClick={onBack} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}

function SuccessScreen({ formData, onProceed }: any) {
  const swasthyaId = "SL-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase()
  const calculatedAge = calculateAge(formData.dob)

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">Account Created Successfully</h3>
        <p className="text-sm text-muted-foreground">Your Swasthya ID has been generated</p>
      </div>

      <div className="bg-gradient-to-br from-primary via-primary to-primary/90 rounded-xl p-4 text-primary-foreground shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-80">Government of India</p>
              <p className="text-sm font-bold">Swasthya Card</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] opacity-70">Swasthya ID</p>
            <p className="text-xs font-mono font-semibold">{swasthyaId}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-20 h-24 bg-primary-foreground/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 opacity-50" />
          </div>
          <div className="flex-1 space-y-1.5 text-xs">
            <div>
              <p className="opacity-70 text-[10px]">Name</p>
              <p className="font-semibold truncate">{formData.fullName || "John Doe"}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="opacity-70 text-[10px]">DOB</p>
                <p className="font-medium">{formData.dob || "01/01/1990"}</p>
              </div>
              <div>
                <p className="opacity-70 text-[10px]">Age</p>
                <p className="font-medium">{calculatedAge !== null ? `${calculatedAge}y` : "-"}</p>
              </div>
              <div>
                <p className="opacity-70 text-[10px]">Gender</p>
                <p className="font-medium capitalize">{formData.gender || "Male"}</p>
              </div>
              <div>
                <p className="opacity-70 text-[10px]">Blood</p>
                <p className="font-medium">{formData.bloodGroup || "O+"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-end">
          <div className="text-[10px] opacity-70">
            <p>Emergency: {formData.emergencyContact || "+91 XXXXX XXXXX"}</p>
          </div>
          <div className="w-14 h-14 bg-primary-foreground rounded-md flex items-center justify-center">
            <QrCode className="w-10 h-10 text-primary" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button type="button" className="w-full py-3 bg-saffron text-saffron-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download Official Card
        </button>
        <button type="button" onClick={onProceed} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          Proceed to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
