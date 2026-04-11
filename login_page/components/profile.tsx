"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { SwasthyaPDF } from "./swasthya-pdf"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HelpCircle,
  LogOut,
  ChevronRight,
  Download,
  QrCode,
  Droplets,
  X,
  MessageCircle,
  FileText,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resolveAssetUrl } from "@/lib/backend"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"

interface ProfileProps {
  onChangeLocation?: () => void
  onUpdate?: () => void
}

const fallbackProfileData = {
  name: "Priya Sharma",
  swasthyaId: "SWID-MH-2024-08521",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  location: "Pune, Maharashtra",
  dob: "15 Mar 1990",
  bloodType: "B+",
  gender: "Female",
  emergencyContact: {
    name: "",
    phone: "",
    relation: "",
  },
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
}

type ModalType = "info" | "help" | "emergency" | null

export function Profile({ onChangeLocation, onUpdate }: ProfileProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [storedUser, setStoredUser] = useState<any>(null)
  
  // State for Personal Info Form
  const [piName, setPiName] = useState("")
  const [piEmail, setPiEmail] = useState("")
  const [piPhone, setPiPhone] = useState("")
  const [piDob, setPiDob] = useState("")
  const [piBlood, setPiBlood] = useState("")
  const [piGender, setPiGender] = useState("")
  const [isSavingPi, setIsSavingPi] = useState(false)

  // State for Emergency Contact Form
  const [ecName, setEcName] = useState("")
  const [ecPhone, setEcPhone] = useState("")
  const [ecRelation, setEcRelation] = useState("")
  const [isSavingEc, setIsSavingEc] = useState(false)
  const [qrBase64, setQrBase64] = useState<string | null>(null)
  const qrRef = useRef<HTMLCanvasElement>(null)

  const profileData = useMemo(() => {
    if (!storedUser) return fallbackProfileData
    const resolved = resolveAssetUrl(storedUser.photo_url)
    return {
      ...fallbackProfileData,
      name: storedUser.full_name ?? storedUser.name ?? fallbackProfileData.name,
      email: storedUser.email ?? fallbackProfileData.email,
      phone: storedUser.mobile_number ? `+91 ${storedUser.mobile_number}` : (storedUser.phone ?? fallbackProfileData.phone),
      location: storedUser.location ?? fallbackProfileData.location,
      dob: storedUser.dob ?? fallbackProfileData.dob,
      bloodType: storedUser.blood_group ?? fallbackProfileData.bloodType,
      gender: storedUser.gender ?? fallbackProfileData.gender,
      avatar: resolved ?? fallbackProfileData.avatar,
      swasthyaId: storedUser.swasthya_id ?? fallbackProfileData.swasthyaId,
      emergencyContact: {
        name: storedUser.emergency_contact_name ?? "",
        phone: storedUser.emergency_contact ?? "",
        relation: storedUser.emergency_contact_relation ?? "",
      }
    }
  }, [storedUser])

  useEffect(() => {
    if (qrRef.current && profileData?.swasthyaId) {
      const timer = setTimeout(() => {
        setQrBase64(qrRef.current!.toDataURL())
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [profileData?.swasthyaId])

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const raw = sessionStorage.getItem("swasthya-user")
        if (raw) {
          let user = JSON.parse(raw)
          
          if (user.uid) {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            if (userDoc.exists()) {
              const freshData = userDoc.data()
              user = { ...user, ...freshData }
              sessionStorage.setItem("swasthya-user", JSON.stringify(user))
            }
          }
          
          setStoredUser(user)
          
          // initialize personal info state
          setPiName(user.full_name ?? user.name ?? "")
          setPiEmail(user.email ?? "")
          setPiPhone(user.mobile_number ?? user.phone ?? user.phone_number ?? "")
          setPiDob(user.dob ?? "")
          setPiBlood(user.blood_group ?? "")
          setPiGender(user.gender ?? "")
          
          // initialize emergency state
          setEcName(user.emergency_contact_name ?? user.emergency_contact?.name ?? fallbackProfileData.emergencyContact.name)
          setEcPhone(user.emergency_contact?.phone ?? user.emergency_contact ?? fallbackProfileData.emergencyContact.phone)
          setEcRelation(user.emergency_contact_relation ?? user.emergency_contact?.relation ?? fallbackProfileData.emergencyContact.relation)
        }
      } catch (err) {
        console.error("Error fetching fresh profile data", err)
        setStoredUser(null)
      }
    }
    
    fetchFreshData()
  }, [activeModal])

  const handleSavePersonalInfo = async () => {
    if (!storedUser?.uid) return
    setIsSavingPi(true)
    try {
      await updateDoc(doc(db, "users", storedUser.uid), {
        full_name: piName,
        email: piEmail,
        phone: piPhone,
        dob: piDob,
        blood_group: piBlood,
        gender: piGender,
      })
      const updatedUser = { ...storedUser, full_name: piName, email: piEmail, mobile_number: piPhone, phone: piPhone, dob: piDob, blood_group: piBlood, gender: piGender }
      sessionStorage.setItem("swasthya-user", JSON.stringify(updatedUser))
      setStoredUser(updatedUser)
      onUpdate?.()
      setActiveModal(null)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSavingPi(false)
    }
  }

  const handleSaveEmergencyContact = async () => {
    if (!storedUser?.uid) return
    setIsSavingEc(true)
    try {
      await updateDoc(doc(db, "users", storedUser.uid), {
        emergency_contact_name: ecName,
        emergency_contact: ecPhone,
        emergency_contact_relation: ecRelation,
      })
      const updatedUser = { ...storedUser, emergency_contact_name: ecName, emergency_contact: ecPhone, emergency_contact_relation: ecRelation }
      sessionStorage.setItem("swasthya-user", JSON.stringify(updatedUser))
      setStoredUser(updatedUser)
      onUpdate?.()
      setActiveModal(null)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSavingEc(false)
    }
  }

  // The handleDownloadCard is now handled by PDFDownloadLink
  const fileName = `${profileData.name.toLowerCase().replace(/\s+/g, "_")}_${profileData.swasthyaId.toLowerCase()}.pdf`

  return (
    <div className="space-y-3">
      {/* Swasthya Card */}
      <Card 
        className="border-2 shadow-md overflow-hidden" 
        style={{ borderColor: "#0F172A4D", backgroundColor: "#FFFFFF" }}
      >
        {/* Tricolor stripe */}
        <div className="h-1.5 flex">
          <div className="flex-1" style={{ backgroundColor: "#F97316" }} />
          <div className="flex-1" style={{ backgroundColor: "#FFFFFF" }} />
          <div className="flex-1" style={{ backgroundColor: "#10B981" }} />
        </div>
        
        <CardContent className="p-0">
          {/* Card Title */}
          <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#0F172A" }}>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide">
                SWASTHYA LINK
              </h2>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFFFFF33" }}>
              <span className="text-sm font-bold text-white">S</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3">
            <div className="flex gap-3">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-20 rounded border-2 overflow-hidden" style={{ borderColor: "#E2E8F0", backgroundColor: "#F1F5F9" }}>
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1.5">
                <div>
                  <p className="text-[9px] uppercase tracking-wide" style={{ color: "#64748B" }}>Name / नाम</p>
                  <p className="text-sm font-bold" style={{ color: "#0F172A" }}>{profileData.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide" style={{ color: "#64748B" }}>DOB</p>
                    <p className="text-xs font-semibold" style={{ color: "#0F172A" }}>{profileData.dob}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wide" style={{ color: "#64748B" }}>Gender</p>
                    <p className="text-xs font-semibold" style={{ color: "#0F172A" }}>
                    {profileData.gender?.toLowerCase() === "male" ? "M" : 
                     profileData.gender?.toLowerCase() === "female" ? "F" : 
                     profileData.gender?.toLowerCase() === "other" ? "O" : 
                     profileData.gender || "-"}
                  </p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide flex items-center gap-0.5" style={{ color: "#64748B" }}>
                    <Droplets className="h-2.5 w-2.5" style={{ color: "#B91C1C" }} />
                    Blood Group
                  </p>
                  <p className="text-xs font-bold" style={{ color: "#B91C1C" }}>{profileData.bloodType}</p>
                </div>
              </div>
            </div>

            {/* ID and QR */}
            <div className="mt-3 pt-2.5 flex items-center justify-between" style={{ borderTop: "1px solid #E2E8F0" }}>
              <div>
                <p className="text-[9px] uppercase tracking-wide" style={{ color: "#64748B" }}>Swasthya ID</p>
                <p className="text-xs font-mono font-bold tracking-wider" style={{ color: "#0F172A" }}>
                  {profileData.swasthyaId}
                </p>
              </div>
              <div className="w-32 h-32 rounded border bg-white p-2 flex items-center justify-center" style={{ borderColor: "#E2E8F0" }}>
                <QRCodeCanvas 
                  ref={qrRef}
                  value={profileData.swasthyaId}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Button - React PDF */}
      <PDFDownloadLink
        document={<SwasthyaPDF data={{ ...profileData, qrCodeBase64: qrBase64 || undefined }} />}
        fileName={fileName}
        className="w-full"
      >
        {({ loading }) => (
          <Button 
            disabled={loading || !qrBase64}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 text-xs shadow-sm"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {loading ? "Preparing PDF..." : "Download Swasthya Card"}
          </Button>
        )}
      </PDFDownloadLink>

      {/* Action Buttons */}
      <Card className="border bg-card shadow-sm">
        <CardContent className="p-1.5">
          {/* Personal Information */}
          <button 
            onClick={() => setActiveModal("info")}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-md bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium text-foreground">Personal Information</p>
              <p className="text-[10px] text-muted-foreground">Update your details</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Change Location - Opens Modal */}
          <button 
            onClick={onChangeLocation}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-md bg-accent/20">
              <MapPin className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium text-foreground">Change Location</p>
              <p className="text-[10px] text-muted-foreground">Update your current area</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Help & Support */}
          <button 
            onClick={() => setActiveModal("help")}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-md bg-secondary/20">
              <HelpCircle className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium text-foreground">Help & Support</p>
              <p className="text-[10px] text-muted-foreground">Get assistance</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <button 
        onClick={() => setActiveModal("emergency")}
        className="w-full"
      >
        <Card className="border border-secondary/30 bg-secondary/5 shadow-sm hover:bg-secondary/10 transition-colors">
          <CardContent className="p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-secondary/20">
                <Phone className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] text-muted-foreground">Emergency Contact</p>
                <p className="text-xs font-medium text-foreground">
                  {profileData.emergencyContact.name ? `${profileData.emergencyContact.name} (${profileData.emergencyContact.relation || 'Contact'})` : 'Add Emergency Contact'}
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </button>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive text-xs py-2"
        onClick={() => {
          sessionStorage.clear()
          window.location.href = "/"
        }}
      >
        <LogOut className="h-3.5 w-3.5 mr-1.5" />
        Sign Out
      </Button>

      {/* Personal Information Modal */}
      {activeModal === "info" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-sm max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-border sticky top-0 bg-card">
              <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                disabled={isSavingPi}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Full Name</label>
                <Input value={piName} onChange={e => setPiName(e.target.value)} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Email</label>
                <Input value={piEmail} onChange={e => setPiEmail(e.target.value)} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Phone</label>
                <Input value={piPhone} onChange={e => setPiPhone(e.target.value)} className="mt-1 text-xs h-9" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Date of Birth</label>
                  <Input value={piDob} onChange={e => setPiDob(e.target.value)} className="mt-1 text-xs h-9" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Blood Group</label>
                  <Input value={piBlood} onChange={e => setPiBlood(e.target.value)} className="mt-1 text-xs h-9" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Gender</label>
                <select 
                  value={piGender} 
                  onChange={e => setPiGender(e.target.value)} 
                  className="w-full mt-1 px-3 h-9 border border-input rounded-md bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button 
                onClick={handleSavePersonalInfo}
                disabled={isSavingPi}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 mt-2"
              >
                {isSavingPi ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {activeModal === "help" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Help & Support</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="p-2 rounded-md bg-primary/10">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Chat with Support</p>
                  <p className="text-[10px] text-muted-foreground">Get instant help from our team</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="p-2 rounded-md bg-secondary/20">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Call Helpline</p>
                  <p className="text-[10px] text-muted-foreground">1800-XXX-XXXX (Toll Free)</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="p-2 rounded-md bg-accent/20">
                  <Mail className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Email Support</p>
                  <p className="text-[10px] text-muted-foreground">support@swasthyalink.gov.in</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="p-2 rounded-md bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">FAQs</p>
                  <p className="text-[10px] text-muted-foreground">Browse common questions</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact Modal */}
      {activeModal === "emergency" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Emergency Contact</h3>
              <button
                onClick={() => setActiveModal(null)}
                disabled={isSavingEc}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-foreground">
                  This contact will be notified in case of medical emergencies detected by the app.
                </p>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Contact Name</label>
                <Input value={ecName} onChange={e => setEcName(e.target.value)} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Phone Number</label>
                <Input value={ecPhone} onChange={e => setEcPhone(e.target.value)} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Relationship</label>
                <Input value={ecRelation} onChange={e => setEcRelation(e.target.value)} placeholder="Eg: Father" className="mt-1 text-xs h-9" />
              </div>
              <Button 
                onClick={handleSaveEmergencyContact}
                disabled={isSavingEc}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 mt-2"
              >
                {isSavingEc ? "Saving..." : "Save Contact"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
