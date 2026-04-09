"use client"

import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function LocationModal({ isOpen, onClose, onSave }: LocationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-sm mx-auto bg-card rounded-lg shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <h2 className="text-sm font-semibold text-foreground">Confirm Your Location</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="relative h-48 bg-muted/50 overflow-hidden">
          {/* Grid lines to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          {/* Simulated map streets */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-3/4 h-px bg-foreground" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-px h-3/4 bg-foreground" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-foreground/20 rotate-45" />
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-px bg-foreground/20 -rotate-45" />
          
          {/* Center Pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Pin shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-foreground/20 rounded-full blur-sm" />
              {/* Pin icon */}
              <div className="relative -mt-4 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary -mt-1" />
              </div>
            </div>
          </div>

          {/* Zoom controls simulation */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <div className="w-6 h-6 rounded bg-card border border-border flex items-center justify-center text-xs font-medium text-muted-foreground">+</div>
            <div className="w-6 h-6 rounded bg-card border border-border flex items-center justify-center text-xs font-medium text-muted-foreground">-</div>
          </div>
        </div>

        {/* Location Display */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Current Pin</p>
              <p className="text-xs font-medium text-foreground">Shivajinagar, Pune</p>
              <p className="text-[10px] text-muted-foreground">Maharashtra, India - 411005</p>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            onClick={onSave}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-xs py-2.5"
          >
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            Save Location
          </Button>
        </div>
      </div>
    </div>
  )
}
