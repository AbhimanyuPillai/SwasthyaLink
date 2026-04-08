"use client"

import { Calendar, User, Building2, Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const consultationHistory = [
  {
    id: 1,
    doctorName: "Dr. Rajesh Kulkarni",
    specialty: "General Physician",
    date: "28 Mar 2026",
    hospital: "Sassoon General Hospital, Pune",
  },
  {
    id: 2,
    doctorName: "Dr. Anjali Deshmukh",
    specialty: "Cardiologist",
    date: "15 Mar 2026",
    hospital: "Ruby Hall Clinic, Pune",
  },
  {
    id: 3,
    doctorName: "Dr. Sunil Patil",
    specialty: "Dermatologist",
    date: "02 Mar 2026",
    hospital: "Jehangir Hospital, Pune",
  },
  {
    id: 4,
    doctorName: "Dr. Meera Joshi",
    specialty: "ENT Specialist",
    date: "18 Feb 2026",
    hospital: "Deenanath Mangeshkar Hospital",
  },
  {
    id: 5,
    doctorName: "Dr. Vikram Sharma",
    specialty: "Orthopedic Surgeon",
    date: "05 Feb 2026",
    hospital: "Aditya Birla Memorial Hospital",
  },
  {
    id: 6,
    doctorName: "Dr. Priya Nair",
    specialty: "General Physician",
    date: "22 Jan 2026",
    hospital: "KEM Hospital, Pune",
  },
]

export function MedicalRecord() {
  return (
    <div className="space-y-4">
      <Card className="border bg-card shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-primary" />
            Consultation History
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

            <div className="space-y-0">
              {consultationHistory.map((consultation, index) => (
                <div key={consultation.id} className="relative flex gap-3 pb-4 last:pb-0">
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      index === 0 
                        ? "bg-primary border-primary" 
                        : "bg-card border-border"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        index === 0 ? "bg-primary-foreground" : "bg-muted-foreground"
                      }`} />
                    </div>
                  </div>

                  <div className={`flex-1 rounded-md border p-2.5 ${
                    index === 0 
                      ? "border-primary/30 bg-primary/5" 
                      : "border-border bg-card"
                  }`}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-primary" />
                        <span className="font-semibold text-foreground text-xs">
                          {consultation.doctorName}
                        </span>
                      </div>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">
                          Latest
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Stethoscope className="h-3 w-3" />
                        <span>{consultation.specialty}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{consultation.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{consultation.hospital}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
