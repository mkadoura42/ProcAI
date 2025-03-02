import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  Brain,
  Upload,
  FileText,
  MessageSquare,
  Download,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

// Dummy data for demonstration
const existingDocuments = [
  {
    id: "doc-001",
    name: "ADNOC_Digital_RFP.pdf",
    type: "RFP",
    size: "2.4 MB",
    uploaded: "2024-02-28"
  },
  {
    id: "doc-002",
    name: "Tech_Proposal_v2.pdf",
    type: "Bid",
    size: "1.8 MB",
    uploaded: "2024-03-01"
  },
  {
    id: "doc-003",
    name: "Financial_Proposal.pdf",
    type: "Bid",
    size: "1.2 MB",
    uploaded: "2024-03-01"
  }
]

const chatHistory = [
  {
    role: "assistant",
    content: "Hello! I'm ready to help analyze your RFPs and bids. You can ask me specific questions about the documents or request a comparative analysis."
  },
  {
    role: "user",
    content: "Compare the technical approaches in the proposals"
  },
  {
    role: "assistant",
    content: "Based on the analysis of the technical proposals:\n\n1. Proposal A emphasizes cloud-native architecture with microservices\n2. Proposal B focuses on hybrid deployment with enhanced security\n3. Key differentiators:\n   - Scalability approach\n   - Technology stack\n   - Implementation timeline\n\nWould you like me to elaborate on any specific aspect?"
  }
]

const llmOptions = [
  { id: "gpt-4", name: "GPT-4", description: "Most capable model, best for complex analysis" },
  { id: "gpt-3.5", name: "GPT-3.5", description: "Fast and efficient for general analysis" },
  { id: "claude", name: "Claude", description: "Specialized in technical document analysis" }
]

export default function AIAnalysisPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">AI Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload documents or select existing ones for AI-powered analysis
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Column - Document Selection */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                <Input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx" 
                  multiple 
                />
              </div>

              {/* Existing Documents */}
              <div>
                <h3 className="text-sm font-medium mb-3">Existing Documents</h3>
                <div className="space-y-2">
                  {existingDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={doc.id}
                        className="rounded border-muted-foreground"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={doc.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {doc.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select LLM Model</label>
                <div className="space-y-2 mt-2">
                  {llmOptions.map((model) => (
                    <div
                      key={model.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={model.id}
                        name="llm-model"
                        className="mt-1"
                      />
                      <div>
                        <label
                          htmlFor={model.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {model.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {model.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                Start Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analysis & Chat */}
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-180px)]">
            <CardHeader>
              <CardTitle className="text-lg">Analysis & Chat Interface</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)]">
              <Tabs defaultValue="chat" className="h-full">
                <TabsList>
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="h-[calc(100%-2.5rem)] flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "assistant" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "assistant"
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." />
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="h-[calc(100%-2.5rem)]">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Compliance Check</h3>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">98% Compliant with Requirements</span>
                          </div>
                          <p className="text-sm mt-2">
                            Minor deviation in Section 3.2 regarding delivery timeline
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Key Findings</h3>
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg bg-yellow-50">
                            <div className="flex items-center gap-2 text-yellow-800">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Budget Considerations</span>
                            </div>
                            <p className="text-sm mt-2">
                              Proposed budget exceeds typical range by 15% but includes additional value-add services
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t">
                      <Button className="w-full flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Generate PDF Report
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
