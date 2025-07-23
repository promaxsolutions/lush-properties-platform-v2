const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mock storage for demo purposes (since we can't connect to database in serverless)
const mockProjects = [
  {
    id: 1,
    name: "Luxury Townhouse Development",
    stage: "Foundation",
    loanApproved: 500000,
    drawn: 200000,
    cashSpent: 150000,
    outstanding: 100000,
    entityId: "PROJ001",
    files: [],
    address: "123 Main St, Sydney NSW 2000",
    totalBudget: "$750,000",
    estimatedROI: "15%",
    fundingStatus: "no_funding",
    status: "in_progress"
  },
  {
    id: 2,
    name: "Modern Apartment Complex",
    stage: "Planning",
    loanApproved: 800000,
    drawn: 0,
    cashSpent: 50000,
    outstanding: 50000,
    entityId: "PROJ002",
    files: [],
    address: "456 Collins St, Melbourne VIC 3000",
    totalBudget: "$1,200,000",
    estimatedROI: "18%",
    fundingStatus: "open_to_funding",
    status: "planning"
  },
  {
    id: 3,
    name: "Coastal Villa Project",
    stage: "Framing",
    loanApproved: 600000,
    drawn: 300000,
    cashSpent: 280000,
    outstanding: 200000,
    entityId: "PROJ003",
    files: [],
    address: "789 Beach Rd, Gold Coast QLD 4217",
    totalBudget: "$900,000",
    estimatedROI: "20%",
    fundingStatus: "investor_funded",
    status: "in_progress"
  }
];

// Mock users for authentication
const mockUsers = {
  "admin@lush.com": { password: "admin123", role: "admin", name: "Sarah Chen" },
  "builder@lush.com": { password: "builder123", role: "builder", name: "Mike Johnson" },
  "client@lush.com": { password: "client123", role: "client", name: "Jennifer Williams" },
  "investor@lush.com": { password: "investor123", role: "investor", name: "Robert Kim" },
  "accountant@lush.com": { password: "accountant123", role: "accountant", name: "Emma Davis" }
};

// API Routes
app.get('/api/projects', (req, res) => {
  res.json(mockProjects);
});

app.get('/api/stats', (req, res) => {
  const totalProjects = mockProjects.length;
  const totalLoanApproved = mockProjects.reduce((sum, p) => sum + p.loanApproved, 0);
  const totalCashSpent = mockProjects.reduce((sum, p) => sum + p.cashSpent, 0);
  const totalOutstanding = mockProjects.reduce((sum, p) => sum + p.outstanding, 0);
  
  res.json({
    totalProjects,
    totalLoanApproved,
    totalCashSpent,
    totalOutstanding
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers[email?.toLowerCase()];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  res.json({
    user: {
      email: email.toLowerCase(),
      role: user.role,
      name: user.name
    }
  });
});

app.post('/api/ai-chat', (req, res) => {
  const responses = [
    "**Profitability Analysis:** Strong project performance with 18.5% average ROI across portfolio.",
    "**Next Steps:** Schedule foundation inspection for Project #1 and submit progress claim.",
    "**Budget Alert:** Project #2 is 15% under budget - consider value-add opportunities."
  ];
  
  res.json({
    reply: responses[Math.floor(Math.random() * responses.length)]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// For Vercel serverless deployment
module.exports = app;