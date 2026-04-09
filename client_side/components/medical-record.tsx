"use client"

import { useState } from "react"
import { Calendar, Building2, Stethoscope, X, FileText, Pill, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Consultation {
  id: number
  specialty: string
  date: string
  hospital: string
  diagnosis: string
  symptoms: string[]
  prescriptions: string[]
  notes: string
  followUp?: string
}

const consultationHistory: Consultation[] = [
  {
    id: 1,
    specialty: "General Physician",
    date: "28 Mar 2026",
    hospital: "Sassoon General Hospital, Pune",
    diagnosis: "Viral Fever with Upper Respiratory Tract Infection",
    symptoms: ["Fever (101°F)", "Sore throat", "Body ache", "Mild cough"],
    prescriptions: ["Paracetamol 500mg - 3 times daily", "Cetirizine 10mg - Once at night", "Vitamin C supplements"],
    notes: "Patient advised rest for 3 days. Increase fluid intake. Return if fever persists beyond 5 days.",
    followUp: "02 Apr 2026"
  },
  {
    id: 2,
    specialty: "Cardiologist",
    date: "15 Mar 2026",
    hospital: "Ruby Hall Clinic, Pune",
    diagnosis: "Routine Cardiac Check-up - Normal",
    symptoms: ["Routine check-up", "No complaints"],
    prescriptions: ["Continue existing medication", "Ecosprin 75mg - Once daily"],
    notes: "ECG normal. Blood pressure well controlled at 120/80. Continue healthy lifestyle.",
    followUp: "15 Sep 2026"
  },
  {
    id: 3,
    specialty: "Dermatologist",
    date: "02 Mar 2026",
    hospital: "Jehangir Hospital, Pune",
    diagnosis: "Allergic Contact Dermatitis",
    symptoms: ["Skin rash on forearms", "Itching", "Redness"],
    prescriptions: ["Hydrocortisone cream 1% - Apply twice daily", "Loratadine 10mg - Once daily"],
    notes: "Avoid contact with suspected allergen (new detergent). Use cotton clothing.",
  },
  {
    id: 4,
    specialty: "ENT Specialist",
    date: "18 Feb 2026",
    hospital: "Deenanath Mangeshkar Hospital",
    diagnosis: "Chronic Sinusitis",
    symptoms: ["Nasal congestion", "Facial pressure", "Post-nasal drip"],
    prescriptions: ["Nasivion nasal drops", "Steam inhalation twice daily", "Montelukast 10mg"],
    notes: "CT scan recommended if symptoms persist. Avoid cold beverages.",
    followUp: "18 Mar 2026"
  },
  {
    id: 5,
    specialty: "Orthopedic Surgeon",
    date: "05 Feb 2026",
    hospital: "Aditya Birla Memorial Hospital",
    diagnosis: "Mild Lumbar Strain",
    symptoms: ["Lower back pain", "Stiffness in morning"],
    prescriptions: ["Diclofenac gel - Apply locally", "Thiocolchicoside 4mg - Twice daily for 5 days"],
    notes: "Physiotherapy recommended. Avoid heavy lifting. Maintain proper posture.",
  },
  {
    id: 6,
    specialty: "General Physician",
    date: "22 Jan 2026",
    hospital: "KEM Hospital, Pune",
    diagnosis: "Annual Health Check-up",
    symptoms: ["Routine check-up"],
    prescriptions: ["Vitamin D3 60000 IU - Once weekly for 8 weeks", "Continue multivitamins"],
    notes: "All reports normal. Vitamin D slightly low. Increase sun exposure and dietary calcium.",
  },
]

export function MedicalRecord() {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

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
                <button
                  key={consultation.id}
                  onClick={() => setSelectedConsultation(consultation)}
                  className="relative flex gap-3 pb-4 last:pb-0 w-full text-left group"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      index === 0 
                        ? "bg-primary border-primary" 
                        : "bg-card border-border group-hover:border-primary/50"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        index === 0 ? "bg-primary-foreground" : "bg-muted-foreground"
                      }`} />
                    </div>
                  </div>

                  <div className={`flex-1 rounded-md border p-2.5 transition-all ${
                    index === 0 
                      ? "border-primary/30 bg-primary/5" 
                      : "border-border bg-card group-hover:border-primary/30 group-hover:bg-primary/5"
                  }`}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3 w-3 text-primary" />
                        <span className="font-semibold text-foreground text-xs">
                          {consultation.specialty}
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
                        <Calendar className="h-3 w-3" />
                        <span>{consultation.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{consultation.hospital}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Popup Modal */}
      {selectedConsultation && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
          onClick={() => setSelectedConsultation(null)}
        >
          <div 
            className="bg-card rounded-lg shadow-xl w-full max-w-md max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-primary text-primary-foreground">
              <div>
                <h3 className="font-semibold text-sm">{selectedConsultation.specialty}</h3>
                <p className="text-[11px] text-primary-foreground/80">{selectedConsultation.date}</p>
              </div>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="p-1.5 rounded-md hover:bg-primary-foreground/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 overflow-y-auto max-h-[calc(85vh-60px)] space-y-3">
              {/* Hospital */}
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Hospital</p>
                  <p className="text-xs text-foreground">{selectedConsultation.hospital}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Diagnosis</p>
                  <p className="text-xs text-foreground font-medium">{selectedConsultation.diagnosis}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="flex items-start gap-2">
                <ClipboardList className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Symptoms</p>
                  <ul className="mt-1 space-y-0.5">
                    {selectedConsultation.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-xs text-foreground flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prescriptions */}
              <div className="flex items-start gap-2">
                <Pill className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Prescriptions</p>
                  <ul className="mt-1 space-y-0.5">
                    {selectedConsultation.prescriptions.map((prescription, idx) => (
                      <li key={idx} className="text-xs text-foreground flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        {prescription}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-muted/50 rounded-md p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Doctor&apos;s Notes</p>
                <p className="text-xs text-foreground leading-relaxed">{selectedConsultation.notes}</p>
              </div>

              {/* Follow-up */}
              {selectedConsultation.followUp && (
                <div className="bg-primary/10 rounded-md p-2.5 border border-primary/20">
                  <p className="text-[10px] text-primary uppercase font-medium mb-1">Follow-up Scheduled</p>
                  <p className="text-xs text-foreground font-medium">{selectedConsultation.followUp}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border">
              <Button 
                onClick={() => setSelectedConsultation(null)}
                className="w-full h-8 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
