"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ContentCard } from "@/components/dashboard/content-card"
import { MetricCard } from "@/components/dashboard/metric-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Map,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Download,
  AlertTriangle,
  Activity,
  Users,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

const regions = [
  { id: "kothrud", name: "Kothrud", lat: 28, left: 18, severity: "critical", cases: 847, trend: "+23%" },
  { id: "shivajinagar", name: "Shivajinagar", lat: 42, left: 35, severity: "warning", cases: 423, trend: "+12%" },
  { id: "hadapsar", name: "Hadapsar", lat: 58, left: 62, severity: "critical", cases: 612, trend: "+31%" },
  { id: "deccan", name: "Deccan", lat: 45, left: 28, severity: "stable", cases: 156, trend: "-5%" },
  { id: "viman-nagar", name: "Viman Nagar", lat: 25, left: 55, severity: "warning", cases: 289, trend: "+8%" },
  { id: "koregaon", name: "Koregaon Park", lat: 38, left: 68, severity: "stable", cases: 98, trend: "-12%" },
  { id: "aundh", name: "Aundh", lat: 18, left: 30, severity: "monitoring", cases: 187, trend: "+2%" },
  { id: "wakad", name: "Wakad", lat: 22, left: 12, severity: "stable", cases: 76, trend: "-8%" },
]

const diseases = [
  { id: "all", name: "All Diseases", color: "bg-purple-500" },
  { id: "dengue", name: "Dengue", color: "bg-red-500" },
  { id: "malaria", name: "Malaria", color: "bg-amber-500" },
  { id: "typhoid", name: "Typhoid", color: "bg-blue-500" },
  { id: "respiratory", name: "Respiratory", color: "bg-emerald-500" },
]

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical": return "bg-red-500"
    case "warning": return "bg-amber-500"
    case "stable": return "bg-emerald-500"
    case "monitoring": return "bg-sky-500"
    default: return "bg-slate-500"
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-700 border-red-200"
    case "warning": return "bg-amber-100 text-amber-700 border-amber-200"
    case "stable": return "bg-emerald/20 text-emerald border-emerald/30"
    case "monitoring": return "bg-sky-100 text-sky-700 border-sky-200"
    default: return ""
  }
}

export default function HeatmapPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [heatIntensity, setHeatIntensity] = useState([70])
  const [showLabels, setShowLabels] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const activeRegion = regions.find(r => r.id === selectedRegion)

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[0.5rem] bg-saffron/15">
                <Map className="h-5 w-5 text-saffron" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Live Disease Heatmap</h1>
                <p className="text-sm text-muted-foreground">Real-time geographical outbreak visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/30">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse mr-2" />
                Live
              </Badge>
              <span className="text-xs text-muted-foreground">Updated 30s ago</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Controls Panel */}
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border bg-card p-4 overflow-auto">
            <div className="space-y-6">
              {/* Filters */}
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4" />
                  Map Filters
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Disease Type</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full bg-background" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {diseases.map(d => (
                          <SelectItem key={d.id} value={d.id}>
                            <span className="flex items-center gap-2">
                              <span className={cn("w-2 h-2 rounded-full", d.color)} />
                              {d.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Time Period</Label>
                    <Select defaultValue="24h">
                      <SelectTrigger className="w-full bg-background" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Severity Filter</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full bg-background" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="critical">Critical Only</SelectItem>
                        <SelectItem value="warning">Warning & Above</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4" />
                  Display Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Heat Intensity</Label>
                    <Slider
                      value={heatIntensity}
                      onValueChange={setHeatIntensity}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{heatIntensity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-foreground">Show Labels</Label>
                    <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-foreground">Auto Refresh</Label>
                    <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Threat Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-foreground">Critical (&gt;500 cases)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    <span className="text-foreground">Warning (200-500 cases)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    <span className="text-foreground">Stable (50-200 cases)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-sky-500" />
                    <span className="text-foreground">Monitoring (&lt;50 cases)</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Map Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force Refresh
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Map Area */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <MetricCard title="Total Active Cases" value="3,688" icon={Activity} trend="up" accentColor="saffron" />
              <MetricCard title="Critical Zones" value="2" icon={AlertTriangle} trend="up" accentColor="emerald" />
              <MetricCard title="Affected Population" value="1.2M" icon={Users} trend="neutral" accentColor="saffron" />
              <MetricCard title="Spread Rate" value="+15%" icon={TrendingUp} trend="up" accentColor="emerald" />
            </div>

            <ContentCard title="Interactive Disease Heatmap" accentColor="saffron" className="min-h-[500px]">
              <div className="flex flex-col h-full">
                {/* Map Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><ZoomIn className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm"><ZoomOut className="h-4 w-4" /></Button>
                    <span className="text-xs text-muted-foreground ml-2">Pune Metropolitan Region</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Last sync: Just now
                  </div>
                </div>

                {/* Map Visualization */}
                <div className="flex-1 relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-[0.5rem] overflow-hidden min-h-[400px]">
                  {/* Grid */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Region boundaries */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                    <path d="M50,150 Q100,80 180,100 T280,90 Q350,120 370,180 Q340,250 250,260 Q150,280 80,220 Q30,180 50,150" 
                          fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
                  </svg>

                  {/* Heat spots with dynamic intensity */}
                  {regions.map(region => (
                    <div
                      key={region.id}
                      className={cn(
                        "absolute rounded-full cursor-pointer transition-all duration-300",
                        getSeverityColor(region.severity),
                        selectedRegion === region.id ? "ring-4 ring-foreground/30 scale-110" : ""
                      )}
                      style={{
                        top: `${region.lat}%`,
                        left: `${region.left}%`,
                        width: `${Math.max(40, region.cases / 10)}px`,
                        height: `${Math.max(40, region.cases / 10)}px`,
                        opacity: heatIntensity[0] / 100 * 0.7,
                        filter: `blur(${20 - heatIntensity[0] / 10}px)`,
                      }}
                      onClick={() => setSelectedRegion(region.id === selectedRegion ? null : region.id)}
                    />
                  ))}

                  {/* Location labels */}
                  {showLabels && regions.map(region => (
                    <div
                      key={`label-${region.id}`}
                      className={cn(
                        "absolute flex items-center gap-1 cursor-pointer transition-transform",
                        selectedRegion === region.id ? "scale-110" : ""
                      )}
                      style={{ top: `${region.lat + 5}%`, left: `${region.left}%` }}
                      onClick={() => setSelectedRegion(region.id === selectedRegion ? null : region.id)}
                    >
                      <div className={cn("w-2 h-2 rounded-full", getSeverityColor(region.severity), region.severity === "critical" && "animate-pulse")} />
                      <span className="text-[10px] font-medium text-slate-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                        {region.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ContentCard>
          </main>

          {/* Right Detail Panel */}
          <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card p-4 overflow-auto">
            <h3 className="text-sm font-semibold text-foreground mb-4">Region Details</h3>
            {activeRegion ? (
              <div className="space-y-4">
                <div className="p-4 rounded-[0.5rem] bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{activeRegion.name}</span>
                    <Badge variant="outline" className={getSeverityBadge(activeRegion.severity)}>
                      {activeRegion.severity.charAt(0).toUpperCase() + activeRegion.severity.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Cases</span>
                      <span className="font-medium text-foreground">{activeRegion.cases.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trend (7d)</span>
                      <span className={cn("font-medium", activeRegion.trend.startsWith("+") ? "text-red-600" : "text-emerald")}>
                        {activeRegion.trend}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">View Detailed Report</Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">Deploy Response Team</Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">Alert Hospitals</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Map className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click on a region to view details</p>
              </div>
            )}

            {/* Region List */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">All Regions</h4>
              <div className="space-y-2">
                {regions.map(region => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-[0.5rem] text-sm transition-colors",
                      selectedRegion === region.id ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getSeverityColor(region.severity))} />
                      <span className="text-foreground">{region.name}</span>
                    </div>
                    <span className="text-muted-foreground">{region.cases}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
