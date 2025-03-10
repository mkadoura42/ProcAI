import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { 
  BarChart3, 
  Download, 
  Mail, 
  Eye, 
  Filter, 
  FileText,
  Calendar,
  User
} from "lucide-react"

const reports = [
  {
    id: "REP-2024-001",
    title: "Q1 2024 RFP Performance Analysis",
    type: "Quarterly Review",
    generated: "2024-03-01",
    author: "Sarah Chen",
    size: "2.4 MB",
    status: "Final",
    description: "Comprehensive analysis of Q1 2024 RFP performance metrics and trends"
  },
  {
    id: "REP-2024-002",
    title: "ADNOC Digital Transformation Bid Evaluation",
    type: "Bid Analysis",
    generated: "2024-02-28",
    author: "Mohammed Al Hashimi",
    size: "1.8 MB",
    status: "Under Review",
    description: "Detailed evaluation of submitted bids for the Digital Transformation project"
  },
  {
    id: "REP-2024-003",
    title: "Smart Buildings IoT Project Summary",
    type: "Project Report",
    generated: "2024-02-25",
    author: "Alex Johnson",
    size: "3.1 MB",
    status: "Final",
    description: "Summary report of the ADQ Smart Buildings IoT implementation progress"
  },
  {
    id: "REP-2024-004",
    title: "Monthly Procurement Analysis",
    type: "Monthly Review",
    generated: "2024-02-20",
    author: "Lisa Wong",
    size: "1.2 MB",
    status: "Draft",
    description: "Analysis of procurement activities and spending patterns for February 2024"
  },
  {
    id: "REP-2024-005",
    title: "Technical Evaluation Summary",
    type: "Technical Review",
    generated: "2024-02-15",
    author: "Ahmed Al Mansoori",
    size: "4.5 MB",
    status: "Final",
    description: "Technical evaluation summary of IT infrastructure proposals"
  }
]

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Button className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input 
            placeholder="Search reports by title, type, or author..." 
            className="max-w-md"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    {report.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    report.status === "Final" ? "bg-green-100 text-green-800" :
                    report.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                  {report.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Generated</p>
                    <p className="text-sm">{report.generated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Author</p>
                    <p className="text-sm">{report.author}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-sm">{report.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Size</p>
                  <p className="text-sm">{report.size}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
