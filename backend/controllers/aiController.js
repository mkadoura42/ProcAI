const { validationResult } = require('express-validator');
const RFP = require('../models/RFP');
const Bid = require('../models/Bid');
const Report = require('../models/Report');
const Settings = require('../models/Settings');

/**
 * Analyze RFP for compliance
 * @route POST /api/ai/analyze-rfp
 * @access Private
 */
exports.analyzeRFP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rfpId } = req.body;

  try {
    // Find RFP
    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Get agent settings
    const agentSettings = await Settings.findOne({ category: 'ai-agents', key: 'compliance-agent' });

    if (!agentSettings || !agentSettings.value) {
      return res.status(400).json({ message: 'Agent settings not configured' });
    }

    const agent = typeof agentSettings.value === 'string' ? JSON.parse(agentSettings.value) : agentSettings.value;

    // Get provider and model from agent settings
    const provider = agent.provider || 'openai';
    const model = agent.model || 'GPT-4';
    const systemPrompt = agent.systemPrompt || 'You are a compliance analysis AI agent specialized in reviewing RFPs.';
    const temperature = agent.temperature || 0.3;
    const maxTokens = agent.maxTokens || 4000;

    // Get API settings for the selected provider
    const apiKeySettings = await Settings.findOne({ category: 'api', key: `${provider}_api_key` });

    if (!apiKeySettings || !apiKeySettings.value) {
      return res.status(400).json({ message: `${provider} API key not configured` });
    }

    // In a real implementation, this would call the appropriate AI API
    // For this demo, we'll simulate the AI analysis with mock data

    /*
    // Example of how the API call would be implemented based on provider:

    let analysisResult;

    switch (provider) {
      case 'openai':
        const openai = new OpenAI({
          apiKey: apiKeySettings.value
        });

        const openaiCompletion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: `Analyze the following RFP for compliance issues:\n\nTitle: ${rfp.title}\n\nDescription: ${rfp.description}\n\nRequirements: ${JSON.stringify(rfp.requirements)}\n\nCompliance Requirements: ${JSON.stringify(rfp.complianceRequirements)}`
            }
          ],
          temperature: temperature,
          max_tokens: maxTokens
        });

        analysisResult = openaiCompletion.choices[0].message.content;
        break;

      case 'deepseek':
        // Get DeepSeek API endpoint
        const deepseekEndpointSetting = await Settings.findOne({ category: 'api', key: 'deepseek_api_endpoint' });
        const deepseekEndpoint = deepseekEndpointSetting?.value || 'https://api.deepseek.com/v1';

        // Call DeepSeek API
        const deepseekResponse = await fetch(`${deepseekEndpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeySettings.value}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: `Analyze the following RFP for compliance issues:\n\nTitle: ${rfp.title}\n\nDescription: ${rfp.description}\n\nRequirements: ${JSON.stringify(rfp.requirements)}\n\nCompliance Requirements: ${JSON.stringify(rfp.complianceRequirements)}`
              }
            ],
            temperature: temperature,
            max_tokens: maxTokens
          })
        });

        const deepseekData = await deepseekResponse.json();
        analysisResult = deepseekData.choices[0].message.content;
        break;

      case 'llama':
        // Get Llama API endpoint
        const llamaEndpointSetting = await Settings.findOne({ category: 'api', key: 'llama_api_endpoint' });
        const llamaEndpoint = llamaEndpointSetting?.value || 'https://api.llama.com/v1';

        // Call Llama API
        const llamaResponse = await fetch(`${llamaEndpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeySettings.value}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: `Analyze the following RFP for compliance issues:\n\nTitle: ${rfp.title}\n\nDescription: ${rfp.description}\n\nRequirements: ${JSON.stringify(rfp.requirements)}\n\nCompliance Requirements: ${JSON.stringify(rfp.complianceRequirements)}`
              }
            ],
            temperature: temperature,
            max_tokens: maxTokens
          })
        });

        const llamaData = await llamaResponse.json();
        analysisResult = llamaData.choices[0].message.content;
        break;

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
    */

    // Mock analysis result
    const mockAnalysisResult = {
      title: `${rfp.title} - Compliance Analysis`,
      summary: `This RFP for ${rfp.title} is generally well-structured but has several compliance gaps that should be addressed before finalization. The document meets 92% of standard compliance requirements, with notable issues in data security specifications, accessibility standards, environmental compliance, vendor certification requirements, and SLA definitions.`,
      score: 92,
      findings: [
        {
          category: "Data Security",
          compliance: "partial",
          description: "NIST 800-53 mentioned but revision not specified",
          recommendation: "Specify NIST 800-53 Revision 5 and control baseline",
          severity: "medium"
        },
        {
          category: "Accessibility",
          compliance: "partial",
          description: "ADA mentioned but Section 508 not referenced",
          recommendation: "Add explicit Section 508 compliance requirements",
          severity: "high"
        },
        {
          category: "Environmental",
          compliance: "non-compliant",
          description: "Hardware disposal lacks e-waste regulation references",
          recommendation: "Add EPA guidelines for e-waste disposal",
          severity: "medium"
        },
        {
          category: "Vendor Certification",
          compliance: "partial",
          description: "ISO 27001 timing requirements unclear",
          recommendation: "Clarify certification timing requirements",
          severity: "low"
        },
        {
          category: "SLA Terms",
          compliance: "partial",
          description: "Response and resolution metrics undefined",
          recommendation: "Define specific response time metrics by severity",
          severity: "medium"
        }
      ],
      recommendations: "The RFP should be updated to address the identified compliance issues before publication. Particular attention should be paid to accessibility requirements and SLA definitions, which could significantly impact vendor responses and project success."
    };

    // Create a new report with the analysis results
    const report = new Report({
      title: mockAnalysisResult.title,
      type: 'rfp-analysis',
      relatedRFP: rfp._id,
      relatedRFPReference: rfp.referenceNumber,
      generatedBy: 'compliance-agent',
      aiModel: model,
      aiProvider: provider,
      summary: mockAnalysisResult.summary,
      content: JSON.stringify(mockAnalysisResult),
      score: mockAnalysisResult.score,
      findings: mockAnalysisResult.findings,
      recommendations: mockAnalysisResult.recommendations,
      chatHistory: [
        {
          role: 'system',
          content: `I've analyzed the ${rfp.title} RFP document. What would you like to know about it?`,
          agent: agent.name || 'Compliance AI Agent',
          model: model,
          provider: provider,
          timestamp: new Date()
        }
      ],
      createdBy: req.user.id
    });

    await report.save();

    res.json({
      message: 'RFP analysis completed successfully',
      report
    });
  } catch (error) {
    console.error('Analyze RFP error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Evaluate bid against RFP
 * @route POST /api/ai/evaluate-bid
 * @access Private
 */
exports.evaluateBid = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bidId } = req.body;

  try {
    // Find bid
    const bid = await Bid.findById(bidId).populate('rfp');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    if (!bid.rfp) {
      return res.status(400).json({ message: 'Bid is not associated with an RFP' });
    }

    // Get agent settings
    const agentSettings = await Settings.findOne({ category: 'ai-agents', key: 'evaluation-agent' });

    if (!agentSettings || !agentSettings.value) {
      return res.status(400).json({ message: 'Agent settings not configured' });
    }

    const agent = typeof agentSettings.value === 'string' ? JSON.parse(agentSettings.value) : agentSettings.value;

    // Get provider and model from agent settings
    const provider = agent.provider || 'openai';
    const model = agent.model || 'GPT-4';

    // Get API settings for the selected provider
    const apiKeySettings = await Settings.findOne({ category: 'api', key: `${provider}_api_key` });

    if (!apiKeySettings || !apiKeySettings.value) {
      return res.status(400).json({ message: `${provider} API key not configured` });
    }

    // In a real implementation, this would call the OpenAI API
    // For this demo, we'll simulate the AI analysis with mock data

    // Mock evaluation result
    const mockEvaluationResult = {
      title: `${bid.vendor.name} Bid Evaluation for ${bid.rfp.title}`,
      summary: `This bid from ${bid.vendor.name} for the ${bid.rfp.title} RFP demonstrates strong technical capabilities but has some pricing concerns. The vendor meets 85% of the requirements, with excellent responses in technical approach and implementation methodology. However, the total cost is 15% above the average of other bids, and there are some gaps in the proposed timeline.`,
      score: 85,
      technicalScore: 92,
      financialScore: 78,
      strengths: [
        "Comprehensive technical approach with detailed implementation plan",
        "Strong team with relevant experience in similar projects",
        "Excellent understanding of requirements and proposed solutions",
        "Robust quality assurance methodology"
      ],
      weaknesses: [
        "Total cost is 15% above average of other bids",
        "Timeline appears optimistic for some critical deliverables",
        "Limited details on post-implementation support"
      ],
      requirementCompliance: [
        {
          requirement: "Cloud-based infrastructure",
          compliance: "fully-compliant",
          notes: "Proposed AWS-based solution meets all specifications"
        },
        {
          requirement: "Data migration",
          compliance: "partially-compliant",
          notes: "Migration plan lacks details on handling legacy data formats"
        },
        {
          requirement: "24/7 Support",
          compliance: "fully-compliant",
          notes: "Comprehensive support plan with multiple tiers and response times"
        }
      ],
      recommendations: "This bid should be shortlisted for further consideration. Request clarification on pricing details and timeline assumptions before making a final decision. Consider negotiating on price and support terms."
    };

    // Create a new report with the evaluation results
    const report = new Report({
      title: mockEvaluationResult.title,
      type: 'bid-evaluation',
      relatedRFP: bid.rfp._id,
      relatedRFPReference: bid.rfpReferenceNumber,
      relatedBids: [bid._id],
      relatedBidReferences: [bid.referenceNumber],
      generatedBy: 'evaluation-agent',
      aiModel: model,
      aiProvider: provider,
      summary: mockEvaluationResult.summary,
      content: JSON.stringify(mockEvaluationResult),
      score: mockEvaluationResult.score,
      findings: mockEvaluationResult.requirementCompliance.map(item => ({
        category: item.requirement,
        compliance: item.compliance === 'fully-compliant' ? 'compliant' : 'partial',
        description: item.notes,
        recommendation: '',
        severity: 'medium'
      })),
      recommendations: mockEvaluationResult.recommendations,
      chatHistory: [
        {
          role: 'system',
          content: `I've evaluated the bid from ${bid.vendor.name} for the ${bid.rfp.title} RFP. What would you like to know about my analysis?`,
          agent: agent.name || 'Evaluation AI Agent',
          model: model,
          provider: provider,
          timestamp: new Date()
        }
      ],
      createdBy: req.user.id
    });

    await report.save();

    // Update bid with evaluation scores
    bid.technicalScore = mockEvaluationResult.technicalScore;
    bid.financialScore = mockEvaluationResult.financialScore;
    bid.strengths = mockEvaluationResult.strengths;
    bid.weaknesses = mockEvaluationResult.weaknesses;
    bid.status = 'under-review';
    bid.updatedBy = req.user.id;

    await bid.save();

    res.json({
      message: 'Bid evaluation completed successfully',
      report
    });
  } catch (error) {
    console.error('Evaluate bid error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Compare multiple bids for an RFP
 * @route POST /api/ai/compare-bids
 * @access Private
 */
exports.compareBids = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rfpId, bidIds } = req.body;

  try {
    // Check if at least 2 bids are provided
    if (!bidIds || bidIds.length < 2) {
      return res.status(400).json({ message: 'At least 2 bids are required for comparison' });
    }

    // Find RFP
    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Find bids
    const bids = await Bid.find({ _id: { $in: bidIds }, rfp: rfpId });

    if (bids.length !== bidIds.length) {
      return res.status(400).json({ message: 'One or more bids not found or not associated with the specified RFP' });
    }

    // Get agent settings
    const agentSettings = await Settings.findOne({ category: 'ai-agents', key: 'comparative-agent' });

    if (!agentSettings || !agentSettings.value) {
      return res.status(400).json({ message: 'Agent settings not configured' });
    }

    const agent = typeof agentSettings.value === 'string' ? JSON.parse(agentSettings.value) : agentSettings.value;

    // Get provider and model from agent settings
    const provider = agent.provider || 'openai';
    const model = agent.model || 'GPT-4';

    // Get API settings for the selected provider
    const apiKeySettings = await Settings.findOne({ category: 'api', key: `${provider}_api_key` });

    if (!apiKeySettings || !apiKeySettings.value) {
      return res.status(400).json({ message: `${provider} API key not configured` });
    }

    // In a real implementation, this would call the OpenAI API
    // For this demo, we'll simulate the AI analysis with mock data

    // Mock comparison result
    const mockComparisonResult = {
      title: `Bid Comparison for ${rfp.title}`,
      summary: `This analysis compares ${bids.length} bids for the ${rfp.title} RFP. TechPro Solutions offers the most technically sound proposal with excellent compliance to requirements, while Network Systems Inc. provides a more cost-effective solution but with some technical limitations. Based on the evaluation criteria, TechPro Solutions represents the best overall value despite a 12% higher price point.`,
      bidSummaries: bids.map((bid, index) => ({
        vendor: bid.vendor.name,
        totalAmount: bid.totalAmount,
        currency: bid.currency,
        technicalScore: 85 + (index * 5) % 15,
        financialScore: 90 - (index * 7) % 15,
        totalScore: 87 + (index * 3) % 10,
        keyStrengths: [
          "Strong technical approach",
          "Experienced team",
          index === 0 ? "Comprehensive implementation plan" : "Competitive pricing"
        ],
        keyWeaknesses: [
          index === 0 ? "Higher cost than competitors" : "Limited technical details",
          "Some timeline concerns"
        ]
      })),
      comparisonMatrix: [
        {
          criterion: "Technical Approach",
          weights: 30,
          scores: bids.map((bid, index) => ({
            vendor: bid.vendor.name,
            score: 8 + (index * 0.5) % 2,
            notes: index === 0 ? "Excellent detailed approach" : "Good but lacks some details"
          }))
        },
        {
          criterion: "Experience",
          weights: 20,
          scores: bids.map((bid, index) => ({
            vendor: bid.vendor.name,
            score: 7 + (index * 1.2) % 3,
            notes: "Demonstrated relevant experience"
          }))
        },
        {
          criterion: "Cost",
          weights: 25,
          scores: bids.map((bid, index) => ({
            vendor: bid.vendor.name,
            score: 9 - (index * 1) % 3,
            notes: index === 0 ? "Higher than average" : "Very competitive"
          }))
        },
        {
          criterion: "Timeline",
          weights: 15,
          scores: bids.map((bid, index) => ({
            vendor: bid.vendor.name,
            score: 8 + (index * 0.7) % 2,
            notes: "Reasonable timeline"
          }))
        },
        {
          criterion: "Support & Maintenance",
          weights: 10,
          scores: bids.map((bid, index) => ({
            vendor: bid.vendor.name,
            score: 7 + (index * 0.8) % 3,
            notes: index === 0 ? "Comprehensive support plan" : "Basic support included"
          }))
        }
      ],
      recommendations: `Based on the comparative analysis, ${bids[0].vendor.name} offers the best overall value despite the higher cost. Their technical approach and implementation methodology are superior, and they demonstrate a better understanding of the project requirements. If budget is a primary concern, ${bids[1].vendor.name} provides a viable alternative with a more competitive price point, though some technical compromises would need to be accepted.`
    };

    // Create a new report with the comparison results
    const report = new Report({
      title: mockComparisonResult.title,
      type: 'bid-comparison',
      relatedRFP: rfp._id,
      relatedRFPReference: rfp.referenceNumber,
      relatedBids: bids.map(bid => bid._id),
      relatedBidReferences: bids.map(bid => bid.referenceNumber),
      generatedBy: 'comparative-agent',
      aiModel: model,
      aiProvider: provider,
      summary: mockComparisonResult.summary,
      content: JSON.stringify(mockComparisonResult),
      score: Math.round((mockComparisonResult.bidSummaries.reduce((sum, bid) => sum + bid.totalScore, 0) / bids.length)),
      findings: mockComparisonResult.comparisonMatrix.map(criterion => ({
        category: criterion.criterion,
        compliance: 'compliant',
        description: `Weight: ${criterion.weights}%`,
        recommendation: criterion.scores.map(score => `${score.vendor}: ${score.score}/10 - ${score.notes}`).join('; '),
        severity: 'medium'
      })),
      recommendations: mockComparisonResult.recommendations,
      chatHistory: [
        {
          role: 'system',
          content: `I've compared ${bids.length} bids for the ${rfp.title} RFP. What would you like to know about my analysis?`,
          agent: agent.name || 'Comparative AI Agent',
          model: model,
          provider: provider,
          timestamp: new Date()
        }
      ],
      createdBy: req.user.id
    });

    await report.save();

    res.json({
      message: 'Bid comparison completed successfully',
      report
    });
  } catch (error) {
    console.error('Compare bids error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Chat with AI about a document
 * @route POST /api/ai/chat
 * @access Private
 */
exports.chatWithAI = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { reportId, message, agent } = req.body;

  try {
    // Find report
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has access to the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSharedWithUser = report.sharedWith.some(share => share.user.toString() === req.user.id);
    const isPublic = report.isPublic;

    if (!isOwner && !isAdmin && !isSharedWithUser && !isPublic) {
      return res.status(403).json({ message: 'You do not have permission to access this report' });
    }

    // Add user message to chat history
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    report.chatHistory.push(userMessage);

    // Get agent settings
    const agentId = agent || report.generatedBy;
    const agentSettings = await Settings.findOne({ category: 'ai-agents', key: agentId });

    if (!agentSettings || !agentSettings.value) {
      return res.status(400).json({ message: 'Agent settings not configured' });
    }

    const agentConfig = typeof agentSettings.value === 'string' ? JSON.parse(agentSettings.value) : agentSettings.value;

    // Get provider and model from agent settings
    const provider = agentConfig.provider || 'openai';
    const model = agentConfig.model || 'GPT-4';
    const systemPrompt = agentConfig.systemPrompt || `You are an AI assistant analyzing a ${report.type} report.`;
    const temperature = agentConfig.temperature || 0.3;
    const maxTokens = agentConfig.maxTokens || 4000;

    // Get API settings for the selected provider
    const apiKeySettings = await Settings.findOne({ category: 'api', key: `${provider}_api_key` });

    if (!apiKeySettings || !apiKeySettings.value) {
      return res.status(400).json({ message: `${provider} API key not configured` });
    }

    // In a real implementation, this would call the appropriate AI API
    // For this demo, we'll simulate the AI analysis with mock data

    /*
    // Example of how the API call would be implemented based on provider:

    let aiResponse;

    // Prepare context from report content
    const reportContent = JSON.parse(report.content);
    const context = `Report Title: ${report.title}\nSummary: ${report.summary}\nRecommendations: ${report.recommendations}`;

    // Prepare chat history for the API call
    const chatMessages = report.chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add system message with context
    chatMessages.unshift({
      role: "system",
      content: `${systemPrompt} Here is the context:\n\n${context}`
    });

    switch (provider) {
      case 'openai':
        const openai = new OpenAI({
          apiKey: apiKeySettings.value
        });

        const openaiCompletion = await openai.chat.completions.create({
          model: model,
          messages: chatMessages,
          temperature: temperature,
          max_tokens: maxTokens
        });

        aiResponse = openaiCompletion.choices[0].message.content;
        break;

      case 'deepseek':
        // Get DeepSeek API endpoint
        const deepseekEndpointSetting = await Settings.findOne({ category: 'api', key: 'deepseek_api_endpoint' });
        const deepseekEndpoint = deepseekEndpointSetting?.value || 'https://api.deepseek.com/v1';

        // Call DeepSeek API
        const deepseekResponse = await fetch(`${deepseekEndpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeySettings.value}`
          },
          body: JSON.stringify({
            model: model,
            messages: chatMessages,
            temperature: temperature,
            max_tokens: maxTokens
          })
        });

        const deepseekData = await deepseekResponse.json();
        aiResponse = deepseekData.choices[0].message.content;
        break;

      case 'llama':
        // Get Llama API endpoint
        const llamaEndpointSetting = await Settings.findOne({ category: 'api', key: 'llama_api_endpoint' });
        const llamaEndpoint = llamaEndpointSetting?.value || 'https://api.llama.com/v1';

        // Call Llama API
        const llamaResponse = await fetch(`${llamaEndpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeySettings.value}`
          },
          body: JSON.stringify({
            model: model,
            messages: chatMessages,
            temperature: temperature,
            max_tokens: maxTokens
          })
        });

        const llamaData = await llamaResponse.json();
        aiResponse = llamaData.choices[0].message.content;
        break;

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
    */

    // Mock AI response
    let aiResponse;
    let agentName;

    switch (agentId) {
      case 'compliance-agent':
        agentName = agentConfig.name || 'Compliance AI Agent';
        aiResponse = "Based on my analysis of the compliance issues in this document, I can provide more specific recommendations for addressing the gaps identified. Would you like me to focus on a particular area of concern, such as data security, accessibility standards, or SLA definitions?";
        break;
      case 'evaluation-agent':
        agentName = agentConfig.name || 'Evaluation AI Agent';
        aiResponse = "I've evaluated this bid against the RFP requirements and can provide more details on specific strengths and weaknesses. The technical approach is strong, but there are some pricing concerns that might need further negotiation. Would you like me to elaborate on any particular aspect of the evaluation?";
        break;
      case 'comparative-agent':
        agentName = agentConfig.name || 'Comparative AI Agent';
        aiResponse = "My comparison of the bids shows significant variations in technical approach and pricing. While one vendor offers superior technical capabilities, another provides better value for money. I can provide a more detailed breakdown of how each vendor performs against specific evaluation criteria if that would be helpful.";
        break;
      default:
        agentName = agentConfig.name || 'AI Agent';
        aiResponse = "I've analyzed the document and can provide insights based on the content. Please let me know what specific aspects you'd like me to elaborate on.";
    }

    // Add AI response to chat history
    const aiMessage = {
      role: 'system',
      content: aiResponse,
      agent: agentName,
      model: model,
      provider: provider,
      timestamp: new Date()
    };

    report.chatHistory.push(aiMessage);
    report.updatedBy = req.user.id;

    await report.save();

    res.json({
      message: 'Chat message processed successfully',
      response: aiMessage
    });
  } catch (error) {
    console.error('Chat with AI error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get AI agent settings
 * @route GET /api/ai/agents
 * @access Private
 */
exports.getAgentSettings = async (req, res) => {
  try {
    // Get agent settings from database
    const agentSettings = await Settings.find({ category: 'ai-agents' });

    // Get available models
    const modelsSettings = await Settings.findOne({ category: 'ai-models', key: 'available_models' });
    const availableModels = modelsSettings?.value || [];

    // If no settings found, return default settings
    if (!agentSettings || agentSettings.length === 0) {
      const defaultAgents = [
        {
          id: 'compliance-agent',
          name: 'Compliance AI Agent',
          description: 'Analyzes documents for compliance with regulations and requirements',
          model: 'GPT-4',
          provider: 'openai',
          systemPrompt: 'You are a compliance analysis AI agent specialized in reviewing RFPs and other procurement documents.',
          temperature: 0.3,
          maxTokens: 4000,
          isActive: true
        },
        {
          id: 'evaluation-agent',
          name: 'Evaluation AI Agent',
          description: 'Evaluates bids against RFP requirements and scoring criteria',
          model: 'GPT-4',
          provider: 'openai',
          systemPrompt: 'You are an evaluation AI agent specialized in analyzing bids against RFP requirements.',
          temperature: 0.2,
          maxTokens: 4000,
          isActive: true
        },
        {
          id: 'comparative-agent',
          name: 'Comparative AI Agent',
          description: 'Compares multiple bids to identify strengths, weaknesses, and best value',
          model: 'GPT-4',
          provider: 'openai',
          systemPrompt: 'You are a comparative analysis AI agent specialized in comparing multiple bids for an RFP.',
          temperature: 0.2,
          maxTokens: 4000,
          isActive: true
        }
      ];

      return res.json({
        agents: defaultAgents,
        models: [
          {
            id: 'gpt-4',
            name: 'GPT-4',
            provider: 'openai',
            description: 'OpenAI GPT-4 model',
            isActive: true
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            provider: 'openai',
            description: 'OpenAI GPT-3.5 Turbo model',
            isActive: true
          },
          {
            id: 'deepseek-r1',
            name: 'DeepSeek R1',
            provider: 'deepseek',
            description: 'DeepSeek R1 model',
            isActive: true
          },
          {
            id: 'llama-3.3-70b',
            name: 'Llama 3.3 70B',
            provider: 'llama',
            description: 'Llama 3.3 70B model',
            isActive: true
          }
        ]
      });
    }

    // Format agent settings
    const agents = agentSettings.map(setting => {
      const value = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      return {
        id: setting.key,
        name: value.name,
        description: value.description,
        model: value.model,
        provider: value.provider,
        systemPrompt: value.systemPrompt,
        temperature: value.temperature,
        maxTokens: value.maxTokens,
        isActive: value.isActive
      };
    });

    res.json({
      agents: agents,
      models: availableModels
    });
  } catch (error) {
    console.error('Get agent settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update AI agent settings
 * @route PUT /api/ai/agents/:agentId
 * @access Private/Admin
 */
exports.updateAgentSettings = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { agentId } = req.params;
  const { name, model, provider, systemPrompt, temperature, maxTokens, isActive } = req.body;

  try {
    // Find agent settings
    let agentSettings = await Settings.findOne({ category: 'ai-agents', key: agentId });

    if (!agentSettings) {
      // Create new agent settings if not found
      agentSettings = new Settings({
        category: 'ai-agents',
        key: agentId,
        value: JSON.stringify({
          name: name || `${agentId.charAt(0).toUpperCase() + agentId.slice(1).replace(/-/g, ' ')} Agent`,
          description: `AI agent for ${agentId.replace(/-/g, ' ')}`,
          model: model || 'GPT-4',
          provider: provider || 'openai',
          systemPrompt: systemPrompt || `You are an AI assistant for ${agentId.replace(/-/g, ' ')}.`,
          temperature: temperature || 0.3,
          maxTokens: maxTokens || 4000,
          isActive: isActive !== undefined ? isActive : true
        })
      });
    } else {
      // Update existing agent settings
      const value = typeof agentSettings.value === 'string' ? JSON.parse(agentSettings.value) : agentSettings.value;

      // Update only provided fields
      if (name) value.name = name;
      if (model) value.model = model;
      if (provider) value.provider = provider;
      if (systemPrompt) value.systemPrompt = systemPrompt;
      if (temperature !== undefined) value.temperature = temperature;
      if (maxTokens !== undefined) value.maxTokens = maxTokens;
      if (isActive !== undefined) value.isActive = isActive;

      agentSettings.value = JSON.stringify(value);
    }

    await agentSettings.save();

    res.json({
      message: 'Agent settings updated successfully',
      agent: {
        id: agentId,
        ...JSON.parse(agentSettings.value)
      }
    });
  } catch (error) {
    console.error('Update agent settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get available AI models
 * @route GET /api/ai/models
 * @access Private
 */
exports.getAvailableModels = async (req, res) => {
  try {
    // Get models settings from database
    const modelsSettings = await Settings.findOne({ category: 'ai-models', key: 'available_models' });

    // If no settings found, return default models
    if (!modelsSettings || !modelsSettings.value) {
      const defaultModels = [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          provider: 'openai',
          description: 'OpenAI GPT-4 model',
          isActive: true
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          provider: 'openai',
          description: 'OpenAI GPT-3.5 Turbo model',
          isActive: true
        },
        {
          id: 'deepseek-r1',
          name: 'DeepSeek R1',
          provider: 'deepseek',
          description: 'DeepSeek R1 model',
          isActive: true
        },
        {
          id: 'llama-3.3-70b',
          name: 'Llama 3.3 70B',
          provider: 'llama',
          description: 'Llama 3.3 70B model',
          isActive: true
        }
      ];

      return res.json({ models: defaultModels });
    }

    // Parse models settings
    const models = typeof modelsSettings.value === 'string' ? JSON.parse(modelsSettings.value) : modelsSettings.value;

    res.json({ models });
  } catch (error) {
    console.error('Get available models error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update AI model settings
 * @route PUT /api/ai/models/:modelId
 * @access Private/Admin
 */
exports.updateModelSettings = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { modelId } = req.params;
  const { name, provider, description, isActive } = req.body;

  try {
    // Get models settings
    let modelsSettings = await Settings.findOne({ category: 'ai-models', key: 'available_models' });

    let models = [];

    if (modelsSettings && modelsSettings.value) {
      models = typeof modelsSettings.value === 'string' ? JSON.parse(modelsSettings.value) : modelsSettings.value;
    } else {
      // Create new models settings if not found
      modelsSettings = new Settings({
        category: 'ai-models',
        key: 'available_models',
        value: JSON.stringify([])
      });
    }

    // Find model in the list
    const modelIndex = models.findIndex(model => model.id === modelId);

    if (modelIndex === -1) {
      // Add new model if not found
      models.push({
        id: modelId,
        name: name || modelId,
        provider: provider || 'openai',
        description: description || `AI model ${modelId}`,
        isActive: isActive !== undefined ? isActive : true
      });
    } else {
      // Update existing model
      if (name) models[modelIndex].name = name;
      if (provider) models[modelIndex].provider = provider;
      if (description) models[modelIndex].description = description;
      if (isActive !== undefined) models[modelIndex].isActive = isActive;
    }

    // Save updated models
    modelsSettings.value = JSON.stringify(models);
    await modelsSettings.save();

    res.json({
      message: 'Model settings updated successfully',
      model: models.find(model => model.id === modelId)
    });
  } catch (error) {
    console.error('Update model settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
