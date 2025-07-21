// Budget and claims API utilities

export interface BudgetLine {
  id: string;
  name: string;
  keyword: string;
  amount: number;
  category: string;
  remaining: number;
}

export interface DraftClaim {
  lineItem: string;
  amount: number;
  description: string;
  receiptText: string;
  confidence: number;
}

export const getBudgetLines = async (): Promise<BudgetLine[]> => {
  try {
    const response = await fetch('/api/budget/lines');
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch budget lines:', error);
    return [];
  }
};

export const saveDraftClaim = async (claim: DraftClaim): Promise<boolean> => {
  try {
    const response = await fetch('/api/claims/save-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claim)
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to save draft claim:', error);
    return false;
  }
};

export const sendWeeklyReminder = async (recipient: string, message: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/notifications/weekly-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, message })
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to send weekly reminder:', error);
    return false;
  }
};

export const analyzeBudgetMatch = (text: string, budgetLines: BudgetLine[]) => {
  const lowerText = text.toLowerCase();
  let bestMatch: { budgetLine: BudgetLine | null; confidence: number } = {
    budgetLine: null,
    confidence: 0
  };

  budgetLines.forEach(line => {
    let confidence = 0;
    
    // Primary keyword match
    if (lowerText.includes(line.keyword.toLowerCase())) {
      confidence += 60;
    }

    // Category-based matching
    const categoryKeywords = {
      materials: ['supply', 'material', 'hardware', 'lumber', 'steel', 'brick'],
      labor: ['labor', 'labour', 'contractor', 'service', 'work', 'installation'],
      equipment: ['rental', 'hire', 'equipment', 'machinery', 'tools']
    };

    const keywords = categoryKeywords[line.category as keyof typeof categoryKeywords] || [];
    const matchingKeywords = keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    confidence += matchingKeywords.length * 10;

    // Specific term boosting
    if (line.name.toLowerCase().includes('foundation') && lowerText.includes('concrete')) {
      confidence += 20;
    }
    if (line.name.toLowerCase().includes('timber') && lowerText.includes('wood')) {
      confidence += 20;
    }
    if (line.name.toLowerCase().includes('electrical') && lowerText.includes('wire')) {
      confidence += 20;
    }

    if (confidence > bestMatch.confidence) {
      bestMatch = { budgetLine: line, confidence };
    }
  });

  return bestMatch;
};