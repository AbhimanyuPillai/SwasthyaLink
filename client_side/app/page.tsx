"use client"

import { useState } from "react"
import { Activity, Bell, FileText, MessageSquare, Newspaper, User, Menu, X } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { MedicalRecord } from "@/components/medical-record"
import { AskAgent } from "@/components/ask-agent"
import { LocalNews } from "@/components/local-news"
import { Profile } from "@/components/profile"
import { cn } from "@/lib/utils"

type Tab = "records" | "agent" | "news" | "profile"

const tabTitles: Record<Tab, string> = {
  records: "Medical Records",
  agent: "Swasthya Mitra",
  news: "Local News",
  profile: "Profile",
}

const sidebarItems: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "records", label: "Medical Records", icon: FileText },
  { id: "agent", label: "Swasthya Mitra", icon: MessageSquare },
  { id: "news", label: "Local News", icon: Newspaper },
  { id: "profile", label: "Profile", icon: User },
]

export default function SwasthyaLinkDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("records")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "records":
        return <MedicalRecord />
      case "agent":
        return <AskAgent />
      case "news":
        return <LocalNews />
      case "profile":
        return <Profile />
      default:
        return <MedicalRecord />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
              <Activity className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Swasthya Link</h1>
              <p className="text-[10px] text-sidebar-foreground/70">Health Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-all",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"
              alt="User avatar"
              className="w-7 h-7 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Priya Sharma</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">SWID-MH-2024-08521</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
              <Activity className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Swasthya Link</h1>
              <p className="text-[10px] text-sidebar-foreground/70">Health Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-all",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-56">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between px-3 py-2.5 max-w-3xl mx-auto lg:px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 lg:hidden">
                <div className="w-7 h-7 rounded-md bg-primary-foreground/20 flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight">Swasthya Link</h1>
                  <p className="text-[10px] text-primary-foreground/80">Government Health Portal</p>
                </div>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-base font-semibold">{tabTitles[activeTab]}</h1>
              </div>
            </div>
            <button className="relative p-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
            </button>
          </div>

          {activeTab !== "agent" && (
            <div className="px-3 pb-2 max-w-3xl mx-auto lg:hidden">
              <h2 className="text-base font-semibold">{tabTitles[activeTab]}</h2>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main
          className={cn(
            "max-w-3xl mx-auto",
            activeTab === "agent" 
              ? "h-[calc(100vh-56px-52px)] lg:h-[calc(100vh-48px)]" 
              : "px-3 pt-4 pb-16 lg:px-4 lg:pb-6"
          )}
        >
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
