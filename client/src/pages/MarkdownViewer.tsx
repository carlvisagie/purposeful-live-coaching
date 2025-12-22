import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Printer } from "lucide-react";

/**
 * MarkdownViewer - Renders markdown files (guides, lesson-notes, transcripts) with proper styling
 * This component fetches markdown content and renders it with beautiful formatting
 */
export default function MarkdownViewer() {
  const [location] = useLocation();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Document");

  // Determine the type of document from the URL
  const getDocType = () => {
    if (location.includes("/guides/")) return "Guide";
    if (location.includes("/lesson-notes/")) return "Lesson Notes";
    if (location.includes("/transcripts/")) return "Transcript";
    return "Document";
  };

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        // Extract type and filename from URL to fetch from content API
        // URL format: /guides/filename.md or /lesson-notes/filename.md or /transcripts/filename.md
        const parts = location.split('/');
        const filename = parts.pop() || '';
        const type = parts.pop() || '';
        const apiUrl = `/api/content/raw/${type}/${filename}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to load document");
        }
        const text = await response.text();
        setContent(text);
        
        // Extract title from first heading
        const titleMatch = text.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          setTitle(titleMatch[1]);
        } else {
          // Use filename as title
          const filename = location.split("/").pop()?.replace(".md", "").replace(/_/g, " ") || "Document";
          setTitle(filename.charAt(0).toUpperCase() + filename.slice(1));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [location]);

  // Simple markdown to HTML converter
  const renderMarkdown = (md: string): string => {
    let html = md
      // Headers
      .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold mt-6 mb-2 text-purple-700">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3 text-purple-800">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-purple-900 border-b pb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-6 text-purple-900">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$2</code></pre>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      // Tables
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return ''; // Skip separator row
        }
        const isHeader = match.includes("---");
        const cellTag = isHeader ? 'th' : 'td';
        const cellClass = isHeader 
          ? 'class="border px-4 py-2 bg-purple-100 font-semibold text-left"'
          : 'class="border px-4 py-2"';
        return `<tr>${cells.map(c => `<${cellTag} ${cellClass}>${c.trim()}</${cellTag}>`).join('')}</tr>`;
      })
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-t-2 border-purple-200" />')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50 italic">$1</blockquote>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-800 underline">$1</a>')
      // Paragraphs (wrap remaining text)
      .replace(/^(?!<[hluobpt]|<li|<hr|<pre|<code)(.+)$/gm, '<p class="mb-4 leading-relaxed">$1</p>')
      // Wrap lists
      .replace(/(<li class="ml-4 mb-1">[\s\S]*?<\/li>)+/g, '<ul class="list-disc mb-4">$&</ul>')
      // Wrap tables
      .replace(/(<tr>[\s\S]*?<\/tr>)+/g, '<table class="w-full border-collapse my-6">$&</table>')
      // Form fields (underscores)
      .replace(/_{5,}/g, '<span class="inline-block border-b-2 border-gray-400 min-w-[200px]">&nbsp;</span>');

    return html;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
            <Button 
              onClick={() => window.history.back()} 
              className="w-full mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => window.history.back()} 
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">{getDocType()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div 
              className="prose prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:hidden">
          <p>Part of the Purposeful Live Coaching wellness program</p>
        </div>
      </div>
    </div>
  );
}
