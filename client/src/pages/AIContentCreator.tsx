import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Sparkles, Download, Share2 } from 'lucide-react';

export default function AIContentCreator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Open AI Media Engine in iframe or new window
    const mediaEngineUrl = 'https://jpxfdzvm.manus.space/';
    window.open(mediaEngineUrl, '_blank');
    
    // Simulate generation (in production, this would call the AI Media Engine API)
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedVideo('https://example.com/generated-video.mp4');
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Content Creator</h1>
          <p className="text-muted-foreground">Generate marketing videos for your coaching services</p>
        </div>
        <Video className="h-12 w-12 text-primary" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Create New Video
            </CardTitle>
            <CardDescription>
              Generate professional marketing content using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Video Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Introduction to Wellness Coaching"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Target Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram Reels</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Video Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you want the video to cover..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!topic || !platform || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
            <CardDescription>
              Your generated video will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedVideo ? (
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <video 
                    src={generatedVideo} 
                    controls 
                    className="w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No video generated yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>
            Your previously generated marketing content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>No videos generated yet. Create your first video above!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
