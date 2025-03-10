import { UserButton } from "./user-button"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"

export function TopBar() {
  return (
    <div className="flex items-center p-4 border-b">
      {/* Search */}
      <div className="flex items-center flex-1 px-4">
        <Input 
          placeholder="Search RFPs, bids, reports..." 
          className="w-full max-w-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
        </Button>
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}
