"use client"

import { useState, useEffect, useRef } from "react"
import { Brain } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ReasoningStepProps {
  text: string
  isVisible: boolean
}

export function ReasoningStep({ text, isVisible }: ReasoningStepProps) {
  const [displayedLength, setDisplayedLength] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isVisible) {
      setDisplayedLength(0)
      setIsComplete(false)
      return
    }

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsComplete(true)
          return text.length
        }
        return prev + 1
      })
    }, 15)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isVisible, text])

  if (!isVisible) return null

  return (
    <Card className="border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
        <Brain className="size-3.5" />
        Reasoning
      </div>
      <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
        {text.slice(0, displayedLength)}
        {!isComplete && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-blue-600 dark:bg-blue-400" />
        )}
      </p>
    </Card>
  )
}
