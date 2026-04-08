"use client"

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
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const profileData = {
  name: "Priya Sharma",
  swasthyaId: "SWID-MH-2024-08521",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  location: "Pune, Maharashtra",
  dob: "15 Mar 1990",
  bloodType: "B+",
  gender: "Female",
  emergencyContact: "Raj Sharma (+91 98765 43211)",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
}

const menuItems = [
  { icon: User, label: "Personal Information", description: "Update your details" },
  { icon: HelpCircle, label: "Help & Support", description: "Get assistance" },
]

export function Profile() {
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
              <p className="text-[10px] text-primary-foreground/80">
                Government of India Health ID
              </p>
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

          {/* Card Footer */}
          <div className="bg-muted px-3 py-1.5 border-t border-border">
            <p className="text-[9px] text-muted-foreground text-center">
              Issued under National Digital Health Mission
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 text-xs shadow-sm">
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Download Swasthya Card
      </Button>

      {/* Contact Information */}
      <Card className="border bg-card shadow-sm">
        <CardContent className="p-3">
          <h3 className="text-xs font-semibold text-foreground mb-2.5">Contact Information</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Mail className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Email</p>
                <p className="text-xs font-medium text-foreground">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Phone className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Phone</p>
                <p className="text-xs font-medium text-foreground">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-xs font-medium text-foreground">{profileData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Calendar className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Date of Birth</p>
                <p className="text-xs font-medium text-foreground">{profileData.dob}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border border-secondary/30 bg-secondary/5 shadow-sm">
        <CardContent className="p-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-secondary/20">
              <Phone className="h-3.5 w-3.5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground">Emergency Contact</p>
              <p className="text-xs font-medium text-foreground">{profileData.emergencyContact}</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="border bg-card shadow-sm">
        <CardContent className="p-1.5">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="p-1.5 rounded-md bg-muted">
                <item.icon className="h-3.5 w-3.5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive text-xs py-2"
      >
        <LogOut className="h-3.5 w-3.5 mr-1.5" />
        Sign Out
      </Button>
    </div>
  )
}
