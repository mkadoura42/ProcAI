import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { BarChart3, FileText, GanttChartSquare, DollarSign } from "lucide-react"

// Dummy data for demonstration
const metrics = [
  {
    title: "Total Projects",
    value: "89",
    description: "Active and completed projects",
    icon: BarChart3,
    trend: "+4.5% from last month"
  },
  {
    title: "Active RFPs",
    value: "24",
    description: "Currently open for bidding",
    icon: FileText,
    trend: "+2 new this week"
  },
  {
    title: "Bids in Progress",
    value: "36",
    description: "Awaiting submission/review",
    icon: GanttChartSquare,
    trend: "+12.3% from last month"
  },
  {
    title: "Total Revenue",
    value: "$4.2M",
    description: "Year to date",
    icon: DollarSign,
    trend: "+15.2% from last year"
  }
]

const projects = [
  {
    name: "ADNOC Digital Transformation",
    rfpTitle: "Enterprise Data Platform Implementation",
    category: "IT Infrastructure",
    status: "In Progress",
    division: "Technical",
    dueDate: "2024-03-15"
  },
  {
    name: "ADQ Smart Buildings",
    rfpTitle: "IoT Sensors and Analytics Platform",
    category: "Smart Infrastructure",
    status: "Under Review",
    division: "Technical",
    dueDate: "2024-03-20"
  },
  {
    name: "Real Estate Management System",
    rfpTitle: "Property Management Software",
    category: "Software",
    status: "Pending Approval",
    division: "IT",
    dueDate: "2024-03-25"
  },
  {
    name: "Office Supplies Contract",
    rfpTitle: "Annual Office Supplies Procurement",
    category: "Procurement",
    status: "Open",
    division: "Stationary",
    dueDate: "2024-04-01"
  },
  {
    name: "Data Center Upgrade",
    rfpTitle: "Server Infrastructure Modernization",
    category: "IT Infrastructure",
    status: "Draft",
    division: "Technical",
    dueDate: "2024-04-05"
  }
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
              <p className="text-xs text-emerald-500 mt-2">
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Projects & RFPs</h2>
          <span className="text-sm text-muted-foreground">
            Showing {projects.length} of {projects.length} projects
          </span>
        </div>
        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>RFP Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.name} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.rfpTitle}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                        project.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                        project.status === "Pending Approval" ? "bg-purple-100 text-purple-800" :
                        project.status === "Open" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                      {project.status}
                    </div>
                  </TableCell>
                  <TableCell>{project.division}</TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
