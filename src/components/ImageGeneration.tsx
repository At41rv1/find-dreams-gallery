
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RefreshCw, Home, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ImageGenerationProps {
  answers: string[];
  onStartOver: () => void;
}

const ImageGeneration = ({ answers, onStartOver }: ImageGenerationProps) => {
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

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
          'Authorization': 'Bearer 8973891784627370182992973'
        },
        body: JSON.stringify({
          model: "HeckAI/google/gemini-2.5-flash-preview",
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
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      const prompt = data.choices[0].message.content.trim();
      setGeneratedPrompt(prompt);
      
      // Automatically proceed to image generation
      generateImage(prompt);
      
    } catch (err) {
      setError('Failed to generate prompt. Please try again.');
      console.error('Prompt generation error:', err);
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
          'Authorization': 'Bearer 938888749273972'
        },
        body: JSON.stringify({
          model: "TogetherImage/black-forest-labs/FLUX.1-kontext-max",
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.data[0].url);
      
      toast({
        title: "Dream Generated! ✨",
        description: "Your dream image has been created successfully!",
      });
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Image generation error:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `find-dreams-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded! 📸",
        description: "Your dream image has been saved to your device.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Please try downloading again.",
        variant: "destructive"
      });
    }
  };

  const retryGeneration = () => {
    setGeneratedImage('');
    setGeneratedPrompt('');
    setError('');
    generateImagePrompt();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-md border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Creating Your Dream
          </h2>
          <div className="flex justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse animation-delay-500" />
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse animation-delay-1000" />
          </div>
        </div>

        {(isGeneratingPrompt || isGeneratingImage) && (
          <div className="text-center mb-8">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white/80 text-lg">
              {isGeneratingPrompt ? 'Crafting your dream prompt...' : 'Bringing your dream to life...'}
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {generatedPrompt && !isGeneratingPrompt && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">Generated Prompt:</h3>
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <p className="text-white/90 italic">{generatedPrompt}</p>
            </div>
          </div>
        )}

        {generatedImage && (
          <div className="mb-8">
            <div className="relative group">
              <img 
                src={generatedImage} 
                alt="Generated Dream" 
                className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {generatedImage && (
            <Button
              onClick={downloadImage}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              <Download className="mr-2 w-4 h-4" />
              Download Dream
            </Button>
          )}
          
          <Button
            onClick={retryGeneration}
            disabled={isGeneratingPrompt || isGeneratingImage}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Generate New Dream
          </Button>
          
          <Button
            onClick={onStartOver}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Home className="mr-2 w-4 h-4" />
            Start Over
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ImageGeneration;
