"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { ShoppingCart, Calculator, RotateCcw, Plus, Minus, Save } from "lucide-react"
import { useCart } from "@/lib/cart-context"

import {
  pixelPitchOptions,
  environmentOptions,
  cabinetOptions,
  calculateLEDDisplay,
  WIDTH_IN_PER_MODULE,
  HEIGHT_IN_PER_MODULE
} from "@/lib/configurator"

export function ConfiguratorSection() {
  const { addItem } = useCart()
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(2)
  const [pixelPitch, setPixelPitch] = useState("p10")
  const [environment, setEnvironment] = useState("outdoor")
  const [cabinet, setCabinet] = useState("aluminum")
  const [withFrame, setWithFrame] = useState(true)

  const [widthInput, setWidthInput] = useState("")
  const [heightInput, setHeightInput] = useState("")

  const calculation = useMemo(() => {
    return calculateLEDDisplay(width, height, pixelPitch, environment, cabinet, withFrame)
  }, [width, height, pixelPitch, environment, cabinet, withFrame])


  const { widthIn, heightIn } = calculation
  const widthFt = +(widthIn / 12).toFixed(2)
  const heightFt = +(heightIn / 12).toFixed(2)
  const widthCm = Math.round(widthIn * 2.54)
  const heightCm = Math.round(heightIn * 2.54)

  const isTypingWidth = useRef(false)
  const isTypingHeight = useRef(false)

  useEffect(() => {
    if (!isTypingWidth.current) {
      setWidthInput((calculation.widthIn + (withFrame ? 3.14 : 0)).toFixed(2))
    }
  }, [calculation.widthIn, withFrame])

  useEffect(() => {
    if (!isTypingHeight.current) {
      setHeightInput((calculation.heightIn + (withFrame ? 3.14 : 0)).toFixed(2))
    }
  }, [calculation.heightIn, withFrame])
  const handleSaveProject = () => {
    const reportDate = new Date().toLocaleDateString()
    const content = `
--- LED DISPLAY PROJECT CONFIGURATION ---
Date: ${reportDate}

TOTAL CABINET FOOTPRINT:
${(widthIn + (withFrame ? 3.14 : 0)).toFixed(2)}" x ${(heightIn + (withFrame ? 3.14 : 0)).toFixed(2)}" (Final Size)

ACTIVE DISPLAY AREA:
${widthIn}" x ${heightIn}" (${width} x ${height} Modules)

SPECIFICATIONS:
Pixel Pitch: ${pixelPitchOptions.find(p => p.value === pixelPitch)?.label}
Environment: ${environmentOptions.find(e => e.value === environment)?.label}
Cabinet Type: ${cabinetOptions.find(c => c.value === cabinet)?.label}

-----------------------------------------
ESTIMATED TOTAL: $${calculation.total.toLocaleString()} USD
-----------------------------------------
* Generated via LED Configurator
`.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LED-Configuration-${width}x${height}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setWidth(2)
    setHeight(2)
    setPixelPitch("p4")
    setEnvironment("outdoor")
    setCabinet("aluminum")
    setWithFrame(true)
  }

  const handleAddToCart = () => {
    const pp = pixelPitchOptions.find((p) => p.value === pixelPitch)!
    const env = environmentOptions.find((e) => e.value === environment)!
    const cab = cabinetOptions.find((c) => c.value === cabinet)!
    addItem({
      id: `custom-${Date.now()}`,
      name: `Custom LED Display ${width}x${height} mod`,
      price: calculation.total,
      quantity: 1,
      config: `${pp.label} | ${env.label} | ${cab.label}`,
    })
  }

  return (
    <section id="configurator" className="relative py-24 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 rounded-full mb-4">
            Price Configurator
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold font-mono text-foreground mb-4 text-balance">
            Configure Your <span className="text-primary">Display</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Get an instant price estimate. Select your specifications and add directly to cart.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Config Form */}
          <div className="lg:col-span-3 bg-card rounded-xl border border-border p-6 lg:p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Width */}
              <div>
                <label htmlFor="width-range" className="block text-sm font-semibold text-foreground mb-2">
                  Width (modules)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="width-range"
                    type="range"
                    min={1}
                    max={95}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="flex-1 accent-[#00d4ff]"
                  />
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setWidth(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-secondary border border-border/50 rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-all shadow-sm"
                        disabled={width <= 1}
                        aria-label="Decrease width"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-24 h-10 flex items-center justify-center bg-secondary rounded-md text-foreground font-mono font-bold text-sm border border-border/30">
                        {width} mod
                      </div>
                      <button
                        onClick={() => setWidth(prev => Math.max(1, Math.min(95, prev + 1)))}
                        className="w-10 h-10 flex items-center justify-center bg-secondary border border-border/50 rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-all shadow-sm"
                        disabled={width >= 95}
                        aria-label="Increase width"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Inch Input for Width */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-tight">Cabinet Size:</span>
                  <div className="relative group">
                    <input
                      id="width-inch-input"
                      aria-label="Cabinet Size Width in inches"
                      type="text"
                      inputMode="decimal"
                      value={widthInput}
                      onFocus={() => { isTypingWidth.current = true }}
                      onBlur={() => { 
                        isTypingWidth.current = false
                        setWidthInput((calculation.widthIn + (withFrame ? 3.14 : 0)).toFixed(2))
                      }}
                      onChange={(e) => {
                        setWidthInput(e.target.value)
                        const val = parseFloat(e.target.value)
                        if (!isNaN(val) && val > 0) {
                          const offset = withFrame ? 3.14 : 0
                          setWidth(Math.max(1, Math.floor((val - offset) / calculation.modWidth)))
                        }
                      }}
                      className="w-32 h-10 bg-secondary border border-border/50 rounded text-foreground font-mono text-sm text-center focus:border-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-bold font-mono pointer-events-none uppercase">in</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono font-medium">
                    (Display: {widthIn}") ≈ {widthFt} ft | {widthCm} cm
                  </span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label htmlFor="height-range" className="block text-sm font-semibold text-foreground mb-2">
                  Height (modules)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="height-range"
                    type="range"
                    min={1}
                    max={114}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="flex-1 accent-[#00d4ff]"
                  />
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setHeight(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-secondary border border-border/50 rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-all shadow-sm"
                        disabled={height <= 1}
                        aria-label="Decrease height"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-24 h-10 flex items-center justify-center bg-secondary rounded-md text-foreground font-mono font-bold text-sm border border-border/30">
                        {height} mod
                      </div>
                      <button
                        onClick={() => setHeight(prev => Math.max(1, Math.min(114, prev + 1)))}
                        className="w-10 h-10 flex items-center justify-center bg-secondary border border-border/50 rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-all shadow-sm"
                        disabled={height >= 114}
                        aria-label="Increase height"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Inch Input for Height */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-tight">Cabinet Size:</span>
                  <div className="relative group">
                    <input
                      id="height-inch-input"
                      aria-label="Cabinet Size Height in inches"
                      type="text"
                      inputMode="decimal"
                      value={heightInput}
                      onFocus={() => { isTypingHeight.current = true }}
                      onBlur={() => { 
                        isTypingHeight.current = false
                        setHeightInput((calculation.heightIn + (withFrame ? 3.14 : 0)).toFixed(2))
                      }}
                      onChange={(e) => {
                        setHeightInput(e.target.value)
                        const val = parseFloat(e.target.value)
                        if (!isNaN(val) && val > 0) {
                          const offset = withFrame ? 3.14 : 0
                          setHeight(Math.max(1, Math.floor((val - offset) / calculation.modHeight)))
                        }
                      }}
                      className="w-32 h-10 bg-secondary border border-border/50 rounded text-foreground font-mono text-sm text-center focus:border-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-bold font-mono pointer-events-none uppercase">in</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono font-medium">
                    (Display: {heightIn}") ≈ {heightFt} ft | {heightCm} cm
                  </span>
                </div>
              </div>

              {/* Pixel Pitch */}
              <div>
                <label htmlFor="pixelPitch" className="block text-sm font-semibold text-foreground mb-2">
                  Pixel Pitch
                </label>
                <select
                  id="pixelPitch"
                  value={pixelPitch}
                  onChange={(e) => setPixelPitch(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border border-border rounded-md text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                >
                  {pixelPitchOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Environment */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Environment
                </label>
                <div className="flex gap-2">
                  {environmentOptions.map((env) => (
                    <button
                      key={env.value}
                      onClick={() => setEnvironment(env.value)}
                      className={`flex-1 h-10 text-sm font-semibold rounded-md transition-all ${environment === env.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cabinet */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Cabinet Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cabinetOptions.map((cab) => (
                    <button
                      key={cab.value}
                      onClick={() => setCabinet(cab.value)}
                      className={`h-10 text-xs font-semibold rounded-md transition-all px-2 ${cabinet === cab.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {cab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Toggle */}
              <div className="sm:col-span-2">
                <label htmlFor="withFrame" className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative inline-flex items-center">
                    <input
                      id="withFrame"
                      type="checkbox"
                      className="sr-only peer"
                      checked={withFrame}
                      onChange={(e) => setWithFrame(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-secondary border border-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                  </div>
                </label>
              </div>

            </div>

            {/* Visual Preview */}
            <div className="mt-8 flex items-center justify-center">
              <div className="relative">
                <div
                  className="border-2 border-primary/40 rounded bg-primary/5 flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${Math.min(Math.max(width * 3, 60), 360)}px`,
                    height: `${Math.min(Math.max(height * 3, 40), 200)}px`,
                  }}
                >
                  <div className="text-center">
                    <p className="text-xs text-primary font-mono font-bold">
                      {width} x {height} mod
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {calculation.areaSqFt} sq ft
                    </p>
                  </div>
                </div>
                {/* Width label */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {width} mod
                  </span>
                </div>
                {/* Height label */}
                <div className="absolute top-0 bottom-0 -right-10 flex items-center">
                  <span className="text-[10px] text-muted-foreground font-mono rotate-90">
                    {height} mod
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold font-mono text-foreground">
                  Price Estimate
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Display Size</span>
                  <span className="text-foreground font-mono font-semibold">
                    {width} x {height} mod ({calculation.areaSqFt} sq ft)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pixel Pitch</span>
                  <span className="text-foreground font-mono font-semibold">
                    {pixelPitchOptions.find((p) => p.value === pixelPitch)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="text-foreground font-mono font-semibold">
                    {environmentOptions.find((e) => e.value === environment)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cabinet</span>
                  <span className="text-foreground font-mono font-semibold">
                    {cabinetOptions.find((c) => c.value === cabinet)?.label}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-primary/10 border border-primary/20 rounded-md -mx-1 shadow-sm">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">Final Cabinet Size</span>
                  <span className="text-primary font-mono font-bold text-lg">
                    {(widthIn + (withFrame ? 3.14 : 0)).toFixed(2)} × {(heightIn + (withFrame ? 3.14 : 0)).toFixed(2)} in
                  </span>
                </div>

              </div>

              <div className="bg-secondary/50 rounded-lg p-5 mb-6">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Estimated Total
                </div>
                <div className="text-4xl font-bold text-foreground font-mono">
                  ${calculation.total.toLocaleString()}
                  <span className="text-sm text-muted-foreground font-normal ml-1">
                    USD
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  *Estimate only. Final price may vary based on custom requirements.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleSaveProject}
                className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-foreground font-semibold rounded-md border border-border/50 hover:border-primary transition-all"
              >
                <Save className="w-4 h-4" />
                Save Project (.txt)
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 w-full py-3 border border-border text-muted-foreground font-semibold rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
