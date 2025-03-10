require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const RFP = require('./models/RFP');
const Bid = require('./models/Bid');
const Report = require('./models/Report');
const Settings = require('./models/Settings');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/procai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@procai.com',
    password: 'password123',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    isActive: true
  },
  {
    name: 'Manager User',
    email: 'manager@procai.com',
    password: 'password123',
    role: 'manager',
    department: 'Procurement',
    position: 'Procurement Manager',
    isActive: true
  },
  {
    name: 'Viewer User',
    email: 'viewer@procai.com',
    password: 'password123',
    role: 'viewer',
    department: 'Finance',
    position: 'Financial Analyst',
    isActive: true
  }
];

const rfps = [
  {
    title: 'Enterprise Resource Planning (ERP) System Implementation',
    description: 'Seeking proposals for the implementation of a comprehensive ERP system to streamline business processes, improve data management, and enhance operational efficiency across all departments.',
    client: 'Internal IT Department',
    status: 'active',
    category: 'Software',
    budget: 500000,
    currency: 'USD',
    referenceNumber: 'RFP-20231215-001',
    submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    requirements: [
      {
        title: 'Financial Management',
        description: 'Must include general ledger, accounts payable/receivable, budgeting, and financial reporting modules.',
        priority: 'high'
      },
      {
        title: 'Human Resources',
        description: 'Must include employee management, payroll, benefits administration, and performance evaluation modules.',
        priority: 'high'
      },
      {
        title: 'Supply Chain Management',
        description: 'Must include procurement, inventory management, and supplier relationship management modules.',
        priority: 'medium'
      },
      {
        title: 'Customer Relationship Management',
        description: 'Must include contact management, sales tracking, and customer service modules.',
        priority: 'medium'
      },
      {
        title: 'Cloud-based Solution',
        description: 'The system must be cloud-based with secure access from anywhere.',
        priority: 'critical'
      }
    ],
    complianceRequirements: [
      {
        title: 'Data Security',
        description: 'Must comply with NIST 800-53 security controls and include encryption for data at rest and in transit.',
        isRequired: true
      },
      {
        title: 'Accessibility',
        description: 'Must comply with ADA and Section 508 accessibility requirements.',
        isRequired: true
      },
      {
        title: 'Audit Trail',
        description: 'Must maintain a comprehensive audit trail for all transactions and system changes.',
        isRequired: true
      }
    ],
    evaluationCriteria: [
      {
        name: 'Technical Approach',
        description: 'Evaluation of the proposed technical solution and implementation methodology.',
        weight: 30
      },
      {
        name: 'Experience & Qualifications',
        description: 'Evaluation of vendor experience with similar projects and qualifications of key personnel.',
        weight: 25
      },
      {
        name: 'Cost',
        description: 'Evaluation of total cost of ownership, including implementation, licensing, and ongoing support.',
        weight: 25
      },
      {
        name: 'Timeline',
        description: 'Evaluation of proposed implementation timeline and project management approach.',
        weight: 10
      },
      {
        name: 'Support & Maintenance',
        description: 'Evaluation of proposed support and maintenance services.',
        weight: 10
      }
    ],
    tags: ['ERP', 'Software', 'IT', 'Implementation']
  },
  {
    title: 'Office Renovation Project',
    description: 'Seeking proposals for the renovation of our main office space (25,000 sq ft) to create a modern, collaborative work environment that reflects our company culture and enhances employee productivity.',
    client: 'Facilities Management',
    status: 'published',
    category: 'Construction',
    budget: 750000,
    currency: 'USD',
    referenceNumber: 'RFP-20231215-002',
    submissionDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    endDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000), // 9 months from now
    requirements: [
      {
        title: 'Space Planning',
        description: 'Redesign of office layout to include open collaborative areas, private meeting rooms, and focus spaces.',
        priority: 'high'
      },
      {
        title: 'Furniture & Fixtures',
        description: 'Selection and installation of ergonomic furniture, lighting, and fixtures.',
        priority: 'high'
      },
      {
        title: 'Technology Infrastructure',
        description: 'Upgrade of network cabling, Wi-Fi, and audiovisual systems.',
        priority: 'medium'
      },
      {
        title: 'Sustainability',
        description: 'Use of sustainable materials and energy-efficient systems.',
        priority: 'medium'
      }
    ],
    complianceRequirements: [
      {
        title: 'Building Codes',
        description: 'Must comply with all local building codes and regulations.',
        isRequired: true
      },
      {
        title: 'ADA Compliance',
        description: 'Must comply with ADA accessibility requirements.',
        isRequired: true
      },
      {
        title: 'Insurance',
        description: 'Contractor must maintain appropriate insurance coverage.',
        isRequired: true
      }
    ],
    evaluationCriteria: [
      {
        name: 'Design Approach',
        description: 'Evaluation of the proposed design concept and alignment with company culture.',
        weight: 30
      },
      {
        name: 'Experience',
        description: 'Evaluation of contractor experience with similar office renovation projects.',
        weight: 20
      },
      {
        name: 'Cost',
        description: 'Evaluation of total project cost and value for money.',
        weight: 25
      },
      {
        name: 'Timeline',
        description: 'Evaluation of proposed project timeline and phasing approach.',
        weight: 15
      },
      {
        name: 'Sustainability',
        description: 'Evaluation of sustainable design and construction practices.',
        weight: 10
      }
    ],
    tags: ['Renovation', 'Construction', 'Office', 'Facilities']
  },
  {
    title: 'Cybersecurity Assessment and Enhancement',
    description: 'Seeking proposals for a comprehensive cybersecurity assessment of our IT infrastructure and implementation of recommended security enhancements to protect against evolving threats.',
    client: 'Information Security Department',
    status: 'draft',
    category: 'IT Security',
    budget: 200000,
    currency: 'USD',
    referenceNumber: 'RFP-20231215-003',
    submissionDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    startDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
    endDate: new Date(Date.now() + 130 * 24 * 60 * 60 * 1000), // 130 days from now
    requirements: [
      {
        title: 'Security Assessment',
        description: 'Comprehensive assessment of network, systems, applications, and data security.',
        priority: 'critical'
      },
      {
        title: 'Penetration Testing',
        description: 'Internal and external penetration testing to identify vulnerabilities.',
        priority: 'high'
      },
      {
        title: 'Security Enhancements',
        description: 'Implementation of recommended security controls and technologies.',
        priority: 'high'
      },
      {
        title: 'Security Training',
        description: 'Development and delivery of security awareness training for employees.',
        priority: 'medium'
      }
    ],
    complianceRequirements: [
      {
        title: 'Industry Standards',
        description: 'Assessment and recommendations must align with NIST Cybersecurity Framework and ISO 27001.',
        isRequired: true
      },
      {
        title: 'Regulatory Compliance',
        description: 'Must address compliance with relevant regulations (GDPR, CCPA, etc.).',
        isRequired: true
      },
      {
        title: 'Confidentiality',
        description: 'Must maintain strict confidentiality of all information accessed during the assessment.',
        isRequired: true
      }
    ],
    evaluationCriteria: [
      {
        name: 'Technical Expertise',
        description: 'Evaluation of the vendor\'s cybersecurity expertise and certifications.',
        weight: 35
      },
      {
        name: 'Methodology',
        description: 'Evaluation of the proposed assessment and implementation methodology.',
        weight: 25
      },
      {
        name: 'Experience',
        description: 'Evaluation of vendor experience with similar cybersecurity projects.',
        weight: 20
      },
      {
        name: 'Cost',
        description: 'Evaluation of project cost and value for money.',
        weight: 15
      },
      {
        name: 'Timeline',
        description: 'Evaluation of proposed project timeline.',
        weight: 5
      }
    ],
    tags: ['Cybersecurity', 'IT Security', 'Assessment', 'Implementation']
  }
];

const bids = [
  {
    vendor: {
      name: 'TechPro Solutions',
      contactPerson: 'John Smith',
      email: 'john.smith@techpro.com',
      phone: '555-123-4567',
      address: '123 Tech Blvd, San Francisco, CA 94105',
      website: 'www.techprosolutions.com'
    },
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'under-review',
    totalAmount: 475000,
    currency: 'USD',
    proposedStartDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000), // 65 days from now
    proposedEndDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000), // 350 days from now
    technicalScore: 92,
    financialScore: 85,
    responseToRequirements: [
      {
        requirementId: 'Financial Management',
        response: 'Our ERP solution includes a comprehensive financial management module with general ledger, AP/AR, budgeting, and advanced financial reporting capabilities.',
        complianceLevel: 'fully-compliant',
        notes: 'Includes additional features like multi-currency support and tax management.'
      },
      {
        requirementId: 'Human Resources',
        response: 'Our HR module covers all required functionality including employee management, payroll, benefits administration, and performance evaluation.',
        complianceLevel: 'fully-compliant',
        notes: 'Also includes recruitment and onboarding features.'
      },
      {
        requirementId: 'Supply Chain Management',
        response: 'Our SCM module includes procurement, inventory management, and supplier relationship management capabilities.',
        complianceLevel: 'fully-compliant',
        notes: 'Includes advanced features like demand forecasting and automated replenishment.'
      },
      {
        requirementId: 'Customer Relationship Management',
        response: 'Our CRM module includes contact management, sales tracking, and customer service capabilities.',
        complianceLevel: 'fully-compliant',
        notes: 'Also includes marketing automation and customer analytics.'
      },
      {
        requirementId: 'Cloud-based Solution',
        response: 'Our solution is fully cloud-based with secure access from anywhere via web browser or mobile app.',
        complianceLevel: 'fully-compliant',
        notes: 'Hosted on AWS with 99.9% uptime guarantee.'
      }
    ],
    strengths: [
      'Comprehensive solution covering all required modules',
      'Strong technical approach with proven implementation methodology',
      'Experienced team with relevant industry expertise',
      'Robust training and support offerings',
      'Competitive pricing'
    ],
    weaknesses: [
      'Timeline slightly longer than some competitors',
      'Some customization limitations in the HR module'
    ],
    risks: [
      {
        description: 'Data migration complexity',
        severity: 'medium',
        mitigationPlan: 'Detailed data migration plan with multiple validation checkpoints'
      },
      {
        description: 'User adoption challenges',
        severity: 'medium',
        mitigationPlan: 'Comprehensive change management and training program'
      }
    ]
  },
  {
    vendor: {
      name: 'Renovate Masters',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@renovatemasters.com',
      phone: '555-987-6543',
      address: '456 Builder Ave, Chicago, IL 60601',
      website: 'www.renovatemasters.com'
    },
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    status: 'received',
    totalAmount: 720000,
    currency: 'USD',
    proposedStartDate: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000), // 95 days from now
    proposedEndDate: new Date(Date.now() + 260 * 24 * 60 * 60 * 1000), // 260 days from now
    responseToRequirements: [
      {
        requirementId: 'Space Planning',
        response: 'Our design team will create a modern office layout with a mix of collaborative areas, meeting rooms, and focus spaces based on your specific needs and company culture.',
        complianceLevel: 'fully-compliant',
        notes: 'We will conduct employee surveys and workshops to inform the design process.'
      },
      {
        requirementId: 'Furniture & Fixtures',
        response: 'We will select and install ergonomic furniture, energy-efficient lighting, and modern fixtures that align with your brand and enhance employee comfort and productivity.',
        complianceLevel: 'fully-compliant',
        notes: 'We partner with leading furniture manufacturers to provide competitive pricing.'
      },
      {
        requirementId: 'Technology Infrastructure',
        response: 'We will upgrade network cabling, Wi-Fi, and audiovisual systems to support modern workplace technology needs.',
        complianceLevel: 'partially-compliant',
        notes: 'We will partner with your IT team or a specialized subcontractor for some aspects of the technology implementation.'
      },
      {
        requirementId: 'Sustainability',
        response: 'We will use sustainable materials, energy-efficient systems, and environmentally friendly construction practices throughout the project.',
        complianceLevel: 'fully-compliant',
        notes: 'Our team includes LEED-certified professionals who will ensure sustainable design and construction.'
      }
    ]
  },
  {
    vendor: {
      name: 'SecureNet Consulting',
      contactPerson: 'Michael Chen',
      email: 'mchen@securenet.com',
      phone: '555-789-0123',
      address: '789 Security St, Boston, MA 02110',
      website: 'www.securenetconsulting.com'
    },
    submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'received',
    totalAmount: 195000,
    currency: 'USD',
    proposedStartDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 days from now
    proposedEndDate: new Date(Date.now() + 125 * 24 * 60 * 60 * 1000), // 125 days from now
    responseToRequirements: [
      {
        requirementId: 'Security Assessment',
        response: 'We will conduct a comprehensive assessment of your network, systems, applications, and data security using our proven methodology and industry-standard tools.',
        complianceLevel: 'fully-compliant',
        notes: 'Our assessment will include both automated scanning and manual testing by certified security professionals.'
      },
      {
        requirementId: 'Penetration Testing',
        response: 'We will perform internal and external penetration testing to identify vulnerabilities in your infrastructure, applications, and security controls.',
        complianceLevel: 'fully-compliant',
        notes: 'Our team includes certified ethical hackers with experience in a wide range of penetration testing scenarios.'
      },
      {
        requirementId: 'Security Enhancements',
        response: 'Based on the assessment findings, we will implement recommended security controls and technologies to address identified vulnerabilities and enhance your security posture.',
        complianceLevel: 'fully-compliant',
        notes: 'We will prioritize recommendations based on risk level and work with your team to develop an implementation roadmap.'
      },
      {
        requirementId: 'Security Training',
        response: 'We will develop and deliver customized security awareness training for your employees, focusing on practical skills and behaviors to enhance your human firewall.',
        complianceLevel: 'fully-compliant',
        notes: 'Our training includes phishing simulations and role-based modules for different employee groups.'
      }
    ]
  },
  {
    vendor: {
      name: 'Enterprise Systems Inc.',
      contactPerson: 'Lisa Wong',
      email: 'lwong@enterprisesys.com',
      phone: '555-456-7890',
      address: '321 Enterprise Way, Seattle, WA 98101',
      website: 'www.enterprisesystemsinc.com'
    },
    submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: 'under-review',
    totalAmount: 520000,
    currency: 'USD',
    proposedStartDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    proposedEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days from now
    technicalScore: 88,
    financialScore: 82,
    responseToRequirements: [
      {
        requirementId: 'Financial Management',
        response: 'Our ERP solution includes a robust financial management module with all required functionality and advanced reporting capabilities.',
        complianceLevel: 'fully-compliant',
        notes: 'Includes integration with major banks and payment processors.'
      },
      {
        requirementId: 'Human Resources',
        response: 'Our HR module includes comprehensive employee management, payroll, benefits administration, and performance evaluation features.',
        complianceLevel: 'fully-compliant',
        notes: 'Includes advanced analytics and workforce planning tools.'
      },
      {
        requirementId: 'Supply Chain Management',
        response: 'Our SCM module includes procurement, inventory management, and supplier relationship management with advanced analytics.',
        complianceLevel: 'partially-compliant',
        notes: 'Some advanced features require additional modules at extra cost.'
      },
      {
        requirementId: 'Customer Relationship Management',
        response: 'Our CRM module includes all required functionality with advanced customer analytics and segmentation capabilities.',
        complianceLevel: 'fully-compliant',
        notes: 'Includes integration with major marketing automation platforms.'
      },
      {
        requirementId: 'Cloud-based Solution',
        response: 'Our solution is fully cloud-based with secure access from anywhere and comprehensive mobile support.',
        complianceLevel: 'fully-compliant',
        notes: 'Hosted on Microsoft Azure with geo-redundant backups.'
      }
    ],
    strengths: [
      'Strong financial and HR modules',
      'Excellent reporting and analytics capabilities',
      'Robust security features',
      'Comprehensive implementation methodology',
      'Strong customer references'
    ],
    weaknesses: [
      'Higher total cost than some competitors',
      'Some SCM features require additional modules',
      'Longer implementation timeline'
    ],
    risks: [
      {
        description: 'Integration complexity with legacy systems',
        severity: 'high',
        mitigationPlan: 'Detailed integration assessment and planning phase'
      },
      {
        description: 'Resource availability for implementation',
        severity: 'medium',
        mitigationPlan: 'Flexible resource allocation and knowledge transfer approach'
      }
    ]
  }
];

const reports = [
  {
    title: 'ERP System RFP Compliance Analysis',
    type: 'rfp-analysis',
    generatedBy: 'compliance-agent',
    aiModel: 'GPT-4',
    status: 'final',
    summary: 'This analysis evaluates the Enterprise Resource Planning (ERP) System Implementation RFP for compliance with industry standards and best practices. The RFP is generally well-structured but has several areas that could be improved to ensure better vendor responses and project outcomes.',
    content: JSON.stringify({
      overview: 'The ERP System Implementation RFP covers the essential requirements for a comprehensive ERP solution, including financial management, human resources, supply chain management, and customer relationship management modules. The RFP includes evaluation criteria, compliance requirements, and a clear timeline for the procurement process.',
      strengths: [
        'Comprehensive requirements covering all major ERP modules',
        'Clear evaluation criteria with appropriate weightings',
        'Well-defined compliance requirements for data security and accessibility',
        'Reasonable timeline for vendor responses and implementation'
      ],
      weaknesses: [
        'Some technical specifications lack sufficient detail',
        'Integration requirements with existing systems are not fully specified',
        'Performance metrics and SLAs could be more clearly defined',
        'Training and knowledge transfer requirements need more detail'
      ],
      recommendations: [
        'Add more specific technical requirements for each module',
        'Include detailed integration requirements for existing systems',
        'Define specific performance metrics and SLAs',
        'Expand training and knowledge transfer requirements',
        'Add more detail on data migration expectations'
      ]
    }),
    score: 85,
    findings: [
      {
        category: 'Requirements Clarity',
        compliance: 'partial',
        description: 'Some requirements lack sufficient detail for vendors to provide accurate responses',
        recommendation: 'Add more specific technical requirements for each module',
        severity: 'medium'
      },
      {
        category: 'Integration Requirements',
        compliance: 'partial',
        description: 'Integration requirements with existing systems are not fully specified',
        recommendation: 'Include detailed integration requirements for existing systems',
        severity: 'high'
      },
      {
        category: 'Performance Metrics',
        compliance: 'partial',
        description: 'Performance metrics and SLAs could be more clearly defined',
        recommendation: 'Define specific performance metrics and SLAs',
        severity: 'medium'
      },
      {
        category: 'Training Requirements',
        compliance: 'partial',
        description: 'Training and knowledge transfer requirements need more detail',
        recommendation: 'Expand training and knowledge transfer requirements',
        severity: 'medium'
      },
      {
        category: 'Data Migration',
        compliance: 'partial',
        description: 'Data migration expectations are not clearly defined',
        recommendation: 'Add more detail on data migration expectations',
        severity: 'high'
      }
    ],
    recommendations: 'The RFP should be revised to address the identified issues before publication. Particular attention should be paid to integration requirements and data migration expectations, as these are critical factors for ERP implementation success. Adding more specific technical requirements and performance metrics will help vendors provide more accurate and comparable responses.',
    chatHistory: [
      {
        role: 'system',
        content: 'I\'ve analyzed the ERP System Implementation RFP for compliance with industry standards and best practices. How can I help you understand the findings?',
        agent: 'Compliance AI Agent',
        model: 'GPT-4',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      },
      {
        role: 'user',
        content: 'What are the most critical issues that need to be addressed?',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      },
      {
        role: 'system',
        content: 'The most critical issues that need to be addressed are:\n\n1. Integration requirements with existing systems are not fully specified. This could lead to significant challenges during implementation if vendors don\'t have a clear understanding of the integration points and requirements.\n\n2. Data migration expectations are not clearly defined. Data migration is often one of the most complex and risky aspects of ERP implementation, so clear expectations are essential.\n\n3. Some technical specifications lack sufficient detail, which may result in vendors making assumptions that don\'t align with your actual needs.\n\nAddressing these issues before publishing the RFP will help ensure that you receive more accurate and comparable vendor responses, which will facilitate a better selection process and ultimately a more successful implementation.',
        agent: 'Compliance AI Agent',
        model: 'GPT-4',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ],
    tags: ['ERP', 'RFP Analysis', 'Compliance']
  },
  {
    title: 'TechPro Solutions Bid Evaluation',
    type: 'bid-evaluation',
    generatedBy: 'evaluation-agent',
    aiModel: 'GPT-4',
    status: 'final',
    summary: 'This evaluation assesses the bid from TechPro Solutions for the Enterprise Resource Planning (ERP) System Implementation RFP. The vendor demonstrates strong technical capabilities and a comprehensive understanding of the requirements, with a competitive price point and reasonable implementation timeline.',
    content: JSON.stringify({
      overview: 'TechPro Solutions has submitted a comprehensive proposal for the ERP System Implementation project, covering all required modules and functionality. The vendor has a strong track record of successful ERP implementations in similar organizations and has proposed an experienced team for this project.',
      technicalEvaluation: {
        score: 92,
        strengths: [
          'Comprehensive solution covering all required modules',
          'Strong technical approach with proven implementation methodology',
          'Robust security features and compliance with data protection requirements',
          'Excellent reporting and analytics capabilities',
          'Comprehensive training and support offerings'
        ],
        weaknesses: [
          'Some customization limitations in the HR module',
          'Mobile app has limited offline capabilities'
        ]
      },
      financialEvaluation: {
        score: 85,
        analysis: 'The total bid amount of $475,000 is competitive and within the budget range. The cost breakdown is reasonable, with appropriate allocations for software licenses, implementation services, training, and ongoing support. The payment schedule is aligned with project milestones and deliverables.'
      },
      implementationApproach: {
        timeline: '11.5 months',
        methodology: 'Agile implementation approach with phased rollout by module',
        resources: 'Experienced team with relevant industry expertise and certifications',
        risks: [
          'Data migration complexity',
          'User adoption challenges'
        ],
        mitigationStrategies: [
          'Detailed data migration plan with multiple validation checkpoints',
          'Comprehensive change management and training program'
        ]
      },
      complianceAssessment: {
        dataSecurityCompliance: 'Fully compliant with NIST 800-53 security controls',
        accessibilityCompliance: 'Fully compliant with ADA and Section 508 requirements',
        auditTrailCompliance: 'Comprehensive audit trail for all transactions and system changes'
      }
    }),
    score: 89,
    findings: [
      {
        category: 'Technical Solution',
        compliance: 'compliant',
        description: 'The proposed solution meets all technical requirements with a comprehensive set of modules and functionality.',
        recommendation: 'Verify customization capabilities in the HR module during vendor demonstrations.',
        severity: 'low'
      },
      {
        category: 'Implementation Approach',
        compliance: 'compliant',
        description: 'The proposed implementation approach is well-structured with a reasonable timeline and appropriate methodology.',
        recommendation: 'Request more details on the data migration approach and validation process.',
        severity: 'medium'
      },
      {
        category: 'Cost',
        compliance: 'compliant',
        description: 'The proposed cost is competitive and within budget, with a reasonable breakdown and payment schedule.',
        recommendation: 'Verify that there are no hidden costs or additional fees for customizations or integrations.',
        severity: 'low'
      },
      {
        category: 'Support & Maintenance',
        compliance: 'compliant',
        description: 'The proposed support and maintenance services are comprehensive, with appropriate SLAs and response times.',
        recommendation: 'Clarify escalation procedures and support availability during critical business periods.',
        severity: 'low'
      }
    ],
    recommendations: 'Based on the evaluation, TechPro Solutions should be shortlisted for further consideration. Their proposal demonstrates a strong understanding of the requirements and offers a comprehensive solution at a competitive price point. During the next phase, focus on verifying customization capabilities in the HR module, obtaining more details on the data migration approach, and clarifying support procedures. Overall, this vendor represents a strong candidate for the ERP implementation project.',
    chatHistory: [
      {
        role: 'system',
        content: 'I\'ve evaluated the bid from TechPro Solutions for the ERP System Implementation project. How can I help you understand the evaluation results?',
        agent: 'Evaluation AI Agent',
        model: 'GPT-4',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        role: 'user',
        content: 'What are the main strengths and weaknesses of this bid?',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        role: 'system',
        content: 'The main strengths of TechPro Solutions\' bid include:\n\n1. Comprehensive solution covering all required modules with strong technical capabilities\n2. Proven implementation methodology and experienced team\n3. Robust security features and compliance with all requirements\n4. Competitive pricing within budget\n5. Comprehensive training and support offerings\n\nThe main weaknesses include:\n\n1. Some customization limitations in the HR module that may require workarounds\n2. Mobile app has limited offline capabilities, which could impact users who need to work without internet access\n3. Timeline is slightly longer than some competitors, though still reasonable\n\nOverall, the strengths significantly outweigh the weaknesses, making this a strong bid that deserves serious consideration.',
        agent: 'Evaluation AI Agent',
        model: 'GPT-4',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ],
    tags: ['ERP', 'Bid Evaluation', 'TechPro Solutions']
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await RFP.deleteMany({});
    await Bid.deleteMany({});
    await Report.deleteMany({});
    await Settings.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword,
        lastLogin: new Date()
      });

      await user.save();
      createdUsers.push(user);
    }

    console.log(`Created ${createdUsers.length} users`);

    // Create RFPs
    const createdRFPs = [];
    for (const rfpData of rfps) {
      const rfp = new RFP({
        ...rfpData,
        createdBy: createdUsers[0]._id // Admin user
      });

      await rfp.save();
      createdRFPs.push(rfp);
    }

    console.log(`Created ${createdRFPs.length} RFPs`);

    // Create bids
    const createdBids = [];
    for (let i = 0; i < bids.length; i++) {
      const bidData = bids[i];
      const rfpIndex = i % createdRFPs.length;

    const bid = new Bid({
        ...bidData,
        rfp: createdRFPs[rfpIndex]._id,
        rfpReferenceNumber: createdRFPs[rfpIndex].referenceNumber,
        referenceNumber: `BID-${createdRFPs[rfpIndex].referenceNumber}-${i+1}`,
        createdBy: createdUsers[1]._id // Manager user
      });

      await bid.save();
      createdBids.push(bid);
    }

    console.log(`Created ${createdBids.length} bids`);

    // Create reports
    const createdReports = [];
    for (let i = 0; i < reports.length; i++) {
      const reportData = reports[i];

      let relatedRFP = null;
      let relatedBids = [];

      if (reportData.type === 'rfp-analysis') {
        relatedRFP = createdRFPs[0]._id;
      } else if (reportData.type === 'bid-evaluation') {
        relatedRFP = createdRFPs[0]._id;
        relatedBids = [createdBids[0]._id];
      }

    const report = new Report({
        ...reportData,
        relatedRFP,
        relatedRFPReference: relatedRFP ? createdRFPs[0].referenceNumber : '',
        relatedBids,
        relatedBidReferences: relatedBids.length > 0 ? [createdBids[0].referenceNumber] : [],
        referenceNumber: `REP-${relatedRFP ? createdRFPs[0].referenceNumber : 'GEN'}-${i+1}`,
        createdBy: createdUsers[0]._id // Admin user
      });

      await report.save();
      createdReports.push(report);
    }

    console.log(`Created ${createdReports.length} reports`);

    // Initialize settings
    const settingsController = require('./controllers/settingsController');
    await settingsController.initializeSettings({ user: { id: createdUsers[0]._id } }, { json: () => console.log('Initialized settings') });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
