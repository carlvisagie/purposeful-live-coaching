import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, FileAudio, FileVideo, FileText, Image as ImageIcon, 
  Download, Trash2, Loader2 
} from "lucide-react";
import { toast } from "sonner";

export default function MyFiles() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: files, isLoading, refetch } = trpc.clientFiles.getMyFiles.useQuery();
  const uploadMutation = trpc.clientFiles.uploadFile.useMutation();
  const deleteMutation = trpc.clientFiles.deleteFile.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const base64 = base64Data.split(',')[1]; // Remove data:mime;base64, prefix

        // Determine file type
        let fileType: "audio" | "video" | "document" | "image" | "transcript" = "document";
        if (selectedFile.type.startsWith("audio/")) fileType = "audio";
        else if (selectedFile.type.startsWith("video/")) fileType = "video";
        else if (selectedFile.type.startsWith("image/")) fileType = "image";

        await uploadMutation.mutateAsync({
          fileName: selectedFile.name,
          fileType,
          fileCategory: fileType === "audio" ? "voice_memo" : "other",
          fileData: base64,
          mimeType: selectedFile.type,
        });

        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        refetch();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteMutation.mutateAsync({ fileId });
      toast.success("File deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "audio": return <FileAudio className="w-5 h-5" />;
      case "video": return <FileVideo className="w-5 h-5" />;
      case "image": return <ImageIcon className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const audioFiles = files?.filter(f => f.fileType === "audio") || [];
  const videoFiles = files?.filter(f => f.fileType === "video") || [];
  const documentFiles = files?.filter(f => f.fileType === "document" || f.fileType === "transcript") || [];
  const imageFiles = files?.filter(f => f.fileType === "image") || [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Files</h1>
        <p className="text-muted-foreground">
          Upload and manage your coaching files
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Upload voice memos, documents, photos, or videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              onChange={handleFileSelect}
              accept="audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"
            />
            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Files ({files?.length || 0})</TabsTrigger>
          <TabsTrigger value="audio">Audio ({audioFiles.length})</TabsTrigger>
          <TabsTrigger value="video">Video ({videoFiles.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documentFiles.length})</TabsTrigger>
          <TabsTrigger value="images">Images ({imageFiles.length})</TabsTrigger>
        </TabsList>

        {/* All Files Tab */}
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading files...
              </CardContent>
            </Card>
          ) : files && files.length > 0 ? (
            files.map((file) => (
              <Card key={file.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.fileType)}
                      <div>
                        <div className="font-medium">{file.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.fileSize)} 
                          {file.duration && ` • ${formatDuration(file.duration)}`}
                          {file.transcriptionStatus === "completed" && " • Transcribed"}
                        </div>
                        {file.transcriptionText && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm max-w-2xl">
                            {file.transcriptionText.substring(0, 200)}
                            {file.transcriptionText.length > 200 && "..."}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Uploaded {new Date(file.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{file.fileCategory}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.fileUrl, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No files uploaded yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio" className="space-y-4">
          {audioFiles.length > 0 ? (
            audioFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{file.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDuration(file.duration)} • {formatFileSize(file.fileSize)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <audio controls src={file.fileUrl} className="w-full" />
                    {file.transcriptionText && (
                      <div className="p-3 bg-muted rounded text-sm">
                        <div className="font-semibold mb-1">Transcription:</div>
                        {file.transcriptionText}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No audio files yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Video Tab */}
        <TabsContent value="video" className="space-y-4">
          {videoFiles.length > 0 ? (
            videoFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{file.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDuration(file.duration)} • {formatFileSize(file.fileSize)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <video controls src={file.fileUrl} className="w-full max-w-2xl" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No video files yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {documentFiles.length > 0 ? (
            documentFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{file.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.fileSize)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.fileUrl, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No documents yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          {imageFiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageFiles.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-2">
                    <img 
                      src={file.fileUrl} 
                      alt={file.fileName}
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="mt-2">
                      <div className="text-sm font-medium truncate">{file.fileName}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.fileSize)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No images yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
