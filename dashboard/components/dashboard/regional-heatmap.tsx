"use client"

export function RegionalHeatmap() {
  return (
    <div className="h-full flex flex-col">
      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-[0.5rem] overflow-hidden min-h-[280px]">
        {/* Simulated map grid lines */}
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

        {/* Simulated region boundaries */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
          <path d="M50,150 Q100,80 180,100 T280,90 Q350,120 370,180 Q340,250 250,260 Q150,280 80,220 Q30,180 50,150" 
                fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
          <path d="M120,120 Q160,90 200,110 Q240,100 260,130" 
                fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
          <path d="M100,200 Q150,180 200,190 Q250,175 280,200" 
                fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        </svg>

        {/* Heat spots - Critical (Red) */}
        <div 
          className="absolute w-28 h-28 rounded-full bg-red-500/60 blur-xl"
          style={{ top: '25%', left: '20%' }}
        />
        <div 
          className="absolute w-20 h-20 rounded-full bg-red-600/50 blur-lg"
          style={{ top: '55%', left: '60%' }}
        />

        {/* Heat spots - Warning (Yellow/Amber) */}
        <div 
          className="absolute w-24 h-24 rounded-full bg-amber-400/55 blur-xl"
          style={{ top: '35%', left: '45%' }}
        />
        <div 
          className="absolute w-16 h-16 rounded-full bg-yellow-400/50 blur-lg"
          style={{ top: '60%', left: '25%' }}
        />
        <div 
          className="absolute w-20 h-20 rounded-full bg-amber-500/45 blur-xl"
          style={{ top: '20%', left: '65%' }}
        />

        {/* Heat spots - Stable (Green) */}
        <div 
          className="absolute w-24 h-24 rounded-full bg-emerald-400/50 blur-xl"
          style={{ top: '50%', left: '40%' }}
        />
        <div 
          className="absolute w-20 h-20 rounded-full bg-green-400/45 blur-lg"
          style={{ top: '70%', left: '70%' }}
        />
        <div 
          className="absolute w-16 h-16 rounded-full bg-emerald-500/40 blur-lg"
          style={{ top: '15%', left: '40%' }}
        />

        {/* Location markers */}
        <div className="absolute flex items-center gap-1" style={{ top: '28%', left: '22%' }}>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-medium text-slate-700 bg-white/80 px-1 rounded">Kothrud</span>
        </div>
        <div className="absolute flex items-center gap-1" style={{ top: '38%', left: '48%' }}>
          <div className="w-2 h-2 bg-amber-500 rounded-full" />
          <span className="text-[10px] font-medium text-slate-700 bg-white/80 px-1 rounded">Shivajinagar</span>
        </div>
        <div className="absolute flex items-center gap-1" style={{ top: '58%', left: '62%' }}>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-medium text-slate-700 bg-white/80 px-1 rounded">Hadapsar</span>
        </div>
        <div className="absolute flex items-center gap-1" style={{ top: '52%', left: '35%' }}>
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-[10px] font-medium text-slate-700 bg-white/80 px-1 rounded">Deccan</span>
        </div>

        {/* Map label */}
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 bg-white/70 px-2 py-1 rounded">
          Pune Metropolitan Region
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Threat Level:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
          <span className="text-foreground">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
          <span className="text-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-foreground">Stable</span>
        </div>
      </div>
    </div>
  )
}
