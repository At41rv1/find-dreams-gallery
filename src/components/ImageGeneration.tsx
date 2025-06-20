
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RefreshCw, Home, Sparkles, Loader2, Heart, Star, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { saveGeneratedImage } from '@/services/firestoreService';
import { uploadImageToStorage } from '@/services/storageService';

interface ImageGenerationProps {
  answers: string[];
  onStartOver: () => void;
}

const ImageGeneration = ({ answers, onStartOver }: ImageGenerationProps) => {
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    generateImagePrompt();
  }, []);

  const generateImagePrompt = async () => {
    setIsGeneratingPrompt(true);
    setError('');
    
    try {
      const userInput = answers.join(' | ');
      
      const response = await fetch('https://samuraiapi.in/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SAMURAI_API_CHAT_KEY}`
        },
        body: JSON.stringify({
          model: "Toolbaz/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a professional AI image prompt generator. Create detailed, artistic prompts for image generation based on user inputs. Focus on visual elements, artistic style, lighting, composition, and mood. Return ONLY the prompt, nothing else."
            },
            {
              role: "user",
              content: `Create a detailed image generation prompt based on these dream elements: ${userInput}. Make it unique and visually stunning.`
            }
          ],
          max_tokens: 200,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to generate prompt');
      }
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      const prompt = data.choices[0].message.content.trim();
      setGeneratedPrompt(prompt);
      
      // Automatically proceed to image generation
      generateImage(prompt);
      
    } catch (err) {
      console.error('Prompt generation error:', err);
      setError(`Failed to generate prompt: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    setError('');
    
    try {
      const response = await fetch('https://samuraiapi.in/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SAMURAI_API_IMAGE_KEY}`
        },
        body: JSON.stringify({
          model: "TogetherImage/black-forest-labs/FLUX.1-kontext-max",
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to generate image');
      }
      
      if (!data.data || !data.data[0] || !data.data[0].url) {
        throw new Error('Invalid response format from image API');
      }

      const imageUrl = data.data[0].url;
      setGeneratedImage(imageUrl);
      
      // Auto-save to Firebase if user is logged in
      if (user) {
        await saveImageToFirebase(imageUrl, prompt);
      }
      
      toast({
        title: "Dream Generated Successfully!",
        description: user ? "Your dream has been saved to the community!" : "Your dream is ready! Sign in to save it to the community.",
      });
      
    } catch (err) {
      console.error('Image generation error:', err);
      setError(`Failed to generate image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const saveImageToFirebase = async (imageUrl: string, prompt: string) => {
    if (!user) return;
    
    setIsSavingImage(true);
    try {
      // Upload image to Firebase Storage
      const storageUrl = await uploadImageToStorage(imageUrl, user.uid);
      
      // Save metadata to Firestore
      await saveGeneratedImage(storageUrl, prompt, user.uid, user.email || undefined);
      
      console.log('Image saved to Firebase successfully');
    } catch (error) {
      console.error('Error saving image to Firebase:', error);
      toast({
        title: "Save Error",
        description: "Failed to save image to community",
        variant: "destructive"
      });
    } finally {
      setIsSavingImage(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage, {
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dream-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded Successfully!",
        description: "Your dream image has been saved to your device.",
      });
    } catch (err) {
      console.error('Download error:', err);
      
      // Fallback: open in new tab
      try {
        window.open(generatedImage, '_blank');
        toast({
          title: "Download Alternative",
          description: "Image opened in new tab. Right-click to save.",
        });
      } catch (fallbackErr) {
        toast({
          title: "Download Failed",
          description: "Unable to download. Please try again or right-click the image to save.",
          variant: "destructive"
        });
      }
    }
  };

  const retryGeneration = () => {
    setGeneratedImage('');
    setGeneratedPrompt('');
    setError('');
    generateImagePrompt();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-gradient-to-r from-pink-300/15 to-purple-300/15 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <Card className="max-w-5xl mx-auto p-12 bg-white/90 backdrop-blur-xl border-0 shadow-2xl shadow-pink-200/30 rounded-3xl">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center mb-6">
              <Star className="w-8 h-8 text-pink-500 mr-3 animate-pulse" />
              <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                Creating Your Dream
              </h2>
              <Star className="w-8 h-8 text-purple-500 ml-3 animate-pulse" />
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
              <Heart className="w-6 h-6 text-purple-400 animate-pulse animation-delay-500" />
              <Sparkles className="w-6 h-6 text-pink-500 animate-pulse animation-delay-1000" />
            </div>
          </div>

          {(isGeneratingPrompt || isGeneratingImage || isSavingImage) && (
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <Loader2 className="w-16 h-16 animate-spin text-pink-500" />
                <div className="absolute inset-0 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
              </div>
              <p className="text-gray-700 text-xl font-medium mb-6">
                {isGeneratingPrompt ? 'Crafting your dream prompt...' : 
                 isGeneratingImage ? 'Bringing your dream to life...' :
                 'Saving to community...'}
              </p>
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full animate-pulse w-3/4 transition-all duration-1000"></div>
              </div>
            </div>
          )}

          {generatedPrompt && !isGeneratingPrompt && (
            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-6 h-6 text-pink-500 mr-2" />
                Generated Prompt:
              </h3>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-400 rounded-2xl p-6 shadow-inner">
                <p className="text-gray-700 italic text-lg leading-relaxed">{generatedPrompt}</p>
              </div>
            </div>
          )}

          {generatedImage && (
            <div className="mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <img 
                    src={generatedImage} 
                    alt="Generated Dream" 
                    className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              
              {!user && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-center">
                  <p className="text-purple-700 font-medium">
                    <LogIn className="w-5 h-5 inline mr-2" />
                    Sign in to save your dreams to the community and view them later!
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-2xl">
              <p className="text-red-700 text-center text-lg">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-6">
            {generatedImage && (
              <Button
                onClick={downloadImage}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="mr-2 w-5 h-5" />
                Download Dream
              </Button>
            )}
            
            <Button
              onClick={retryGeneration}
              disabled={isGeneratingPrompt || isGeneratingImage || isSavingImage}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              <RefreshCw className="mr-2 w-5 h-5" />
              Generate New Dream
            </Button>
            
            <Button
              onClick={onStartOver}
              variant="outline"
              className="bg-white/80 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Home className="mr-2 w-5 h-5" />
              Start Over
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageGeneration;
