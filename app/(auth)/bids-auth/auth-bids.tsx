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

// Mock data for bids
const mockBids: Document[] = [
  { id: "1", referenceNumber: "BID-20230615-001", title: "TechPro Solutions - ERP System", type: "bid" },
  { id: "2", referenceNumber: "BID-20230622-002", title: "Network Systems Inc - Network Upgrade", type: "bid" },
  { id: "3", referenceNumber: "BID-20230701-003", title: "SecureIT Consulting - Cybersecurity", type: "bid" },
  { id: "4", referenceNumber: "BID-20230710-004", title: "AppDev Technologies - Mobile App", type: "bid" },
  { id: "5", referenceNumber: "BID-20230715-005", title: "CloudMigrate Services - Cloud Migration", type: "bid" }
];

export default function BidsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter documents based on search query
  const filteredBids = () => {
    if (!searchQuery) return mockBids;
    return mockBids.filter(bid =>
      bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Bids</h1>

      <Tabs className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="bids">Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Bid</CardTitle>
              <CardDescription>
                Choose the bid you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Bids..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {filteredBids().map((bid) => (
                  <div key={bid.id} className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{bid.title}</p>
                        <p className="text-sm text-muted-foreground">{bid.referenceNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredBids().length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No bids found
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
