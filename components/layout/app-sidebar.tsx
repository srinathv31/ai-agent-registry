"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bot,
  LayoutDashboard,
  Globe,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Domains", href: "/domains", icon: Globe },
  { label: "Sessions", href: "/sessions", icon: MessageSquare },
  { label: "Approvals", href: "/approvals", icon: ShieldCheck },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div
      style={{
        "--sidebar": "#1B2A4A",
        "--sidebar-foreground": "rgba(255,255,255,0.9)",
        "--sidebar-accent": "rgba(255,255,255,0.1)",
        "--sidebar-accent-foreground": "rgba(255,255,255,0.9)",
        "--sidebar-primary": "#2E75B6",
        "--sidebar-primary-foreground": "#ffffff",
        "--sidebar-border": "rgba(255,255,255,0.1)",
        "--sidebar-ring": "rgba(255,255,255,0.2)",
      } as React.CSSProperties}
    >
      <Sidebar>
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
              <Bot className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI Platform</p>
              <p className="text-xs text-white/50">Control Room</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-3">
          <p className="text-xs text-white/40">AI Platform v0.1 — Demo</p>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
