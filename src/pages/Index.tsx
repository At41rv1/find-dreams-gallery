
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
            <Card className="max-w-2xl mx-auto p-12 bg-white/90 backdrop-blur-xl border-0 shadow-2xl shadow-pink-200/50 text-center rounded-3xl">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Sparkles className="w-12 h-12 text-pink-500" />
                    <div className="absolute inset-0 w-12 h-12 bg-pink-500/20 rounded-full blur-xl"></div>
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
                  Find Dreams
                </h1>
                <p className="text-xl text-gray-700 mb-2 leading-relaxed">
                  Transform your imagination into stunning AI-generated images
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Answer 5 simple questions and watch your dreams come to life
                </p>
              </div>

              <Button 
                onClick={handleStartJourney}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
              >
                Begin Your Dream Journey
                <ArrowRight className="ml-2 w-5 h-5" />
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
