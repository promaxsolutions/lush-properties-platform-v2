import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';

interface ProjectExportButtonProps {
  projectId?: string;
  projectName?: string;
  className?: string;
}

const ProjectExportButton: React.FC<ProjectExportButtonProps> = ({ 
  projectId = "default", 
  projectName = "Project",
  className = "" 
}) => {
  const [exporting, setExporting] = useState(false);

  const exportProjectPack = async () => {
    setExporting(true);
    
    try {
      console.log(`[EXPORT] Starting project pack export for ${projectName} (${projectId})`);
      
      // Simulate export preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate export data
      const exportData = {
        projectId,
        projectName,
        exportDate: new Date().toISOString(),
        includedDocuments: [
          'Project Overview',
          'Financial Summary', 
          'Progress Photos',
          'Payment Claims',
          'Contract Documents',
          'Inspection Reports'
        ],
        totalDocuments: 23,
        exportSize: '45.2 MB'
      };
      
      // Create download blob (in real app, this would be PDF/ZIP from backend)
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectName}_Complete_Pack_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Success notification
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { 
          message: `✅ Project pack exported successfully for ${projectName}` 
        }
      }));
      
      console.log('[EXPORT] Project pack export completed successfully');
      
    } catch (error) {
      console.error('Export failed:', error);
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { 
          message: `❌ Export failed for ${projectName}. Please try again.` 
        }
      }));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportProjectPack}
      disabled={exporting}
      className={`${className}`}
      variant="outline"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download Full Pack
        </>
      )}
    </Button>
  );
};

export default ProjectExportButton;