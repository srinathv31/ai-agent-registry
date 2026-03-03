"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface KillSwitchProps {
  domainName: string
  isActive: boolean
  onToggle: (newState: boolean) => void
}

export function KillSwitch({ domainName, isActive, onToggle }: KillSwitchProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingState, setPendingState] = useState<boolean | null>(null)

  function handleCheckedChange(checked: boolean) {
    setPendingState(checked)
    setDialogOpen(true)
  }

  function handleConfirm() {
    if (pendingState !== null) {
      onToggle(pendingState)
    }
    setDialogOpen(false)
    setPendingState(null)
  }

  function handleCancel() {
    setDialogOpen(false)
    setPendingState(null)
  }

  const isDisabling = pendingState === false

  return (
    <>
      <Switch
        checked={isActive}
        onCheckedChange={handleCheckedChange}
        size="sm"
      />
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDisabling ? "Disable Domain" : "Enable Domain"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDisabling
                ? `This will immediately disable all AI agents for ${domainName}. Active sessions will be terminated.`
                : `This will re-enable AI agents for ${domainName}. Agents will resume processing requests.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={isDisabling ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              {isDisabling ? "Disable" : "Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
