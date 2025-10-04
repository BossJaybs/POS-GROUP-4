"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, BarChart3, Shield, Menu } from "lucide-react"
import Aurora from "@/components/aurora"
import Image from "next/image"
import { useState } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-slate-950/80 backdrop-blur-sm text-white border-b border-white/10">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 md:h-8 md:w-8" />
                <h1 className="text-xl md:text-2xl font-bold">POS System</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-white text-slate-950 hover:bg-white/90">Sign Up</Button>
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <nav className="md:hidden flex flex-col gap-2 mt-4 pb-2">
                <Link href="/auth/login" className="w-full">
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" className="w-full">
                  <Button className="w-full bg-white text-slate-950 hover:bg-white/90">Sign Up</Button>
                </Link>
              </nav>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-white py-12 md:py-16 lg:py-20 bg-slate-950/50">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4 md:mb-6">
              <Image
                src="/gclogo.png"
                alt="Gordon College Logo"
                width={80}
                height={80}
                className="md:w-[120px] md:h-[120px] object-contain"
              />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-balance">POS System</h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/70 max-w-2xl mx-auto text-pretty px-4">
              Streamline your business operations with our comprehensive point-of-sale system. Manage inventory, process
              sales, and track analytics all in one place.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-white/90 w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-slate-950/80">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white px-4">
              Everything You Need to Run Your Business
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-base md:text-lg">Sales Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm md:text-base">
                    Process transactions quickly and efficiently with our intuitive point-of-sale interface
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Package className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-white text-base md:text-lg">Inventory Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm md:text-base">
                    Track stock levels, add new products, and manage your inventory in real-time
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-pink-400" />
                    </div>
                    <CardTitle className="text-white text-base md:text-lg">Sales Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm md:text-base">
                    View detailed reports and insights about your sales performance and trends
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Shield className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                    </div>
                    <CardTitle className="text-white text-base md:text-lg">Secure & Reliable</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm md:text-base">
                    Your data is protected with enterprise-grade security and encrypted storage
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
                    </div>
                    <CardTitle className="text-white text-base md:text-lg">Easy to Use</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm md:text-base">
                    Intuitive interface designed for speed and efficiency, no training required
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-cyan-400" />
                    </div>
                    <CardTitle className="text-white text-base md:text-lg">Real-time Updates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm md:text-base">
                    Instant synchronization across all your devices and locations
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950/90 text-slate-400 py-6 md:py-8 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm md:text-base">© 2025 POS System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
