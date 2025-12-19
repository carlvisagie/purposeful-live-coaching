/**
 * Client Profile Export Component
 * 
 * Allows exporting the unified client profile as:
 * - PDF (via print dialog)
 * - HTML file download
 * - Email to client or coach
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  Mail, 
  Printer, 
  Share2, 
  Loader2,
  CheckCircle,
  Eye
} from "lucide-react";

interface ClientProfileExportProps {
  clientId?: number;
  userId?: number;
  clientName?: string;
  variant?: "button" | "dropdown" | "icon";
}

export function ClientProfileExport({ 
  clientId, 
  userId, 
  clientName = "Client",
  variant = "dropdown" 
}: ClientProfileExportProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  // Fetch the full profile data
  const { data: profile, isLoading, refetch } = trpc.clientProfileExport.getFullProfile.useQuery(
    { clientId, userId },
    { enabled: false } // Don't fetch automatically
  );

  // Generate the HTML for the profile
  const generateProfileHTML = (profileData: any): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Client Profile - ${profileData.client.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 { color: #6366f1; font-size: 28px; margin-bottom: 5px; }
    .header .subtitle { color: #666; font-size: 14px; }
    .header .export-info { color: #999; font-size: 12px; margin-top: 10px; }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #6366f1;
      font-size: 18px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .info-item {
      padding: 8px 0;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .info-value {
      color: #333;
      font-size: 14px;
    }
    
    .progress-bar {
      background: #e5e7eb;
      border-radius: 10px;
      height: 20px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }
    
    .session-card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      border-left: 4px solid #6366f1;
    }
    .session-date {
      font-weight: 600;
      color: #6366f1;
    }
    .session-type {
      background: #6366f1;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin-left: 10px;
    }
    
    .media-item {
      display: flex;
      align-items: center;
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .media-icon {
      width: 40px;
      height: 40px;
      background: #6366f1;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-right: 12px;
    }
    
    .cliffsnotes {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    }
    .cliffsnotes h2 {
      color: #92400e;
      border-bottom-color: #f59e0b;
    }
    
    .tag {
      display: inline-block;
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 12px;
      margin: 3px;
    }
    
    .risk-alert {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    .risk-alert h3 {
      color: #dc2626;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Unified Client Profile</h1>
    <div class="subtitle">${profileData.client.name}</div>
    <div class="export-info">
      Exported: ${profileData.exportDate} | By: ${profileData.exportedBy}
    </div>
  </div>
  
  <!-- Client Overview -->
  <div class="section">
    <h2>👤 Client Overview</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Name</div>
        <div class="info-value">${profileData.client.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${profileData.client.email || 'Not provided'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Phone</div>
        <div class="info-value">${profileData.client.phone || 'Not provided'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${profileData.client.status || 'Active'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Start Date</div>
        <div class="info-value">${profileData.client.startDate}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Profile Completeness</div>
        <div class="info-value">${profileData.client.profileCompleteness}%</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${profileData.client.profileCompleteness}%">
        ${profileData.client.profileCompleteness}% Complete
      </div>
    </div>
  </div>
  
  <!-- Goals & Progress -->
  ${profileData.goals.primaryGoal ? `
  <div class="section">
    <h2>🎯 Goals & Progress</h2>
    <div class="info-item">
      <div class="info-label">Primary Goal</div>
      <div class="info-value" style="font-size: 16px; font-weight: 500;">${profileData.goals.primaryGoal}</div>
    </div>
    ${profileData.goals.motivation ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Why This Matters</div>
      <div class="info-value">${profileData.goals.motivation}</div>
    </div>` : ''}
    <div style="margin-top: 15px;">
      <div class="info-label">Goal Progress</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${profileData.goals.progressPercent}%">
          ${profileData.goals.progressPercent}%
        </div>
      </div>
    </div>
  </div>` : ''}
  
  <!-- Session History -->
  ${profileData.sessions.length > 0 ? `
  <div class="section">
    <h2>📅 Session History (${profileData.sessions.length} sessions)</h2>
    ${profileData.sessions.slice(0, 5).map((session: any) => `
    <div class="session-card">
      <div style="margin-bottom: 8px;">
        <span class="session-date">${session.date}</span>
        <span class="session-type">${session.type}</span>
        ${session.duration ? `<span style="color: #666; font-size: 12px; margin-left: 10px;">${session.duration} min</span>` : ''}
      </div>
      ${session.summary ? `<div style="margin-bottom: 8px;">${session.summary}</div>` : ''}
      ${session.homework ? `
      <div style="margin-top: 8px; background: #fef3c7; padding: 8px; border-radius: 4px; font-size: 13px;">
        <strong>Homework:</strong> ${session.homework}
      </div>` : ''}
    </div>`).join('')}
    ${profileData.sessions.length > 5 ? `<p style="color: #666; font-style: italic;">+ ${profileData.sessions.length - 5} more sessions...</p>` : ''}
  </div>` : ''}
  
  <!-- Voice Coaching Sessions -->
  ${profileData.voiceSessions.length > 0 ? `
  <div class="section">
    <h2>🎙️ Voice Coaching Sessions (${profileData.voiceSessions.length} sessions)</h2>
    ${profileData.voiceSessions.slice(0, 3).map((session: any) => `
    <div class="session-card">
      <div style="margin-bottom: 8px;">
        <span class="session-date">${session.date}</span>
        <span class="session-type">${session.mode}</span>
        <span style="color: #666; font-size: 12px; margin-left: 10px;">${Math.round(session.duration / 60)} min</span>
      </div>
      ${session.emotionalJourney ? `<div style="margin-bottom: 8px;"><strong>Emotional Journey:</strong> ${session.emotionalJourney}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}
  
  <!-- Media Files -->
  ${(profileData.media.audio.length > 0 || profileData.media.video.length > 0 || profileData.media.documents.length > 0) ? `
  <div class="section">
    <h2>📁 Media Files</h2>
    ${profileData.media.audio.length > 0 ? `
    <h3 style="font-size: 14px; color: #666; margin: 15px 0 10px;">🎵 Audio Files (${profileData.media.audio.length})</h3>
    ${profileData.media.audio.map((file: any) => `
    <div class="media-item">
      <div class="media-icon">🎵</div>
      <div>
        <div style="font-weight: 500;">${file.fileName}</div>
        <div style="font-size: 12px; color: #666;">${file.uploadDate}</div>
      </div>
    </div>`).join('')}` : ''}
    
    ${profileData.media.video.length > 0 ? `
    <h3 style="font-size: 14px; color: #666; margin: 15px 0 10px;">🎬 Video Files (${profileData.media.video.length})</h3>
    ${profileData.media.video.map((file: any) => `
    <div class="media-item">
      <div class="media-icon">🎬</div>
      <div>
        <div style="font-weight: 500;">${file.fileName}</div>
        <div style="font-size: 12px; color: #666;">${file.uploadDate}</div>
      </div>
    </div>`).join('')}` : ''}
    
    ${profileData.media.documents.length > 0 ? `
    <h3 style="font-size: 14px; color: #666; margin: 15px 0 10px;">📄 Documents (${profileData.media.documents.length})</h3>
    ${profileData.media.documents.map((file: any) => `
    <div class="media-item">
      <div class="media-icon">📄</div>
      <div>
        <div style="font-weight: 500;">${file.fileName}</div>
        <div style="font-size: 12px; color: #666;">${file.uploadDate}</div>
      </div>
    </div>`).join('')}` : ''}
  </div>` : ''}
  
  <!-- AI Conversations -->
  ${profileData.aiConversations.totalConversations > 0 ? `
  <div class="section">
    <h2>💬 AI Coaching Summary</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Total Conversations</div>
        <div class="info-value">${profileData.aiConversations.totalConversations}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Total Messages</div>
        <div class="info-value">${profileData.aiConversations.totalMessages}</div>
      </div>
    </div>
    ${profileData.aiConversations.recentTopics.length > 0 ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Recent Topics</div>
      <div>${profileData.aiConversations.recentTopics.map((t: string) => `<span class="tag">${t}</span>`).join('')}</div>
    </div>` : ''}
  </div>` : ''}
  
  <!-- CliffsNotes for Next Session -->
  <div class="cliffsnotes">
    <h2>📝 CliffsNotes for Next Session</h2>
    
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Quick Summary</div>
      <div class="info-value">${profileData.nextSession.summary || 'No previous sessions yet.'}</div>
    </div>
    
    ${profileData.nextSession.whereWeLeftOff ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Where We Left Off</div>
      <div class="info-value">${profileData.nextSession.whereWeLeftOff}</div>
    </div>` : ''}
    
    ${profileData.nextSession.recommendedFocus?.length > 0 ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Recommended Focus</div>
      <ul style="margin-left: 20px;">
        ${profileData.nextSession.recommendedFocus.map((f: string) => `<li>${f}</li>`).join('')}
      </ul>
    </div>` : ''}
  </div>
  
  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
    Generated by PurposefulLive Coaching Platform<br>
    ${profileData.exportDate}
  </div>
</body>
</html>`;
  };

  // Handle export as PDF (print)
  const handlePrintPDF = async () => {
    setIsExporting(true);
    try {
      const result = await refetch();
      if (result.data) {
        const html = generateProfileHTML(result.data);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.print();
          };
        }
        toast({
          title: "Profile Ready",
          description: "Print dialog opened. Save as PDF or print directly.",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle download as HTML
  const handleDownloadHTML = async () => {
    setIsExporting(true);
    try {
      const result = await refetch();
      if (result.data) {
        const html = generateProfileHTML(result.data);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${clientName.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Download Complete",
          description: "Profile downloaded as HTML file.",
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle download as JSON
  const handleDownloadJSON = async () => {
    setIsExporting(true);
    try {
      const result = await refetch();
      if (result.data) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${clientName.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Download Complete",
          description: "Profile downloaded as JSON file.",
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle preview
  const handlePreview = async () => {
    setIsExporting(true);
    try {
      const result = await refetch();
      if (result.data) {
        const html = generateProfileHTML(result.data);
        setPreviewHtml(html);
        setIsPreviewOpen(true);
      }
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Could not load profile preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle email (placeholder - would need backend email service)
  const handleSendEmail = async () => {
    if (!emailAddress) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // For now, just copy to clipboard and show instructions
      const result = await refetch();
      if (result.data) {
        const html = generateProfileHTML(result.data);
        
        // Create a mailto link with the profile as attachment instructions
        const subject = encodeURIComponent(`Client Profile - ${clientName}`);
        const body = encodeURIComponent(`Please find the client profile attached.\n\nNote: For privacy, please download the profile using the Export button and attach it to your email manually.`);
        
        window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
        
        toast({
          title: "Email Client Opened",
          description: "Download the profile and attach it to your email.",
        });
      }
      setIsEmailDialogOpen(false);
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Could not prepare email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (variant === "icon") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintPDF}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadHTML}>
            <FileText className="mr-2 h-4 w-4" />
            Download HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadJSON}>
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "button") {
    return (
      <>
        <Button onClick={handlePrintPDF} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Profile
        </Button>
        
        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Profile Preview</DialogTitle>
            </DialogHeader>
            <div 
              className="border rounded-lg overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default: dropdown variant
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Profile
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintPDF}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadHTML}>
            <FileText className="mr-2 h-4 w-4" />
            Download as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadJSON}>
            <Download className="mr-2 h-4 w-4" />
            Download as JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Client Profile</DialogTitle>
            <DialogDescription>
              Enter the email address to send the profile to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Profile Preview - {clientName}</DialogTitle>
            <DialogDescription>
              Review the profile before exporting
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg overflow-auto max-h-[60vh] bg-white">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[500px] border-0"
              title="Profile Preview"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrintPDF}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
