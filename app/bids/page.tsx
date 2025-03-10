"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Filter, Plus, Search, Calendar, DollarSign, Building, MoreHorizontal, Star, BarChart, Download, RefreshCw } from "lucide-react";
import Link from "next/link";

// Define types
interface Bid {
  id: string;
  referenceNumber: string;
  rfpReferenceNumber: string;
  rfpTitle?: string;
  vendor: {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
  };
  submissionDate: string;
  status: BidStatus;
  totalAmount: number;
  currency: string;
  technicalScore?: number;
  financialScore?: number;
  totalScore?: number;
}

type BidStatus = 'received' | 'under-review' | 'shortlisted' | 'rejected' | 'accepted';

// Mock data for Bids
const mockBids: Bid[] = [
  {
    id: "1",
    referenceNumber: "BID-20230615-001",
    rfpReferenceNumber: "RFP-20230615-001",
    rfpTitle: "Enterprise Resource Planning System",
    vendor: {
      name: "TechPro Solutions",
      contactPerson: "John Smith",
      email: "john@techpro.com",
      phone: "555-123-4567"
    },
    submissionDate: "2023-07-10",
    status: "under-review",
    totalAmount: 485000,
    currency: "USD",
    technicalScore: 87,
    financialScore: 82,
    totalScore: 85.5
  },
  {
    id: "2",
    referenceNumber: "BID-20230622-002",
    rfpReferenceNumber: "RFP-20230622-002",
    rfpTitle: "Network Infrastructure Upgrade",
    vendor: {
      name: "Network Systems Inc",
      contactPerson: "Sarah Johnson",
      email: "sarah@networksystems.com",
      phone: "555-987-6543"
    },
    submissionDate: "2023-07-25",
    status: "received",
    totalAmount: 340000,
    currency: "USD",
    technicalScore: 92,
    financialScore: 78,
    totalScore: 87.8
  },
  {
    id: "3",
    referenceNumber: "BID-20230701-003",
    rfpReferenceNumber: "RFP-20230701-003",
    rfpTitle: "Cybersecurity Assessment Services",
    vendor: {
      name: "SecureIT Consulting",
      contactPerson: "Michael Brown",
      email: "michael@secureit.com",
      phone: "555-456-7890"
    },
    submissionDate: "2023-08-01",
    status: "received",
    totalAmount: 115000,
    currency: "USD",
    technicalScore: 95,
    financialScore: 88,
    totalScore: 92.9
  },
  {
    id: "4",
    referenceNumber: "BID-20230710-004",
    rfpReferenceNumber: "RFP-20230710-004",
    rfpTitle: "Mobile Application Development",
    vendor: {
      name: "AppDev Technologies",
      contactPerson: "Emily Davis",
      email: "emily@appdev.com",
      phone: "555-789-0123"
    },
    submissionDate: "2023-08-10",
    status: "received",
    totalAmount: 195000,
    currency: "USD",
    technicalScore: 89,
    financialScore: 91,
    totalScore: 89.6
  },
  {
    id: "5",
    referenceNumber: "BID-20230715-005",
    rfpReferenceNumber: "RFP-20230715-005",
    rfpTitle: "Cloud Migration Services",
    vendor: {
      name: "CloudMigrate Services",
      contactPerson: "Robert Wilson",
      email: "robert@cloudmigrate.com",
      phone: "555-234-5678"
    },
    submissionDate: "2023-08-15",
    status: "received",
    totalAmount: 440000,
    currency: "USD",
    technicalScore: 91,
    financialScore: 85,
    totalScore: 89.2
  }
];

// Status color mapping
const statusColors: Record<BidStatus, string> = {
  received: "bg-blue-100 text-blue-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-indigo-100 text-indigo-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-green-100 text-green-800"
};

export default function BidsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<BidStatus | "all">("all");
  const [rfpFilter, setRfpFilter] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<keyof Bid>("submissionDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBid, setNewBid] = useState({
    rfpReferenceNumber: "",
    vendorName: "",
    totalAmount: "",
    submissionDate: ""
  });

  // Extract unique RFP reference numbers for filter
  const rfpReferenceNumbers = Array.from(new Set(mockBids.map(bid => bid.rfpReferenceNumber)));

  // Filter bids based on search, status, and RFP
  const filteredBids = mockBids.filter(
    (bid) => {
      const matchesSearch =
        bid.vendor.name.toLowerCase().includes(filter.toLowerCase()) ||
        bid.referenceNumber.toLowerCase().includes(filter.toLowerCase()) ||
        bid.rfpReferenceNumber.toLowerCase().includes(filter.toLowerCase()) ||
        (bid.rfpTitle && bid.rfpTitle.toLowerCase().includes(filter.toLowerCase()));

      const matchesStatus = statusFilter === "all" || bid.status === statusFilter;
      const matchesRfp = rfpFilter === "all" || bid.rfpReferenceNumber === rfpFilter;

      return matchesSearch && matchesStatus && matchesRfp;
    }
  );

  // Sort bids
  const sortedBids = [...filteredBids].sort((a, b) => {
    if (sortOrder === "asc") {
      if (sortBy === "totalAmount") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else if (sortBy === "totalScore" && a[sortBy] !== undefined && b[sortBy] !== undefined) {
        return (a[sortBy] as number) > (b[sortBy] as number) ? 1 : -1;
      } else {
        return String(a[sortBy]).localeCompare(String(b[sortBy]));
      }
    } else {
      if (sortBy === "totalAmount") {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      } else if (sortBy === "totalScore" && a[sortBy] !== undefined && b[sortBy] !== undefined) {
        return (a[sortBy] as number) < (b[sortBy] as number) ? 1 : -1;
      } else {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }
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
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBid(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log("Creating new Bid:", newBid);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewBid({
      rfpReferenceNumber: "",
      vendorName: "",
      totalAmount: "",
      submissionDate: ""
    });
  };

  // Calculate statistics
  const stats = {
    totalBids: filteredBids.length,
    receivedBids: filteredBids.filter(bid => bid.status === 'received').length,
    underReviewBids: filteredBids.filter(bid => bid.status === 'under-review').length,
    averageAmount: filteredBids.reduce((sum, bid) => sum + bid.totalAmount, 0) / filteredBids.length,
    averageScore: filteredBids.filter(bid => bid.totalScore !== undefined).reduce((sum, bid) => sum + (bid.totalScore || 0), 0) /
                 filteredBids.filter(bid => bid.totalScore !== undefined).length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bids</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            {view === "grid" ? "List View" : "Grid View"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Bid
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Bid</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new Bid.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rfpReferenceNumber" className="text-right">
                      RFP Reference
                    </Label>
                    <Input
                      id="rfpReferenceNumber"
                      name="rfpReferenceNumber"
                      value={newBid.rfpReferenceNumber}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vendorName" className="text-right">
                      Vendor Name
                    </Label>
                    <Input
                      id="vendorName"
                      name="vendorName"
                      value={newBid.vendorName}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalAmount" className="text-right">
                      Total Amount
                    </Label>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      value={newBid.totalAmount}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="submissionDate" className="text-right">
                      Submission Date
                    </Label>
                    <Input
                      id="submissionDate"
                      name="submissionDate"
                      type="date"
                      value={newBid.submissionDate}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Bid</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
              <h3 className="text-2xl font-bold">{stats.totalBids}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Under Review</p>
              <h3 className="text-2xl font-bold">{stats.underReviewBids}</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Amount</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.averageAmount)}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
              <h3 className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <BarChart className="h-5 w-5 text-purple-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bids by vendor, reference number..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BidStatus | "all")}
            >
              <option value="all">All Statuses</option>
              <option value="received">Received</option>
              <option value="under-review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={rfpFilter}
              onChange={(e) => setRfpFilter(e.target.value)}
            >
              <option value="all">All RFPs</option>
              {rfpReferenceNumbers.map((rfpRef) => (
                <option key={rfpRef} value={rfpRef}>
                  {rfpRef}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof Bid)}
            >
              <option value="submissionDate">Sort by Date</option>
              <option value="totalAmount">Sort by Amount</option>
              <option value="totalScore">Sort by Score</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Bids Display */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBids.map((bid) => (
            <Card key={bid.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{bid.vendor.name}</CardTitle>
                    <CardDescription className="text-sm">{bid.referenceNumber}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bid.status]}`}>
                    {bid.status.replace('-', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>RFP: <Link href={`/rfps?rfpId=${bid.rfpReferenceNumber}`} className="text-blue-600 hover:underline">{bid.rfpReferenceNumber}</Link></span>
                  </div>
                  {bid.rfpTitle && (
                    <p className="text-sm line-clamp-1 text-muted-foreground">{bid.rfpTitle}</p>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{formatCurrency(bid.totalAmount, bid.currency)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Submitted: {formatDate(bid.submissionDate)}</span>
                  </div>
                  {bid.totalScore !== undefined && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1" />
                      <span>Score: {bid.totalScore.toFixed(1)}/100</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/bids/${bid.id}`}>View Details</Link>
                </Button>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/ai-analysis?bidId=${bid.id}`}>Evaluate</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>{bid.vendor.name}</DialogTitle>
                        <DialogDescription>{bid.referenceNumber}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium">RFP Reference</h3>
                            <p className="text-sm text-blue-600 hover:underline">
                              <Link href={`/rfps?rfpId=${bid.rfpReferenceNumber}`}>{bid.rfpReferenceNumber}</Link>
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium">Status</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bid.status]}`}>
                              {bid.status.replace('-', ' ')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Total Amount</h3>
                            <p className="text-sm text-muted-foreground">{formatCurrency(bid.totalAmount, bid.currency)}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Submission Date</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(bid.submissionDate)}</p>
                          </div>
                        </div>
                        {bid.totalScore !== undefined && (
                          <div>
                            <h3 className="font-medium">Evaluation Scores</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div className="bg-blue-50 p-2 rounded">
                                <p className="text-xs text-muted-foreground">Technical</p>
                                <p className="text-sm font-medium">{bid.technicalScore}/100</p>
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <p className="text-xs text-muted-foreground">Financial</p>
                                <p className="text-sm font-medium">{bid.financialScore}/100</p>
                              </div>
                              <div className="bg-purple-50 p-2 rounded">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-sm font-medium">{bid.totalScore.toFixed(1)}/100</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" asChild>
                          <Link href={`/bids/${bid.id}`}>View Full Details</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/ai-analysis?bidId=${bid.id}`}>Evaluate with AI</Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Reference #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  RFP Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Submission Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/bids/${bid.id}`}>{bid.referenceNumber}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <Link href={`/rfps?rfpId=${bid.rfpReferenceNumber}`}>{bid.rfpReferenceNumber}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bid.vendor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[bid.status]}`}>
                      {bid.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(bid.submissionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(bid.totalAmount, bid.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bid.totalScore !== undefined ? `${bid.totalScore.toFixed(1)}/100` : "-"}
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
      )}
    </div>
  );
}
