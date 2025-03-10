"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Filter, Plus, Search, Calendar, BarChart, Tag, MoreHorizontal, Download, FileCheck, Bot, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

// Define types
interface Report {
  id: string;
  referenceNumber: string;
  title: string;
  type: ReportType;
  relatedRFPReference?: string;
  relatedBidReferences?: string[];
  generatedBy: AgentType;
  aiModel: string;
  aiProvider: string;
  status: ReportStatus;
  summary: string;
  score?: number;
  findings?: Finding[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublic: boolean;
}

interface Finding {
  category: string;
  compliance: 'compliant' | 'partial' | 'non-compliant';
  description: string;
  recommendation?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

type ReportType = 'rfp-analysis' | 'bid-evaluation' | 'bid-comparison' | 'compliance-check';
type AgentType = 'compliance-agent' | 'evaluation-agent' | 'comparative-agent';
type ReportStatus = 'draft' | 'final' | 'archived';

// Mock data for Reports
const mockReports: Report[] = [
  {
    id: "1",
    referenceNumber: "REP-RFP20230615-20230720-001",
    title: "ERP System RFP Compliance Analysis",
    type: "rfp-analysis",
    relatedRFPReference: "RFP-20230615-001",
    generatedBy: "compliance-agent",
    aiModel: "GPT-4",
    aiProvider: "openai",
    status: "final",
    summary: "This report analyzes the compliance requirements for the Enterprise Resource Planning System RFP. The analysis shows that the RFP meets all regulatory requirements and industry standards for public sector procurement.",
    score: 92,
    findings: [
      {
        category: "Regulatory Compliance",
        compliance: "compliant",
        description: "The RFP includes all required sections for public sector procurement.",
        severity: "low"
      },
      {
        category: "Technical Requirements",
        compliance: "partial",
        description: "Some technical requirements lack specific measurable criteria.",
        recommendation: "Add specific performance metrics to technical requirements.",
        severity: "medium"
      }
    ],
    createdAt: "2023-07-20",
    updatedAt: "2023-07-21",
    tags: ["ERP", "Compliance", "Public Sector"],
    isPublic: true
  },
  {
    id: "2",
    referenceNumber: "REP-BID20230615-20230725-001",
    title: "TechPro Solutions Bid Evaluation",
    type: "bid-evaluation",
    relatedRFPReference: "RFP-20230615-001",
    relatedBidReferences: ["BID-20230615-001"],
    generatedBy: "evaluation-agent",
    aiModel: "GPT-4",
    aiProvider: "openai",
    status: "final",
    summary: "This report evaluates the bid submitted by TechPro Solutions for the Enterprise Resource Planning System RFP. The bid meets most technical requirements and offers a competitive pricing structure.",
    score: 85,
    findings: [
      {
        category: "Technical Solution",
        compliance: "compliant",
        description: "The proposed solution meets all core technical requirements.",
        severity: "low"
      },
      {
        category: "Implementation Timeline",
        compliance: "partial",
        description: "The proposed timeline may be optimistic for the scope of work.",
        recommendation: "Request a more detailed project plan with risk mitigation strategies.",
        severity: "medium"
      }
    ],
    createdAt: "2023-07-25",
    updatedAt: "2023-07-26",
    tags: ["ERP", "Bid Evaluation", "TechPro"],
    isPublic: false
  },
  {
    id: "3",
    referenceNumber: "REP-RFP20230701-20230730-001",
    title: "Cybersecurity Assessment RFP Analysis",
    type: "rfp-analysis",
    relatedRFPReference: "RFP-20230701-003",
    generatedBy: "compliance-agent",
    aiModel: "GPT-4",
    aiProvider: "openai",
    status: "draft",
    summary: "This draft report analyzes the Cybersecurity Assessment Services RFP for compliance with industry standards and best practices. The RFP generally follows NIST guidelines but may need additional clarification in certain areas.",
    score: 78,
    findings: [
      {
        category: "Scope Definition",
        compliance: "partial",
        description: "The scope of the assessment could be more clearly defined.",
        recommendation: "Add specific systems and boundaries for the assessment scope.",
        severity: "medium"
      },
      {
        category: "Reporting Requirements",
        compliance: "compliant",
        description: "The reporting requirements are well-defined and follow industry standards.",
        severity: "low"
      }
    ],
    createdAt: "2023-07-30",
    updatedAt: "2023-07-30",
    tags: ["Cybersecurity", "NIST", "Banking"],
    isPublic: false
  },
  {
    id: "4",
    referenceNumber: "REP-BID20230622-20230805-001",
    title: "Network Systems Inc Bid Evaluation",
    type: "bid-evaluation",
    relatedRFPReference: "RFP-20230622-002",
    relatedBidReferences: ["BID-20230622-002"],
    generatedBy: "evaluation-agent",
    aiModel: "GPT-4",
    aiProvider: "openai",
    status: "final",
    summary: "This report evaluates the bid submitted by Network Systems Inc for the Network Infrastructure Upgrade RFP. The bid presents a strong technical solution with competitive pricing.",
    score: 88,
    findings: [
      {
        category: "Technical Solution",
        compliance: "compliant",
        description: "The proposed solution exceeds the technical requirements.",
        severity: "low"
      },
      {
        category: "Support Plan",
        compliance: "partial",
        description: "The support plan lacks detail on response times for critical issues.",
        recommendation: "Request a service level agreement with specific response times.",
        severity: "medium"
      }
    ],
    createdAt: "2023-08-05",
    updatedAt: "2023-08-06",
    tags: ["Network", "Infrastructure", "Healthcare"],
    isPublic: true
  },
  {
    id: "5",
    referenceNumber: "REP-BID20230615-20230810-001",
    title: "ERP System Bid Comparison",
    type: "bid-comparison",
    relatedRFPReference: "RFP-20230615-001",
    relatedBidReferences: ["BID-20230615-001", "BID-20230615-002", "BID-20230615-003"],
    generatedBy: "comparative-agent",
    aiModel: "GPT-4",
    aiProvider: "openai",
    status: "final",
    summary: "This report compares three bids received for the Enterprise Resource Planning System RFP. TechPro Solutions offers the most comprehensive solution but at a higher price point, while CompSys offers a more budget-friendly option with fewer features.",
    score: 90,
    findings: [
      {
        category: "Cost Comparison",
        compliance: "compliant",
        description: "All bids fall within the expected budget range, with a 15% variance between the highest and lowest.",
        severity: "low"
      },
      {
        category: "Feature Comparison",
        compliance: "partial",
        description: "Significant differences in mobile capabilities between vendors.",
        recommendation: "Consider mobile features as a key decision factor based on user needs.",
        severity: "medium"
      }
    ],
    createdAt: "2023-08-10",
    updatedAt: "2023-08-11",
    tags: ["ERP", "Comparison", "Procurement"],
    isPublic: true
  }
];

// Status color mapping
const statusColors: Record<ReportStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  final: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800"
};

// Type color mapping
const typeColors: Record<ReportType, string> = {
  "rfp-analysis": "bg-blue-100 text-blue-800",
  "bid-evaluation": "bg-purple-100 text-purple-800",
  "bid-comparison": "bg-indigo-100 text-indigo-800",
  "compliance-check": "bg-orange-100 text-orange-800"
};

// Agent color mapping
const agentColors: Record<AgentType, string> = {
  "compliance-agent": "bg-teal-100 text-teal-800",
  "evaluation-agent": "bg-violet-100 text-violet-800",
  "comparative-agent": "bg-cyan-100 text-cyan-800"
};

// Compliance color mapping
const complianceColors: Record<string, string> = {
  "compliant": "bg-green-100 text-green-800",
  "partial": "bg-yellow-100 text-yellow-800",
  "non-compliant": "bg-red-100 text-red-800"
};

// Severity color mapping
const severityColors: Record<string, string> = {
  "low": "bg-blue-100 text-blue-800",
  "medium": "bg-yellow-100 text-yellow-800",
  "high": "bg-orange-100 text-orange-800",
  "critical": "bg-red-100 text-red-800"
};

export default function ReportsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");
  const [sortBy, setSortBy] = useState<keyof Report>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter reports based on search, status, and type
  const filteredReports = mockReports.filter(
    (report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(filter.toLowerCase()) ||
        report.referenceNumber.toLowerCase().includes(filter.toLowerCase()) ||
        report.summary.toLowerCase().includes(filter.toLowerCase()) ||
        (report.relatedRFPReference && report.relatedRFPReference.toLowerCase().includes(filter.toLowerCase())) ||
        (report.relatedBidReferences && report.relatedBidReferences.some(ref => ref.toLowerCase().includes(filter.toLowerCase())));

      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      const matchesType = typeFilter === "all" || report.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }
  );

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortOrder === "asc") {
      if (sortBy === "score") {
        return (a[sortBy] || 0) > (b[sortBy] || 0) ? 1 : -1;
      } else {
        return String(a[sortBy]).localeCompare(String(b[sortBy]));
      }
    } else {
      if (sortBy === "score") {
        return (a[sortBy] || 0) < (b[sortBy] || 0) ? 1 : -1;
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

  // Format report type for display
  const formatReportType = (type: ReportType) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format agent type for display
  const formatAgentType = (agent: AgentType) => {
    return agent.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Calculate statistics
  const stats = {
    totalReports: filteredReports.length,
    draftReports: filteredReports.filter(report => report.status === 'draft').length,
    finalReports: filteredReports.filter(report => report.status === 'final').length,
    averageScore: filteredReports.filter(report => report.score !== undefined).reduce((sum, report) => sum + (report.score || 0), 0) /
                 filteredReports.filter(report => report.score !== undefined).length || 0
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
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
          <Button asChild>
            <Link href="/ai-analysis">
              <Plus className="h-4 w-4 mr-2" />
              Generate New Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <h3 className="text-2xl font-bold">{stats.totalReports}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Draft Reports</p>
              <h3 className="text-2xl font-bold">{stats.draftReports}</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-yellow-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Final Reports</p>
              <h3 className="text-2xl font-bold">{stats.finalReports}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <FileCheck className="h-5 w-5 text-green-700" />
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
            placeholder="Search reports by title, reference number..."
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
              onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "all")}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
              <option value="archived">Archived</option>
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ReportType | "all")}
            >
              <option value="all">All Types</option>
              <option value="rfp-analysis">RFP Analysis</option>
              <option value="bid-evaluation">Bid Evaluation</option>
              <option value="bid-comparison">Bid Comparison</option>
              <option value="compliance-check">Compliance Check</option>
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof Report)}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="score">Sort by Score</option>
              <option value="type">Sort by Type</option>
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

      {/* Reports Display */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No Reports Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="text-sm">{report.referenceNumber}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[report.type]}`}>
                      {formatReportType(report.type)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm line-clamp-2">{report.summary}</p>

                  {report.relatedRFPReference && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>RFP: <Link href={`/rfps?rfpId=${report.relatedRFPReference}`} className="text-blue-600 hover:underline">{report.relatedRFPReference}</Link></span>
                    </div>
                  )}

                  {report.relatedBidReferences && report.relatedBidReferences.length > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileCheck className="h-4 w-4 mr-1" />
                      <span>Bids: {report.relatedBidReferences.length}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Bot className="h-4 w-4 mr-1" />
                    <span>{formatAgentType(report.generatedBy)} ({report.aiModel})</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created: {formatDate(report.createdAt)}</span>
                  </div>

                  {report.score !== undefined && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BarChart className="h-4 w-4 mr-1" />
                      <span>Score: {report.score}/100</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {report.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {report.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{report.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/reports/${report.id}`}>View Report</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/ai-analysis?reportId=${report.id}`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/reports/${report.id}`}>{report.referenceNumber}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColors[report.type]}`}>
                      {formatReportType(report.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.score !== undefined ? `${report.score}/100` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/reports/${report.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/ai-analysis?reportId=${report.id}`}>Edit</Link>
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
