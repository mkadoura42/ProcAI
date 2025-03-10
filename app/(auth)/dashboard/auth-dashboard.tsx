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

// Mock data for dashboard
const mockDashboardData: Document[] = [
  { id: "1", referenceNumber: "DASH-20230615-001", title: "Dashboard Overview", type: "dashboard" },
  { id: "2", referenceNumber: "DASH-20230622-002", title: "User Engagement Metrics", type: "dashboard" },
  { id: "3", referenceNumber: "DASH-20230701-003", title: "System Performance Report", type: "dashboard" },
  { id: "4", referenceNumber: "DASH-20230710-004", title: "Compliance Status Overview", type: "dashboard" },
  { id: "5", referenceNumber: "DASH-20230715-005", title: "Project Timeline and Milestones", type: "dashboard" }
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter documents based on search query
  const filteredDashboardData = () => {
    if (!searchQuery) return mockDashboardData;
    return mockDashboardData.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Tabs className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Dashboard Item</CardTitle>
              <CardDescription>
                Choose the item you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Dashboard Items..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {filteredDashboardData().map((doc) => (
                  <div key={doc.id} className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.referenceNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredDashboardData().length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No dashboard items found
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
