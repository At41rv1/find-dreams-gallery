
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Share2, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { saveGeneratedImage } from '@/services/firestoreService';
import { uploadImageToStorage } from '@/services/storageService';

interface ImageGenerationProps {
  onImageGenerated?: (imageUrl: string) => void;
  onStartOver?: () => void;
  initialPrompt?: string;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ 
  onImageGenerated, 
  onStartOver, 
  initialPrompt 
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-generate image when component mounts with initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      generateImage();
    }
  }, [initialPrompt]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_SAMURAI_API_BASE_URL}/ai/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': import.meta.env.VITE_SAMURAI_API_IMAGE_KEY || '',
        },
        body: JSON.stringify({ 
          prompt,
          model: "Toolbaz/gemini-2.5-flash"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.image_url) {
        setImageUrl(data.image_url);
        if (onImageGenerated) {
          onImageGenerated(data.image_url);
        }
        toast({
          title: "Success!",
          description: "Your dream image has been generated!",
        });
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
      setImageUrl(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveImage = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "No image to save.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save images.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Upload image to Firebase Storage
      const storageUrl = await uploadImageToStorage(imageUrl, user.uid);
      
      // Save image URL and prompt to Firestore
      await saveGeneratedImage(storageUrl, prompt, user.uid, user.email || 'anonymous');

      toast({
        title: "Success",
        description: "Image saved successfully!",
      });
    } catch (error: any) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const shareImage = () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "No image to share.",
        variant: "destructive"
      });
      return;
    }

    // Use the navigator API to share the image URL
    if (navigator.share) {
      navigator.share({
        title: 'Dream Image',
        text: 'Check out this dream image I generated!',
        url: imageUrl,
      }).then(() => {
        toast({
          title: "Success",
          description: "Image shared successfully!",
        });
      }).catch((error) => {
        console.error('Error sharing image:', error);
        toast({
          title: "Error",
          description: "Failed to share image.",
          variant: "destructive"
        });
      });
    } else {
      // Fallback for browsers that don't support the share API
      navigator.clipboard.writeText(imageUrl).then(() => {
        toast({
          title: "Copied!",
          description: "Image URL copied to clipboard.",
        });
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Error",
          description: "Failed to copy image URL.",
          variant: "destructive"
        });
      });
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "No image to download.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dream_image_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-xl border-0 shadow-lg rounded-2xl">
        {onStartOver && (
          <div className="flex items-center mb-6">
            <Button
              onClick={onStartOver}
              variant="ghost"
              size="sm"
              className="mr-3 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {initialPrompt ? 'Your Dream is Being Created...' : 'Generate Your Dream'}
            </h2>
          </div>
        )}

        <Label htmlFor="prompt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          Dream Prompt
        </Label>
        <Textarea
          id="prompt"
          placeholder="Enter your dream prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-2 bg-white/80 border-2 border-pink-100 focus:border-pink-300 rounded-xl"
          disabled={isGenerating}
        />
        
        {!initialPrompt && (
          <Button
            onClick={generateImage}
            disabled={isGenerating}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Dream Image'
            )}
          </Button>
        )}

        {isGenerating && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-pink-600" />
              <span className="text-pink-700 font-medium">Creating your dream image...</span>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="mt-6">
            <img
              src={imageUrl}
              alt="Generated Dream"
              className="w-full rounded-xl shadow-md"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                onClick={saveImage}
                disabled={isSaving || !user}
                className="bg-green-500 hover:bg-green-600 text-white flex-1 min-w-0"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              <Button onClick={shareImage} className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-0">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={downloadImage} className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-0">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            
            {!user && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <LogIn className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 text-sm">
                    Sign in to save your images permanently!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImageGeneration;
