
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
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow opacity-60"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-r from-purple-200/25 to-pink-200/25 rounded-full blur-3xl animate-float-medium opacity-70"></div>
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-300/15 to-purple-300/15 rounded-full blur-3xl animate-float-fast opacity-50"></div>
        
        {/* Additional floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-pink-400/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-40 right-40 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce-medium"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-pink-300/40 rounded-full animate-bounce-fast"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {currentStep === 'welcome' && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-2xl mx-auto p-12 bg-white/95 backdrop-blur-2xl border border-pink-100/50 shadow-2xl shadow-pink-200/30 text-center rounded-3xl transform hover:scale-[1.02] transition-all duration-700 ease-out hover:shadow-3xl hover:shadow-pink-200/40">
              <div className="mb-8">
                <div className="flex justify-center mb-8">
                  <div className="relative group">
                    <Sparkles className="w-16 h-16 text-pink-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                    <div className="absolute inset-0 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse-soft"></div>
                    <div className="absolute -inset-2 w-20 h-20 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                </div>
                
                <h1 className="text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-6 animate-gradient-shift bg-size-200 hover:scale-105 transition-transform duration-500">
                  Find Dreams
                </h1>
                
                <div className="space-y-4 mb-10">
                  <p className="text-2xl text-gray-700 leading-relaxed font-light tracking-wide animate-fade-in-up">
                    Transform your imagination into stunning AI-generated images
                  </p>
                  <p className="text-lg text-gray-600 animate-fade-in-up animation-delay-200">
                    Answer 5 simple questions and watch your dreams come to life
                  </p>
                </div>
              </div>

              <div className="relative group">
                <Button 
                  onClick={handleStartJourney}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 rounded-full border-2 border-white/20 backdrop-blur-sm group-hover:border-white/30 animate-bounce-gentle"
                >
                  <span className="relative z-10 flex items-center">
                    Begin Your Dream Journey
                    <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                </Button>
              </div>
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
