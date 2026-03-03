import { PageHeader } from "@/components/layout/page-header"
import { RegistrationWizard } from "@/components/domains/registration-wizard"

export default function RegisterDomainPage() {
  return (
    <>
      <PageHeader
        title="Register New Domain"
        description="Configure and deploy a new AI agent domain"
      />
      <div className="p-6">
        <RegistrationWizard />
      </div>
    </>
  )
}
