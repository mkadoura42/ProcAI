import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { FileText, Filter, Plus } from "lucide-react"

const rfps = [
  {
    id: "RFP-2024-001",
    title: "Enterprise Data Platform Implementation",
    company: "ADNOC Digital",
    budget: "$2.5M - $3.5M",
    status: "Open",
    submissions: 12,
    dueDate: "2024-03-15",
    category: "IT Infrastructure",
    description: "Implementation of enterprise-wide data platform including data lake and analytics capabilities."
  },
  {
    id: "RFP-2024-002",
    title: "IoT Sensors and Analytics Platform",
    company: "ADQ Smart Buildings",
    budget: "$1.2M - $1.8M",
    status: "Under Review",
    submissions: 8,
    dueDate: "2024-03-20",
    category: "Smart Infrastructure",
    description: "Development and deployment of IoT sensor network with real-time analytics dashboard."
  },
  {
    id: "RFP-2024-003",
    title: "Property Management Software",
    company: "Real Estate Division",
    budget: "$800K - $1.2M",
    status: "Draft",
    submissions: 0,
    dueDate: "2024-03-25",
    category: "Software",
    description: "End-to-end property management solution including tenant portal and maintenance tracking."
  },
  {
    id: "RFP-2024-004",
    title: "Annual Office Supplies Procurement",
    company: "Central Procurement",
    budget: "$200K - $300K",
    status: "Closed",
    submissions: 15,
    dueDate: "2024-02-28",
    category: "Procurement",
    description: "Annual contract for office supplies and stationery for all corporate offices."
  },
  {
    id: "RFP-2024-005",
    title: "Server Infrastructure Modernization",
    company: "IT Department",
    budget: "$3M - $4M",
    status: "Open",
    submissions: 6,
    dueDate: "2024-04-05",
    category: "IT Infrastructure",
    description: "Upgrade and modernization of data center infrastructure including servers and networking."
  }
]

export default function RFPsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Request for Proposals (RFPs)</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New RFP
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input 
            placeholder="Search RFPs by title, company, or category..." 
            className="max-w-md"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6">
        {rfps.map((rfp) => (
          <Card key={rfp.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    {rfp.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{rfp.company}</p>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    rfp.status === "Open" ? "bg-green-100 text-green-800" :
                    rfp.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                    rfp.status === "Draft" ? "bg-gray-100 text-gray-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                  {rfp.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                  <p className="text-sm mt-1">{rfp.budget}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-sm mt-1">{rfp.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                  <p className="text-sm mt-1">{rfp.submissions} bids</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{rfp.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">Submit Bid</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
