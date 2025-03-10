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

    // Get API settings
    const apiSettings = await Settings.findOne({ category: 'api', key: 'openai_api_key' });

    if (!apiSettings || !apiSettings.value) {
      return res.status(400).json({ message: 'API key not configured' });
    }

    // In a real implementation, this would call the OpenAI API
    // For this demo, we'll simulate the AI analysis with mock data

    /*
    // Example of how the OpenAI API call would be implemented:

    const openai = new OpenAI({
      apiKey: apiSettings.value
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a compliance analysis AI agent specialized in reviewing RFPs."
        },
        {
          role: "user",
          content: `Analyze the following RFP for compliance issues:\n\nTitle: ${rfp.title}\n\nDescription: ${rfp.description}\n\nRequirements: ${JSON.stringify(rfp.requirements)}\n\nCompliance Requirements: ${JSON.stringify(rfp.complianceRequirements)}`
        }
      ]
    });

    const analysisResult = completion.choices[0].message.content;
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
      aiModel: 'GPT-4',
      summary: mockAnalysisResult.summary,
      content: JSON.stringify(mockAnalysisResult),
      score: mockAnalysisResult.score,
      findings: mockAnalysisResult.findings,
      recommendations: mockAnalysisResult.recommendations,
      chatHistory: [
        {
          role: 'system',
          content: `I've analyzed the ${rfp.title} RFP document. What would you like to know about it?`,
          agent: 'Compliance AI Agent',
          model: 'GPT-4',
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

    // Get API settings
    const apiSettings = await Settings.findOne({ category: 'api', key: 'openai_api_key' });

    if (!apiSettings || !apiSettings.value) {
      return res.status(400).json({ message: 'API key not configured' });
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
      aiModel: 'GPT-4',
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
          agent: 'Evaluation AI Agent',
          model: 'GPT-4',
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

    // Get API settings
    const apiSettings = await Settings.findOne({ category: 'api', key: 'openai_api_key' });

    if (!apiSettings || !apiSettings.value) {
      return res.status(400).json({ message: 'API key not configured' });
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
      aiModel: 'GPT-4',
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
          agent: 'Comparative AI Agent',
          model: 'GPT-4',
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

    // Get API settings
    const apiSettings = await Settings.findOne({ category: 'api', key: 'openai_api_key' });

    if (!apiSettings || !apiSettings.value) {
      return res.status(400).json({ message: 'API key not configured' });
    }

    // Add user message to chat history
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    report.chatHistory.push(userMessage);

    // In a real implementation, this would call the OpenAI API
    // For this demo, we'll simulate the AI response with mock data

    /*
    // Example of how the OpenAI API call would be implemented:

    const openai = new OpenAI({
      apiKey: apiSettings.value
    });

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
      content: `You are an AI assistant analyzing a ${report.type} report. Here is the context:\n\n${context}`
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessages
    });

    const aiResponse = completion.choices[0].message.content;
    */

    // Mock AI response
    let aiResponse;
    const selectedAgent = agent || report.generatedBy;
    let agentName;

    switch (selectedAgent) {
      case 'compliance-agent':
        agentName = 'Compliance AI Agent';
        aiResponse = "Based on my analysis of the compliance issues in this document, I can provide more specific recommendations for addressing the gaps identified. Would you like me to focus on a particular area of concern, such as data security, accessibility standards, or SLA definitions?";
        break;
      case 'evaluation-agent':
        agentName = 'Evaluation AI Agent';
        aiResponse = "I've evaluated this bid against the RFP requirements and can provide more details on specific strengths and weaknesses. The technical approach is strong, but there are some pricing concerns that might need further negotiation. Would you like me to elaborate on any particular aspect of the evaluation?";
        break;
      case 'comparative-agent':
        agentName = 'Comparative AI Agent';
        aiResponse = "My comparison of the bids shows significant variations in technical approach and pricing. While one vendor offers superior technical capabilities, another provides better value for money. I can provide a more detailed breakdown of how each vendor performs against specific evaluation criteria if that would be helpful.";
        break;
      default:
        agentName = 'AI Agent';
        aiResponse = "I've analyzed the document and can provide insights based on the content. Please let me know what specific aspects you'd like me to elaborate on.";
    }

    // Add AI response to chat history
    const aiMessage = {
      role: 'system',
      content: aiResponse,
      agent: agentName,
      model: 'GPT-4',
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

    // If no settings found, return default settings
    if (!agentSettings || agentSettings.length === 0) {
      const defaultAgents = [
        {
          id: 'compliance-agent',
          name: 'Compliance AI Agent',
          description: 'Analyzes documents for compliance with regulations and requirements',
          model: 'GPT-4',
          isActive: true
        },
        {
          id: 'evaluation-agent',
          name: 'Evaluation AI Agent',
          description: 'Evaluates bids against RFP requirements and scoring criteria',
          model: 'GPT-4',
          isActive: true
        },
        {
          id: 'comparative-agent',
          name: 'Comparative AI Agent',
          description: 'Compares multiple bids to identify strengths, weaknesses, and best value',
          model: 'GPT-4',
          isActive: true
        }
      ];

      return res.json(defaultAgents);
    }

    // Format agent settings
    const agents = agentSettings.map(setting => {
      const value = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      return {
        id: setting.key,
        name: value.name,
        description: value.description,
        model: value.model,
        isActive: value.isActive
      };
    });

    res.json(agents);
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

  const { name, description, model, isActive } = req.body;
  const { agentId } = req.params;

  try {
    // Find agent settings
    let agentSettings = await Settings.findOne({ category: 'ai-agents', key: agentId });

    // If agent settings not found, create new settings
    if (!agentSettings) {
      agentSettings = new Settings({
        category: 'ai-agents',
        key: agentId,
        value: {
          name: name || agentId,
          description: description || '',
          model: model || 'GPT-4',
          isActive: isActive !== undefined ? isActive : true
        },
        updatedBy: req.user.id
      });
    } else {
      // Update existing settings
      const value = typeof agentSettings.value === 'string' ? JSON.parse(agentSettings.value) : agentSettings.value;

      agentSettings.value = {
        ...value,
        name: name || value.name,
        description: description || value.description,
        model: model || value.model,
        isActive: isActive !== undefined ? isActive : value.isActive
      };

      agentSettings.updatedBy = req.user.id;
    }

    await agentSettings.save();

    res.json({
      message: 'Agent settings updated successfully',
      agent: {
        id: agentId,
        name: agentSettings.value.name,
        description: agentSettings.value.description,
        model: agentSettings.value.model,
        isActive: agentSettings.value.isActive
      }
    });
  } catch (error) {
    console.error('Update agent settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
