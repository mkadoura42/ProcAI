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

// Mock data for RFPS
const mockRFPS: Document[] = [
  { id: "1", referenceNumber: "RFP-20230615-001", title: "Enterprise Resource Planning System", type: "rfp" },
  { id: "2", referenceNumber: "RFP-20230622-002", title: "Network Infrastructure Upgrade", type: "rfp" },
  { id: "3", referenceNumber: "RFP-20230701-003", title: "Cybersecurity Assessment Services", type: "rfp" },
  { id: "4", referenceNumber: "RFP-20230710-004", title: "Mobile Application Development", type: "rfp" },
  { id: "5", referenceNumber: "RFP-20230715-005", title: "Cloud Migration Services", type: "rfp" }
];

export default function RfpsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter documents based on search query
  const filteredRFPS = () => {
    if (!searchQuery) return mockRFPS;
    return mockRFPS.filter(rfp =>
      rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">RFPs</h1>

      <Tabs className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="rfps">RFPs</TabsTrigger>
        </TabsList>

        <TabsContent value="rfps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select RFP</CardTitle>
              <CardDescription>
                Choose the RFP you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search RFPs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {filteredRFPS().map((rfp) => (
                  <div key={rfp.id} className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{rfp.title}</p>
                        <p className="text-sm text-muted-foreground">{rfp.referenceNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredRFPS().length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No RFPs found
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
