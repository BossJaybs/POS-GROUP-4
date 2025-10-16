"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)

    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = (checked: boolean) => {
    setIsDark(checked)

    if (checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-lg">
          {isDark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
        </div>
        <div>
          <Label htmlFor="theme-toggle" className="text-base font-semibold text-foreground cursor-pointer">
            Dark Mode
          </Label>
          <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
        </div>
      </div>
      <Switch id="theme-toggle" checked={isDark} onCheckedChange={toggleTheme} />
    </div>
  )
}
