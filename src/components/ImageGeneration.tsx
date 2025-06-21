
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Share2, ArrowLeft, LogIn, Sparkles } from 'lucide-react';
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
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-generate image when component mounts with initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      generateImage();
    }
  }, [initialPrompt]);

  const enhancePrompt = async (originalPrompt: string): Promise<string> => {
    if (!originalPrompt.trim()) return originalPrompt;

    const apiBaseUrl = import.meta.env.VITE_SAMURAI_API_BASE_URL;
    const chatApiKey = import.meta.env.VITE_SAMURAI_API_CHAT_KEY;

    if (!apiBaseUrl || !chatApiKey) {
      console.warn('Missing environment variables for prompt enhancement');
      toast({
        title: "Configuration Error",
        description: "API configuration is missing. Using original prompt.",
        variant: "destructive"
      });
      return originalPrompt;
    }

    setIsEnhancing(true);
    try {
      console.log('Enhancing prompt:', originalPrompt);
      console.log('Using API Base URL:', apiBaseUrl);
      
      const response = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': chatApiKey,
        },
        body: JSON.stringify({
          model: "Toolbaz/gemini-2.0-flash",
          messages: [
            {
              role: "system",
              content: `You are a professional AI art prompt enhancer. Your job is to take simple prompts and transform them into extremely detailed, vivid, and artistic descriptions for AI image generation. 

Create a comprehensive 50-line prompt that includes:
1. Detailed description of the main subject with specific features, expressions, and characteristics
2. Rich environmental details including lighting, atmosphere, and mood
3. Artistic style references (photography styles, art movements, camera techniques)
4. Color palette specifications with exact color names and tones
5. Composition details (angles, framing, perspective)
6. Quality and technical specifications (resolution, clarity, artistic quality)
7. Texture and material descriptions
8. Background elements and scenery details
9. Weather conditions or atmospheric effects if relevant
10. Professional photography or artistic rendering specifications
11. Lighting setup and shadow details
12. Camera settings and lens specifications
13. Post-processing effects and filters
14. Artistic movement inspirations
15. Color temperature and saturation levels
16. Depth of field specifications
17. Motion blur or freeze effects
18. Reflections and refractions
19. Surface textures and materials
20. Ambient occlusion and global illumination
21. Subsurface scattering effects
22. Volumetric lighting and fog
23. Particle effects and atmospherics
24. HDR and exposure settings
25. Contrast and brightness levels
26. Saturation and vibrance adjustments
27. Sharpness and detail enhancement
28. Noise reduction specifications
29. Color grading and tone mapping
30. Artistic interpretation style
31. Emotional tone and mood descriptors
32. Time of day and seasonal context
33. Geographic and cultural elements
34. Historical period accuracy
35. Fashion and costume details
36. Architectural elements and structures
37. Natural elements and organic forms
38. Geometric patterns and shapes
39. Symmetry and asymmetry balance
40. Scale and proportion relationships
41. Foreground, midground, background layers
42. Leading lines and visual flow
43. Rule of thirds composition
44. Golden ratio applications
45. Visual weight distribution
46. Negative space utilization
47. Pattern repetition and variation
48. Visual rhythm and movement
49. Focal point emphasis techniques
50. Overall aesthetic harmony and balance

Make each line descriptive and specific. Focus on creating a prompt that will generate stunning, professional-quality images. Return only the enhanced prompt as a single paragraph, nothing else.`
            },
            {
              role: "user",
              content: `Create an extremely detailed 50-line AI image generation prompt based on: "${originalPrompt}"`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }),
      });

      console.log('Prompt enhancement response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Prompt enhancement error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Prompt enhancement response data:', data);
      
      const enhanced = data.choices?.[0]?.message?.content?.trim() || originalPrompt;
      setEnhancedPrompt(enhanced);
      console.log('Enhanced prompt:', enhanced);
      return enhanced;
    } catch (error: any) {
      console.error('Prompt enhancement error:', error);
      toast({
        title: "Note",
        description: "Using original prompt (enhancement unavailable)",
      });
      return originalPrompt;
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive"
      });
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_SAMURAI_API_BASE_URL;
    const imageApiKey = import.meta.env.VITE_SAMURAI_API_IMAGE_KEY;

    if (!apiBaseUrl || !imageApiKey) {
      toast({
        title: "Configuration Error",
        description: "API configuration is missing. Please check environment variables.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);
    
    try {
      // First enhance the prompt
      const promptToUse = await enhancePrompt(prompt);
      
      console.log('Generating image with prompt:', promptToUse);
      console.log('Using API Base URL:', apiBaseUrl);
      
      // Then generate the image
      const response = await fetch(`${apiBaseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': imageApiKey,
        },
        body: JSON.stringify({ 
          prompt: promptToUse,
          model: "TogetherImage/black-forest-labs/FLUX.1-kontext-max",
          n: 1,
          size: "1024x1024"
        }),
      });

      console.log('Image generation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Image generation error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Image generation response data:', data);
      
      if (data && data.data && data.data[0] && data.data[0].url) {
        setImageUrl(data.data[0].url);
        if (onImageGenerated) {
          onImageGenerated(data.data[0].url);
        }
        toast({
          title: "Success!",
          description: "Your dream image has been generated!",
        });
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from image generation API');
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: "Error",
        description: `Failed to generate image: ${error.message}`,
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
      await saveGeneratedImage(storageUrl, enhancedPrompt || prompt, user.uid, user.email || 'anonymous');

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

        {enhancedPrompt && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-purple-700 flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Enhanced Prompt
            </Label>
            <div className="mt-1 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800 max-h-40 overflow-y-auto">
              {enhancedPrompt}
            </div>
          </div>
        )}
        
        {!initialPrompt && (
          <Button
            onClick={generateImage}
            disabled={isGenerating || isEnhancing}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            {isEnhancing ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Enhancing Prompt...
              </>
            ) : isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Dream Image'
            )}
          </Button>
        )}

        {(isEnhancing || isGenerating) && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
              {isEnhancing ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin text-purple-600" />
                  <span className="text-purple-700 font-medium">Enhancing your prompt...</span>
                </>
              ) : (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-pink-600" />
                  <span className="text-pink-700 font-medium">Creating your dream image...</span>
                </>
              )}
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
