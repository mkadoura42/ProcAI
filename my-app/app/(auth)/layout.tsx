import { Sidebar } from "@/components/shared/sidebar"
import { TopBar } from "@/components/shared/topbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-zinc-900">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <TopBar />
        {children}
      </main>
    </div>
  )
}
