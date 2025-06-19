
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionFlow from '@/components/QuestionFlow';
import ImageGeneration from '@/components/ImageGeneration';
import { Sparkles, Cloud, Stars } from 'lucide-react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questions' | 'generating'>('welcome');
  const [answers, setAnswers] = useState<string[]>([]);

  const handleStartJourney = () => {
    setCurrentStep('questions');
  };

  const handleQuestionsComplete = (userAnswers: string[]) => {
    setAnswers(userAnswers);
    setCurrentStep('generating');
  };

  const handleStartOver = () => {
    setCurrentStep('welcome');
    setAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Cloud className="w-16 h-16 text-white/20" />
        </div>
        <div className="absolute top-40 right-20 animate-float animation-delay-1000">
          <Cloud className="w-12 h-12 text-white/15" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float animation-delay-2000">
          <Cloud className="w-20 h-20 text-white/10" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse">
          <Stars className="w-8 h-8 text-yellow-300/40" />
        </div>
        <div className="absolute bottom-1/3 left-1/2 animate-pulse animation-delay-1500">
          <Sparkles className="w-6 h-6 text-pink-300/50" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {currentStep === 'welcome' && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md border-white/20 text-center">
              <div className="mb-8">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Find Dreams
                </h1>
                <p className="text-xl text-white/90 mb-6">
                  Transform your imagination into stunning AI-generated images
                </p>
                <div className="flex justify-center space-x-4 mb-8">
                  <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
                  <Cloud className="w-8 h-8 text-blue-400 animate-bounce" />
                  <Stars className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>
              
              <div className="text-white/80 mb-8 space-y-4">
                <p className="text-lg">✨ Describe your dream vision through 5 magical questions</p>
                <p className="text-lg">🎨 Watch AI bring your dreams to life</p>
                <p className="text-lg">💫 Download your personalized dream image</p>
              </div>

              <Button 
                onClick={handleStartJourney}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
              >
                Begin Your Dream Journey
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Card>
          </div>
        )}

        {currentStep === 'questions' && (
          <QuestionFlow onComplete={handleQuestionsComplete} />
        )}

        {currentStep === 'generating' && (
          <ImageGeneration answers={answers} onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  );
};

export default Index;
