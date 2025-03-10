"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Send } from "lucide-react";
import Link from "next/link";

// Define types
interface Document {
  id: string;
  referenceNumber: string;
  title: string;
  type: string;
}

// Mock data for reports
const mockReports: Document[] = [
  { id: "1", referenceNumber: "REP-RFP20230615-20230720-001", title: "ERP System RFP Compliance Analysis", type: "report" },
  { id: "2", referenceNumber: "REP-BID20230615-20230725-001", title: "TechPro Solutions Bid Evaluation", type: "report" },
  { id: "3", referenceNumber: "REP-RFP20230701-20230730-001", title: "Cybersecurity Assessment RFP Analysis", type: "report" },
  { id: "4", referenceNumber: "REP-BID20230622-20230805-001", title: "Network Systems Inc Bid Evaluation", type: "report" },
  { id: "5", referenceNumber: "REP-BID20230615-20230810-001", title: "ERP System Bid Comparison", type: "report" }
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter documents based on search query
  const filteredReports = () => {
    if (!searchQuery) return mockReports;
    return mockReports.filter(report =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <Tabs className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Report</CardTitle>
              <CardDescription>
                Choose the report you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Reports..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {filteredReports().map((report) => (
                  <div key={report.id} className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.referenceNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredReports().length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No reports found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
