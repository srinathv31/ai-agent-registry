import { MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ResponseStepProps {
  responseText: string
}

export function ResponseStep({ responseText }: ResponseStepProps) {
  return (
    <Card className="border-l-4 border-l-success p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-success">
        <MessageSquare className="size-3.5" />
        Agent Response
      </div>
      <p className="text-sm leading-relaxed">{responseText}</p>
    </Card>
  )
}
