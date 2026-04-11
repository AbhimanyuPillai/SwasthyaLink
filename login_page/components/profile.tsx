"use client"

import { useEffect, useMemo, useState } from "react"
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

interface ProfileProps {
  onChangeLocation?: () => void
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
    name: "Raj Sharma",
    phone: "+91 98765 43211",
    relation: "Spouse",
  },
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
}

type ModalType = "info" | "help" | "emergency" | null

export function Profile({ onChangeLocation }: ProfileProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [storedUser, setStoredUser] = useState<any>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("swasthya-user")
      setStoredUser(raw ? JSON.parse(raw) : null)
    } catch {
      setStoredUser(null)
    }
  }, [])

  const profileData = useMemo(() => {
    if (!storedUser) return fallbackProfileData
    const resolved = resolveAssetUrl(storedUser.photo_url)
    return {
      ...fallbackProfileData,
      name: storedUser.full_name ?? storedUser.name ?? fallbackProfileData.name,
      phone: storedUser.mobile_number ? `+91 ${storedUser.mobile_number}` : fallbackProfileData.phone,
      location: storedUser.location ?? fallbackProfileData.location,
      avatar: resolved ?? fallbackProfileData.avatar,
    }
  }, [storedUser])

  return (
    <div className="space-y-3">
      {/* Swasthya Card */}
      <Card className="border-2 border-primary/30 bg-card shadow-md overflow-hidden">
        {/* Tricolor stripe */}
        <div className="h-1.5 flex">
          <div className="flex-1 bg-accent" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-secondary" />
        </div>
        
        <CardContent className="p-0">
          {/* Card Title */}
          <div className="bg-primary px-3 py-2 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-primary-foreground tracking-wide">
                SWASTHYA LINK
              </h2>
            </div>
            <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3">
            <div className="flex gap-3">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-20 rounded border-2 border-border overflow-hidden bg-muted">
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
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Name / नाम</p>
                  <p className="text-sm font-bold text-foreground">{profileData.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">DOB</p>
                    <p className="text-xs font-semibold text-foreground">{profileData.dob}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Gender</p>
                    <p className="text-xs font-semibold text-foreground">{profileData.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide flex items-center gap-0.5">
                    <Droplets className="h-2.5 w-2.5" />
                    Blood Group
                  </p>
                  <p className="text-xs font-bold text-destructive">{profileData.bloodType}</p>
                </div>
              </div>
            </div>

            {/* ID and QR */}
            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Swasthya ID</p>
                <p className="text-xs font-mono font-bold text-primary tracking-wider">
                  {profileData.swasthyaId}
                </p>
              </div>
              <div className="w-12 h-12 rounded border border-border bg-white p-0.5 flex items-center justify-center">
                <QrCode className="w-full h-full text-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 text-xs shadow-sm">
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Download Swasthya Card
      </Button>

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
                  {profileData.emergencyContact.name} ({profileData.emergencyContact.relation})
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
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Full Name</label>
                <Input defaultValue={profileData.name} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Email</label>
                <Input defaultValue={profileData.email} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Phone</label>
                <Input defaultValue={profileData.phone} className="mt-1 text-xs h-9" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Date of Birth</label>
                  <Input defaultValue={profileData.dob} className="mt-1 text-xs h-9" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Blood Group</label>
                  <Input defaultValue={profileData.bloodType} className="mt-1 text-xs h-9" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Gender</label>
                <Input defaultValue={profileData.gender} className="mt-1 text-xs h-9" />
              </div>
              <Button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 mt-2"
              >
                Save Changes
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
                <Input defaultValue={profileData.emergencyContact.name} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Phone Number</label>
                <Input defaultValue={profileData.emergencyContact.phone} className="mt-1 text-xs h-9" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Relationship</label>
                <Input defaultValue={profileData.emergencyContact.relation} className="mt-1 text-xs h-9" />
              </div>
              <Button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 mt-2"
              >
                Save Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
