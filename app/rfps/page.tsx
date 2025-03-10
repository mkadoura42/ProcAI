"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Filter, Plus, Search, Calendar, DollarSign, Tag, MoreHorizontal, Download, RefreshCw } from "lucide-react";
import Link from "next/link";

// Define types
interface RFP {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  client: string;
  status: RFPStatus;
  category: string;
  budget: number;
  currency: string;
  submissionDeadline: string;
  tags: string[];
}

type RFPStatus = 'draft' | 'published' | 'active' | 'closed' | 'awarded' | 'cancelled';

// Mock data for RFPs
const mockRFPs: RFP[] = [
  {
    id: "1",
    referenceNumber: "RFP-20230615-001",
    title: "Enterprise Resource Planning System",
    description: "Seeking proposals for a comprehensive ERP system to integrate all business processes including finance, HR, inventory, and customer relationship management.",
    client: "City of Springfield",
    status: "active",
    category: "Software",
    budget: 500000,
    currency: "USD",
    submissionDeadline: "2023-07-15",
    tags: ["ERP", "Software", "Cloud"]
  },
  {
    id: "2",
    referenceNumber: "RFP-20230622-002",
    title: "Network Infrastructure Upgrade",
    description: "Seeking proposals for upgrading the organization's network infrastructure including switches, routers, and wireless access points.",
    client: "Midwest Healthcare",
    status: "active",
    category: "Hardware",
    budget: 350000,
    currency: "USD",
    submissionDeadline: "2023-07-30",
    tags: ["Network", "Hardware", "Infrastructure"]
  },
  {
    id: "3",
    referenceNumber: "RFP-20230701-003",
    title: "Cybersecurity Assessment Services",
    description: "Seeking proposals for comprehensive cybersecurity assessment services including vulnerability scanning, penetration testing, and security policy review.",
    client: "First National Bank",
    status: "active",
    category: "Services",
    budget: 120000,
    currency: "USD",
    submissionDeadline: "2023-08-05",
    tags: ["Security", "Assessment", "Banking"]
  },
  {
    id: "4",
    referenceNumber: "RFP-20230710-004",
    title: "Mobile Application Development",
    description: "Seeking proposals for the development of a mobile application for public transportation tracking and fare payment.",
    client: "Transit Authority",
    status: "active",
    category: "Software",
    budget: 200000,
    currency: "USD",
    submissionDeadline: "2023-08-15",
    tags: ["Mobile", "App", "Transit"]
  },
  {
    id: "5",
    referenceNumber: "RFP-20230715-005",
    title: "Cloud Migration Services",
    description: "Seeking proposals for migrating on-premises applications and data to cloud infrastructure.",
    client: "State University",
    status: "active",
    category: "Services",
    budget: 450000,
    currency: "USD",
    submissionDeadline: "2023-08-20",
    tags: ["Cloud", "Migration", "Education"]
  }
];

// Status color mapping
const statusColors: Record<RFPStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
  awarded: "bg-purple-100 text-purple-800",
  cancelled: "bg-orange-100 text-orange-800"
};

export default function RFPsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<RFPStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<keyof RFP>("submissionDeadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRFP, setNewRFP] = useState({
    title: "",
    description: "",
    client: "",
    category: "",
    budget: "",
    submissionDeadline: ""
  });

  // Extract unique categories for filter
  const categories = Array.from(new Set(mockRFPs.map(rfp => rfp.category)));

  // Filter RFPs based on search, status, and category
  const filteredRFPs = mockRFPs.filter(
    (rfp) => {
      const matchesSearch =
        rfp.title.toLowerCase().includes(filter.toLowerCase()) ||
        rfp.client.toLowerCase().includes(filter.toLowerCase()) ||
        rfp.referenceNumber.toLowerCase().includes(filter.toLowerCase()) ||
        rfp.description.toLowerCase().includes(filter.toLowerCase());

      const matchesStatus = statusFilter === "all" || rfp.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || rfp.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    }
  );

  // Sort RFPs
  const sortedRFPs = [...filteredRFPs].sort((a, b) => {
    if (sortOrder === "asc") {
      if (sortBy === "budget") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return String(a[sortBy]).localeCompare(String(b[sortBy]));
      }
    } else {
      if (sortBy === "budget") {
        return a[sortBy] < b[sortBy] ? 1 : -1;
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
    setNewRFP(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log("Creating new RFP:", newRFP);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewRFP({
      title: "",
      description: "",
      client: "",
      category: "",
      budget: "",
      submissionDeadline: ""
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Request for Proposals (RFPs)</h1>
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
                Create New RFP
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New RFP</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new Request for Proposal.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={newRFP.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={newRFP.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client" className="text-right">
                      Client
                    </Label>
                    <Input
                      id="client"
                      name="client"
                      value={newRFP.client}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={newRFP.category}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-right">
                      Budget
                    </Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={newRFP.budget}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="submissionDeadline" className="text-right">
                      Deadline
                    </Label>
                    <Input
                      id="submissionDeadline"
                      name="submissionDeadline"
                      type="date"
                      value={newRFP.submissionDeadline}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create RFP</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search RFPs by title, client, or reference number..."
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
              onChange={(e) => setStatusFilter(e.target.value as RFPStatus | "all")}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="awarded">Awarded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof RFP)}
            >
              <option value="submissionDeadline">Sort by Deadline</option>
              <option value="title">Sort by Title</option>
              <option value="client">Sort by Client</option>
              <option value="budget">Sort by Budget</option>
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

      {/* RFPs Display */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRFPs.map((rfp) => (
            <Card key={rfp.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{rfp.title}</CardTitle>
                    <CardDescription className="text-sm">{rfp.referenceNumber}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[rfp.status]}`}>
                    {rfp.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm line-clamp-2">{rfp.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{formatCurrency(rfp.budget, rfp.currency)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Due: {formatDate(rfp.submissionDeadline)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{rfp.client}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rfp.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {rfp.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{rfp.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/rfps/${rfp.id}`}>View Details</Link>
                </Button>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/ai-analysis?rfpId=${rfp.id}`}>Analyze</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>{rfp.title}</DialogTitle>
                        <DialogDescription>{rfp.referenceNumber}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium">Client</h3>
                            <p className="text-sm text-muted-foreground">{rfp.client}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Status</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[rfp.status]}`}>
                              {rfp.status}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Budget</h3>
                            <p className="text-sm text-muted-foreground">{formatCurrency(rfp.budget, rfp.currency)}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Submission Deadline</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(rfp.submissionDeadline)}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">Description</h3>
                          <p className="text-sm text-muted-foreground">{rfp.description}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" asChild>
                          <Link href={`/rfps/${rfp.id}`}>View Full Details</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/ai-analysis?rfpId=${rfp.id}`}>Analyze with AI</Link>
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
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Deadline
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRFPs.map((rfp) => (
                <tr key={rfp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/rfps/${rfp.id}`}>{rfp.referenceNumber}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rfp.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rfp.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[rfp.status]}`}>
                      {rfp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(rfp.submissionDeadline)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(rfp.budget, rfp.currency)}
                  </td>
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
      )}
    </div>
  );
}
