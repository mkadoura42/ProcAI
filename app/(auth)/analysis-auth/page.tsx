"use client";

// 1) Add this import if TypeScript complains about React being a UMD global
import React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Bot,
  Send,
  BarChart,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import Link from "next/link";

// Define types
interface Document {
  id: string;
  referenceNumber: string;
  title: string;
  type: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: string;
  isActive: boolean;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "system";
  content: string;
  agent?: string;
  model?: string;
  provider?: string;
  timestamp: string;
}

interface Finding {
  category: string;
  compliance: "compliant" | "partial" | "non-compliant";
  description: string;
  recommendation?: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface Report {
  id: string;
  referenceNumber: string;
  title: string;
  type: string;
  summary: string;
  score?: number;
  findings?: Finding[];
  recommendations?: string;
  chatHistory: ChatMessage[];
}

// Mock data for documents
const mockRFPs: Document[] = [
  { id: "1", referenceNumber: "RFP-20230615-001", title: "Enterprise Resource Planning System", type: "rfp" },
  { id: "2", referenceNumber: "RFP-20230622-002", title: "Network Infrastructure Upgrade", type: "rfp" },
  { id: "3", referenceNumber: "RFP-20230701-003", title: "Cybersecurity Assessment Services", type: "rfp" },
  { id: "4", referenceNumber: "RFP-20230710-004", title: "Mobile Application Development", type: "rfp" },
  { id: "5", referenceNumber: "RFP-20230715-005", title: "Cloud Migration Services", type: "rfp" },
];

const mockBids: Document[] = [
  { id: "1", referenceNumber: "BID-20230615-001", title: "TechPro Solutions - ERP System", type: "bid" },
  { id: "2", referenceNumber: "BID-20230622-002", title: "Network Systems Inc - Network Upgrade", type: "bid" },
  { id: "3", referenceNumber: "BID-20230701-003", title: "SecureIT Consulting - Cybersecurity", type: "bid" },
  { id: "4", referenceNumber: "BID-20230710-004", title: "AppDev Technologies - Mobile App", type: "bid" },
  { id: "5", referenceNumber: "BID-20230715-005", title: "CloudMigrate Services - Cloud Migration", type: "bid" },
];

const mockReports: Document[] = [
  { id: "1", referenceNumber: "REP-RFP20230615-20230720-001", title: "ERP System RFP Compliance Analysis", type: "report" },
  { id: "2", referenceNumber: "REP-BID20230615-20230725-001", title: "TechPro Solutions Bid Evaluation", type: "report" },
  { id: "3", referenceNumber: "REP-RFP20230701-20230730-001", title: "Cybersecurity Assessment RFP Analysis", type: "report" },
  { id: "4", referenceNumber: "REP-BID20230622-20230805-001", title: "Network Systems Inc Bid Evaluation", type: "report" },
  { id: "5", referenceNumber: "REP-BID20230615-20230810-001", title: "ERP System Bid Comparison", type: "report" },
];

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: "compliance-agent",
    name: "Compliance AI Agent",
    description: "Analyzes documents for compliance with regulations and requirements",
    model: "GPT-4",
    provider: "openai",
    isActive: true,
  },
  {
    id: "evaluation-agent",
    name: "Evaluation AI Agent",
    description: "Evaluates bids against RFP requirements and scoring criteria",
    model: "GPT-4",
    provider: "openai",
    isActive: true,
  },
  {
    id: "comparative-agent",
    name: "Comparative AI Agent",
    description: "Compares multiple bids to identify strengths, weaknesses, and best value",
    model: "GPT-4",
    provider: "openai",
    isActive: true,
  },
];

// Mock data for AI models
const mockModels: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    description: "OpenAI GPT-4 model",
    isActive: true,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "OpenAI GPT-3.5 Turbo model",
    isActive: true,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Anthropic Claude 3 Opus model",
    isActive: true,
  },
  {
    id: "llama-3.1-70b",
    name: "Llama 3.1 70B",
    provider: "meta",
    description: "Meta Llama 3.1 70B model",
    isActive: true,
  },
];

// Mock report data
const mockReportData: Report = {
  id: "1",
  referenceNumber: "REP-RFP20230615-20230720-001",
  title: "ERP System RFP Compliance Analysis",
  type: "rfp-analysis",
  summary:
    "This RFP for Enterprise Resource Planning System is generally well-structured but has several compliance gaps...",
  score: 92,
  findings: [
    {
      category: "Data Security",
      compliance: "partial",
      description: "NIST 800-53 mentioned but revision not specified",
      recommendation: "Specify NIST 800-53 Revision 5 and control baseline",
      severity: "medium",
    },
    // ...
  ],
  recommendations:
    "The RFP should be updated to address the identified compliance issues before publication...",
  chatHistory: [
    {
      id: "1",
      role: "system",
      content:
        "I've analyzed the Enterprise Resource Planning System RFP document...",
      agent: "Compliance AI Agent",
      model: "GPT-4",
      provider: "openai",
      timestamp: "2023-07-20T10:30:00Z",
    },
    // ...
  ],
};

// Compliance color mapping
const complianceColors: Record<string, string> = {
  compliant: "bg-green-100 text-green-800",
  partial: "bg-yellow-100 text-yellow-800",
  "non-compliant": "bg-red-100 text-red-800",
};

// Severity color mapping
const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export default function AIAnalysisPage() {
  // State for document selection
  const [documentType, setDocumentType] = useState<"rfp" | "bid" | "report">("rfp");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);

  // State for analysis options
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(mockAgents[0]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(mockModels[0]);

  // State for chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State for report
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState("document-selection");

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Filter documents based on search query
  const filteredDocuments = () => {
    let documents: Document[] = [];

    switch (documentType) {
      case "rfp":
        documents = mockRFPs;
        break;
      case "bid":
        documents = mockBids;
        break;
      case "report":
        documents = mockReports;
        break;
    }

    if (!searchQuery) return documents;

    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle document selection
  const toggleDocumentSelection = (document: Document) => {
    if (selectedDocuments.some((doc) => doc.id === document.id)) {
      setSelectedDocuments(selectedDocuments.filter((doc) => doc.id !== document.id));
    } else {
      // For simplicity, we'll only allow one document at a time
      setSelectedDocuments([document]);
    }
  };

  // Handle agent selection
  const handleAgentSelection = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  // Handle model selection
  const handleModelSelection = (model: AIModel) => {
    setSelectedModel(model);
  };

  // Start analysis
  const startAnalysis = () => {
    if (selectedDocuments.length === 0 || !selectedAgent) return;

    setIsAnalyzing(true);

    // In a real app, call the backend API. For this demo, we simulate with setTimeout.
    setTimeout(() => {
      // Set chat title based on document reference number
      setChatTitle(`Analysis of ${selectedDocuments[0].referenceNumber}`);

      // Set initial chat message
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: `I've analyzed the ${selectedDocuments[0].title} document. What would you like to know about it?`,
        agent: selectedAgent.name,
        model: selectedModel?.name || "GPT-4",
        provider: selectedModel?.provider || "openai",
        timestamp: new Date().toISOString(),
      };

      setChatMessages([initialMessage]);
      setReport(mockReportData);
      setActiveTab("chat");
      setIsAnalyzing(false);
    }, 2000);
  };

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedAgent) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content:
          "Based on my analysis, the compliance score is 92%. Would you like me to elaborate on any specific finding?",
        agent: selectedAgent.name,
        model: selectedModel?.name || "GPT-4",
        provider: selectedModel?.provider || "openai",
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage, aiResponse]);
    }, 1000);
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Load chat history when report changes
  useEffect(() => {
    if (report) {
      setChatMessages(report.chatHistory);
    }
  }, [report]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Analysis</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="document-selection">Document Selection</TabsTrigger>
          <TabsTrigger value="analysis-options">Analysis Options</TabsTrigger>
          <TabsTrigger value="chat">Analysis &amp; Chat</TabsTrigger>
        </TabsList>

        {/* Document Selection Tab */}
        <TabsContent value="document-selection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Document</CardTitle>
              <CardDescription>Choose the document you want to analyze with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant={documentType === "rfp" ? "default" : "outline"}
                  onClick={() => setDocumentType("rfp")}
                >
                  RFPs
                </Button>
                <Button
                  variant={documentType === "bid" ? "default" : "outline"}
                  onClick={() => setDocumentType("bid")}
                >
                  Bids
                </Button>
                <Button
                  variant={documentType === "report" ? "default" : "outline"}
                  onClick={() => setDocumentType("report")}
                >
                  Reports
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${documentType.toUpperCase()}s...`}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {filteredDocuments().map((document) => (
                  <div
                    key={document.id}
                    className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                      selectedDocuments.some((doc) => doc.id === document.id) ? "bg-blue-50" : ""
                    }`}
                    onClick={() => toggleDocumentSelection(document)}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{document.title}</p>
                        <p className="text-sm text-muted-foreground">{document.referenceNumber}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.some((doc) => doc.id === document.id)}
                      onChange={() => {}}
                      className="h-4 w-4"
                    />
                  </div>
                ))}
                {filteredDocuments().length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">No documents found</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/${documentType}s`}>Browse All {documentType.toUpperCase()}s</Link>
              </Button>
              <Button
                onClick={() => setActiveTab("analysis-options")}
                disabled={selectedDocuments.length === 0}
              >
                Next: Choose Analysis Options
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analysis Options Tab */}
        <TabsContent value="analysis-options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Options</CardTitle>
              <CardDescription>
                Configure the AI agent and model for your analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Selected Document</h3>
                {selectedDocuments.length > 0 ? (
                  <div className="p-3 border rounded-md bg-blue-50">
                    <p className="font-medium">{selectedDocuments[0].title}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDocuments[0].referenceNumber}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No document selected</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Select AI Agent</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 ${
                        selectedAgent?.id === agent.id ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleAgentSelection(agent)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">{agent.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                      <div className="text-xs text-muted-foreground">
                        <span className="bg-gray-100 px-2 py-1 rounded">{agent.model}</span>
                        <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{agent.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Select AI Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockModels.map((model) => (
                    <div
                      key={model.id}
                      className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 ${
                        selectedModel?.id === model.id ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleModelSelection(model)}
                    >
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{model.description}</p>
                      <div className="text-xs text-muted-foreground">
                        <span className="bg-gray-100 px-2 py-1 rounded">{model.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("document-selection")}>
                Back: Document Selection
              </Button>
              <Button
                onClick={startAnalysis}
                disabled={!selectedAgent || selectedDocuments.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Start Analysis"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Chat with AI</CardTitle>
                <CardDescription>
                  {chatTitle || "Ask questions about the document"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={chatContainerRef}
                  className="h-[500px] overflow-y-auto p-4 space-y-4 border-t border-b"
                >
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <HelpCircle className="h-12 w-12 mb-4" />
                      <p>Select a document and start analysis to chat with AI</p>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.role === "system" && message.agent && (
                            <div className="flex items-center space-x-1 mb-1">
                              <Bot className="h-3 w-3" />
                              <span className="text-xs font-medium">{message.agent}</span>
                              {message.model && (
                                <span className="text-xs text-muted-foreground">
                                  ({message.model})
                                </span>
                              )}
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="text-xs mt-1 text-right opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={chatMessages.length === 0}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim() || chatMessages.length === 0}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Report</CardTitle>
                <CardDescription>
                  AI-generated insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {report ? (
                  <>
                    <div>
                      <h3 className="font-medium mb-1">Summary</h3>
                      <p className="text-sm text-muted-foreground">{report.summary}</p>
                    </div>

                    {report.score !== undefined && (
                      <div className="border rounded-md p-3 bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Compliance Score</h3>
                          <span className="text-lg font-bold">{report.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${report.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {report.findings && report.findings.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Key Findings</h3>
                        <div className="space-y-2">
                          {report.findings.map((finding, index) => (
                            <div key={index} className="border rounded-md p-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{finding.category}</span>
                                <div className="flex gap-1">
                                  <span
                                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${complianceColors[finding.compliance]}`}
                                  >
                                    {finding.compliance}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${severityColors[finding.severity]}`}
                                  >
                                    {finding.severity}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{finding.description}</p>
                              {finding.recommendation && (
                                <div className="flex items-start mt-1">
                                  <AlertTriangle className="h-3 w-3 text-amber-500 mr-1 mt-0.5" />
                                  <p className="text-xs text-amber-600">{finding.recommendation}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {report.recommendations && (
                      <div>
                        <h3 className="font-medium mb-1">Recommendations</h3>
                        <p className="text-sm text-muted-foreground">{report.recommendations}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mb-4" />
                    <p>Start analysis to see results</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {report && (
                  <>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button asChild>
                      <Link href={`/reports/${report.id}`}>View Full Report</Link>
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
