// Claims API utilities for progress claim management

export interface ClaimData {
  project: string;
  milestone: string;
  amount: number;
  lenderEmail: string;
  builderEmail: string;
  template?: File | null;
  receipt?: File | null;
  photo?: File | null;
  status: string;
  description?: string;
}

export const sendClaimEmail = async (claimData: ClaimData): Promise<boolean> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('project', claimData.project);
    formData.append('milestone', claimData.milestone);
    formData.append('amount', claimData.amount.toString());
    formData.append('lenderEmail', claimData.lenderEmail);
    formData.append('builderEmail', claimData.builderEmail);
    formData.append('status', claimData.status);
    
    if (claimData.description) {
      formData.append('description', claimData.description);
    }
    
    // Add files if present
    if (claimData.template) {
      formData.append('template', claimData.template);
    }
    if (claimData.receipt) {
      formData.append('receipt', claimData.receipt);
    }
    if (claimData.photo) {
      formData.append('photo', claimData.photo);
    }

    const response = await fetch('/api/claims/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to send claim email:', error);
    return false;
  }
};

export const checkClaimFollowup = async (projectId: string, claimData?: any): Promise<boolean> => {
  try {
    const response = await fetch(`/api/claims/followup/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData || {})
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to check claim follow-up:', error);
    return false;
  }
};

export const getClaimStatus = async (projectId: string, milestone: string): Promise<string> => {
  try {
    const response = await fetch(`/api/claims/status/${projectId}/${encodeURIComponent(milestone)}`);
    const result = await response.json();
    return result.success ? result.status : 'unknown';
  } catch (error) {
    console.error('Failed to get claim status:', error);
    return 'unknown';
  }
};

export const updateClaimStatus = async (
  projectId: string, 
  milestone: string, 
  status: 'approved' | 'rejected' | 'pending'
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/claims/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, milestone, status })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to update claim status:', error);
    return false;
  }
};

export const getClaimHistory = async (projectId: string): Promise<any[]> => {
  try {
    const response = await fetch(`/api/claims/history/${projectId}`);
    const result = await response.json();
    return result.success ? result.claims : [];
  } catch (error) {
    console.error('Failed to get claim history:', error);
    return [];
  }
};