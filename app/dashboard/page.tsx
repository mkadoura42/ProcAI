"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Activity, DollarSign, FileText, Users, CheckCircle, Clock, Filter, Download, RefreshCw, ChevronDown, Search } from "lucide-react";
import Link from "next/link";

// Define types
interface RFP {
  id: string;
  referenceNumber: string;
  title: string;
  client: string;
  status: RFPStatus;
  submissionDeadline: string;
  category: string;
  budget: number;
}

interface Bid {
  id: string;
  referenceNumber: string;
  rfpReferenceNumber: string;
  vendor: {
    name: string;
  };
  status: BidStatus;
  submissionDate: string;
  totalAmount: number;
}

type RFPStatus = 'active' | 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
type BidStatus = 'received' | 'under-review' | 'shortlisted' | 'rejected' | 'accepted';
type StatusType = RFPStatus | BidStatus;

// Mock data for dashboard
const mockStats = {
  totalRFPs: 24,
  activeRFPs: 12,
  totalBids: 87,
  activeBids: 34,
  totalReports: 56,
  recentReports: 8,
  complianceScore: 92,
  averageBidAmount: 125000,
  bidWinRate: 68,
};

const mockRFPs: RFP[] = [
  { id: "1", referenceNumber: "RFP-20230615-001", title: "Enterprise Resource Planning System", client: "City of Springfield", status: "active", submissionDeadline: "2023-07-15", category: "Software", budget: 500000 },
  { id: "2", referenceNumber: "RFP-20230622-002", title: "Network Infrastructure Upgrade", client: "Midwest Healthcare", status: "active", submissionDeadline: "2023-07-30", category: "Hardware", budget: 350000 },
  { id: "3", referenceNumber: "RFP-20230701-003", title: "Cybersecurity Assessment Services", client: "First National Bank", status: "active", submissionDeadline: "2023-08-05", category: "Services", budget: 120000 },
  { id: "4", referenceNumber: "RFP-20230710-004", title: "Mobile Application Development", client: "Transit Authority", status: "active", submissionDeadline: "2023-08-15", category: "Software", budget: 200000 },
  { id: "5", referenceNumber: "RFP-20230715-005", title: "Cloud Migration Services", client: "State University", status: "active", submissionDeadline: "2023-08-20", category: "Services", budget: 450000 },
];

const mockBids: Bid[] = [
  { id: "1", referenceNumber: "BID-20230615-001", rfpReferenceNumber: "RFP-20230615-001", vendor: { name: "TechPro Solutions" }, status: "under-review", submissionDate: "2023-07-10", totalAmount: 485000 },
  { id: "2", referenceNumber: "BID-20230622-002", rfpReferenceNumber: "RFP-20230622-002", vendor: { name: "Network Systems Inc" }, status: "received", submissionDate: "2023-07-25", totalAmount: 340000 },
  { id: "3", referenceNumber: "BID-20230701-003", rfpReferenceNumber: "RFP-20230701-003", vendor: { name: "SecureIT Consulting" }, status: "received", submissionDate: "2023-08-01", totalAmount: 115000 },
  { id: "4", referenceNumber: "BID-20230710-004", rfpReferenceNumber: "RFP-20230710-004", vendor: { name: "AppDev Technologies" }, status: "received", submissionDate: "2023-08-10", totalAmount: 195000 },
  { id: "5", referenceNumber: "BID-20230715-005", rfpReferenceNumber: "RFP-20230715-005", vendor: { name: "CloudMigrate Services" }, status: "received", submissionDate: "2023-08-15", totalAmount: 440000 },
];

// Status color mapping
const statusColors: Record<StatusType, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  closed: "bg-red-100 text-red-800",
  awarded: "bg-purple-100 text-purple-800",
  cancelled: "bg-orange-100 text-orange-800",
  received: "bg-blue-100 text-blue-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-indigo-100 text-indigo-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-green-100 text-green-800",
};

export default function DashboardPage() {
  const [selectedColumns, setSelectedColumns] = useState({
    referenceNumber: true,
    title: true,
    client: true,
    status: true,
    submissionDeadline: true,
    category: false,
    budget: false,
  });

  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<keyof RFP>("submissionDeadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter and sort RFPs
  const filteredRFPs = mockRFPs.filter(
    (rfp) =>
      rfp.title.toLowerCase().includes(filter.toLowerCase()) ||
      rfp.client.toLowerCase().includes(filter.toLowerCase()) ||
      rfp.referenceNumber.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedRFPs = [...filteredRFPs].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total RFPs</p>
                <h3 className="text-2xl font-bold">{mockStats.totalRFPs}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{mockStats.activeRFPs} active</span>
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
                <h3 className="text-2xl font-bold">{mockStats.totalBids}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{mockStats.activeBids} active</span>
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Bid Amount</p>
                <h3 className="text-2xl font-bold">{formatCurrency(mockStats.averageBidAmount)}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">Win rate: {mockStats.bidWinRate}%</span>
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <h3 className="text-2xl font-bold">{mockStats.complianceScore}%</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+5% from last month</span>
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>RFP & Bid Activity</CardTitle>
            <CardDescription>Monthly activity over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <BarChart className="h-16 w-16 mb-2" />
              <p>RFP & Bid Activity Chart</p>
              <p className="text-sm">Showing monthly trends and comparisons</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procurement Analytics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <Activity className="h-16 w-16 mb-2" />
              <p>Procurement Analytics Dashboard</p>
              <p className="text-sm">Showing KPIs and performance metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects & RFPs Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Projects & RFPs</CardTitle>
              <CardDescription>Complete list of all projects and RFPs</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Upcoming Deadlines
              </Button>
              <Button variant="outline" size="sm">
                Column Settings
              </Button>
              <Button size="sm">
                <Link href="/rfps">View All</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rfps">
            <TabsList className="mb-4">
              <TabsTrigger value="rfps">RFPs</TabsTrigger>
              <TabsTrigger value="bids">Bids</TabsTrigger>
            </TabsList>
            <TabsContent value="rfps">
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedColumns.referenceNumber && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("referenceNumber");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Reference #
                          {sortBy === "referenceNumber" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      {selectedColumns.title && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("title");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Title
                          {sortBy === "title" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      {selectedColumns.client && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("client");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Client
                          {sortBy === "client" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      {selectedColumns.status && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("status");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Status
                          {sortBy === "status" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      {selectedColumns.submissionDeadline && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("submissionDeadline");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Deadline
                          {sortBy === "submissionDeadline" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      {selectedColumns.category && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("category");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Category
                          {sortBy === "category" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      {selectedColumns.budget && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => {
                            setSortBy("budget");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Budget
                          {sortBy === "budget" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      )}
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedRFPs.map((rfp) => (
                      <tr key={rfp.id} className="hover:bg-gray-50">
                        {selectedColumns.referenceNumber && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            <Link href={`/rfps/${rfp.id}`}>{rfp.referenceNumber}</Link>
                          </td>
                        )}
                        {selectedColumns.title && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rfp.title}</td>
                        )}
                        {selectedColumns.client && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rfp.client}</td>
                        )}
                        {selectedColumns.status && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[rfp.status]}`}>
                              {rfp.status}
                            </span>
                          </td>
                        )}
                        {selectedColumns.submissionDeadline && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(rfp.submissionDeadline)}
                          </td>
                        )}
                        {selectedColumns.category && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rfp.category}</td>
                        )}
                        {selectedColumns.budget && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(rfp.budget)}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/rfps/${rfp.id}`}>View</Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/ai-analysis?rfpId=${rfp.id}`}>Analyze</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="bids">
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RFP Reference
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submission Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockBids.map((bid) => (
                      <tr key={bid.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link href={`/bids/${bid.id}`}>{bid.referenceNumber}</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link href={`/rfps/${bid.rfpReferenceNumber}`} className="text-blue-600 hover:underline">
                            {bid.rfpReferenceNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bid.vendor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[bid.status]}`}>
                            {bid.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(bid.submissionDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(bid.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/bids/${bid.id}`}>View</Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/ai-analysis?bidId=${bid.id}`}>Evaluate</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{sortedRFPs.length}</strong> of <strong>{mockRFPs.length}</strong> RFPs
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
