import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DOMAINS } from "./mock-data"
import type { Tool } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diffMs = now - then

  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return "just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`

  const totalSeconds = ms / 1000
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.round(totalSeconds % 60)
  return `${minutes}m ${seconds}s`
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US")
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
}

export function lookupTool(domainId: string, toolName: string): Tool | null {
  const domain = DOMAINS.find((d) => d.id === domainId)
  if (!domain) return null
  return domain.tools.find((t) => t.name === toolName) ?? null
}
