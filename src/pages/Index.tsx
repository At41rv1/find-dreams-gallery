
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionFlow from '@/components/QuestionFlow';
import ImageGeneration from '@/components/ImageGeneration';
import { ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {currentStep === 'welcome' && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-3xl mx-auto p-16 bg-white/80 backdrop-blur-xl border-0 shadow-2xl shadow-pink-200/50 text-center rounded-3xl">
              <div className="mb-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Sparkles className="w-16 h-16 text-pink-500 animate-pulse" />
                    <div className="absolute inset-0 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
                  </div>
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
                  Find Dreams
                </h1>
                <p className="text-2xl text-gray-700 mb-12 leading-relaxed font-light">
                  Transform your imagination into stunning AI-generated images
                </p>
              </div>
              
              <div className="text-gray-600 mb-16 space-y-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
                  <p className="text-xl">Describe your dream vision through 5 simple questions</p>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
                  <p className="text-xl">Watch AI bring your dreams to life</p>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
                  <p className="text-xl">Download your personalized dream image</p>
                </div>
              </div>

              <Button 
                onClick={handleStartJourney}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
              >
                Begin Your Dream Journey
                <ArrowRight className="ml-3 w-6 h-6" />
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
