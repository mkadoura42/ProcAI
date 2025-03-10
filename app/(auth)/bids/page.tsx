import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { GanttChartSquare, Filter, ArrowUpDown } from "lucide-react"

const bids = [
  {
    id: "BID-2024-001",
    rfpId: "RFP-2024-001",
    rfpTitle: "Enterprise Data Platform Implementation",
    company: "Tech Solutions LLC",
    amount: "$2.8M",
    status: "Submitted",
    submissionDate: "2024-02-28",
    evaluationScore: 85,
    technicalScore: 88,
    financialScore: 82,
    notes: "Strong technical proposal with comprehensive implementation plan"
  },
  {
    id: "BID-2024-002",
    rfpId: "RFP-2024-002",
    rfpTitle: "IoT Sensors and Analytics Platform",
    company: "Smart Systems International",
    amount: "$1.5M",
    status: "Under Evaluation",
    submissionDate: "2024-02-25",
    evaluationScore: 78,
    technicalScore: 82,
    financialScore: 74,
    notes: "Innovative approach to sensor deployment and data analytics"
  },
  {
    id: "BID-2024-003",
    rfpId: "RFP-2024-003",
    rfpTitle: "Property Management Software",
    company: "PropTech Solutions",
    amount: "$950K",
    status: "Draft",
    submissionDate: "-",
    evaluationScore: null,
    technicalScore: null,
    financialScore: null,
    notes: "Initial draft focusing on cloud-based solution"
  },
  {
    id: "BID-2024-004",
    rfpId: "RFP-2024-004",
    rfpTitle: "Annual Office Supplies Procurement",
    company: "Office Solutions Co.",
    amount: "$280K",
    status: "Won",
    submissionDate: "2024-02-15",
    evaluationScore: 92,
    technicalScore: 90,
    financialScore: 94,
    notes: "Most competitive pricing with excellent delivery terms"
  },
  {
    id: "BID-2024-005",
    rfpId: "RFP-2024-005",
    rfpTitle: "Server Infrastructure Modernization",
    company: "DataCenter Experts Ltd",
    amount: "$3.2M",
    status: "In Progress",
    submissionDate: "-",
    evaluationScore: null,
    technicalScore: null,
    financialScore: null,
    notes: "Focusing on green data center implementation"
  }
]

export default function BidsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bids Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Create New Bid</Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input 
            placeholder="Search bids by RFP, company, or status..." 
            className="max-w-md"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Bid ID</TableHead>
              <TableHead>RFP Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{bid.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{bid.rfpTitle}</p>
                    <p className="text-sm text-muted-foreground">ID: {bid.rfpId}</p>
                  </div>
                </TableCell>
                <TableCell>{bid.company}</TableCell>
                <TableCell>{bid.amount}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      bid.status === "Won" ? "bg-green-100 text-green-800" :
                      bid.status === "Submitted" ? "bg-blue-100 text-blue-800" :
                      bid.status === "Under Evaluation" ? "bg-yellow-100 text-yellow-800" :
                      bid.status === "In Progress" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                    {bid.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {bid.evaluationScore ? (
                    <div className="space-y-1">
                      <div className="font-medium">{bid.evaluationScore}%</div>
                      <div className="text-xs text-muted-foreground">
                        T: {bid.technicalScore}% | F: {bid.financialScore}%
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
