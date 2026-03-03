"use client"

import { useState, useCallback } from "react"
import { CheckCircle, Loader2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { REGISTRATION_YAML_TEMPLATE } from "@/lib/mock-data"
import { delay } from "@/lib/utils"

const VALIDATION_CHECKS = [
  "Parsing YAML syntax…",
  "Validating domain schema…",
  "Checking tool endpoint connectivity…",
  "Verifying managed-identity auth…",
  "Validating input/output schemas…",
  "Checking data-classification policies…",
  "Verifying approval-rule configuration…",
  "Scanning for PCI compliance…",
  "Registering domain in sandbox…",
]

type ValidationState = "idle" | "validating" | "passed" | "deployed"

export function RegistrationWizard() {
  const [yaml, setYaml] = useState(REGISTRATION_YAML_TEMPLATE)
  const [validationState, setValidationState] = useState<ValidationState>("idle")
  const [completedChecks, setCompletedChecks] = useState<number[]>([])
  const [currentCheckIndex, setCurrentCheckIndex] = useState(-1)

  const runValidation = useCallback(async () => {
    setValidationState("validating")
    setCompletedChecks([])
    setCurrentCheckIndex(0)

    for (let i = 0; i < VALIDATION_CHECKS.length; i++) {
      setCurrentCheckIndex(i)
      await delay(400 + Math.random() * 200)
      setCompletedChecks((prev) => [...prev, i])
    }

    setCurrentCheckIndex(-1)
    setValidationState("passed")
  }, [])

  const handleDeploy = useCallback(async () => {
    setValidationState("deployed")
  }, [])

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left panel — YAML editor */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Domain Configuration (YAML)</p>
        <textarea
          value={yaml}
          onChange={(e) => setYaml(e.target.value)}
          spellCheck={false}
          className="h-[600px] w-full resize-none rounded-lg border bg-[#1e1e2e] p-4 font-mono text-sm leading-relaxed text-green-400 focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Right panel — Validation results */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Validation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {validationState === "idle" && (
              <p className="text-sm text-muted-foreground">
                Click &ldquo;Validate&rdquo; to run pre-deployment checks.
              </p>
            )}

            {(validationState === "validating" || validationState === "passed" || validationState === "deployed") && (
              <div className="space-y-2">
                {VALIDATION_CHECKS.map((check, i) => {
                  const isCompleted = completedChecks.includes(i)
                  const isCurrent = currentCheckIndex === i
                  const isVisible = isCompleted || isCurrent

                  if (!isVisible) return null

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 animate-in fade-in duration-300"
                    >
                      {isCompleted ? (
                        <CheckCircle className="size-4 shrink-0 text-success" />
                      ) : (
                        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                      )}
                      <span className="text-sm">{check}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={runValidation}
            disabled={validationState === "validating"}
          >
            {validationState === "validating" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Validating…
              </>
            ) : (
              "Validate"
            )}
          </Button>

          <Button
            onClick={handleDeploy}
            disabled={validationState !== "passed"}
            className={validationState === "passed" ? "bg-success text-white hover:bg-success/90" : ""}
          >
            <Rocket className="size-4" />
            Deploy to Sandbox
          </Button>
        </div>

        {validationState === "deployed" && (
          <Card className="border-success/30 bg-success/5 animate-in fade-in duration-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-success" />
                <div>
                  <p className="font-medium text-success">Domain deployed to sandbox</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fraud Detection domain is now live in sandbox mode. You can interact with the agent via the chat endpoint:
                  </p>
                  <p className="mt-2 rounded-md border bg-muted/50 p-2 font-mono text-xs">
                    POST /ai/domains/fraud-detection/chat
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
