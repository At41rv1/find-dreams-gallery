
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionFlow from '@/components/QuestionFlow';
import ImageGeneration from '@/components/ImageGeneration';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Main Content */}
      <div className="relative z-10">
        {currentStep === 'welcome' && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-2xl mx-auto p-12 bg-white shadow-xl border border-gray-200 text-center">
              <div className="mb-12">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                  Find Dreams
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform your imagination into stunning AI-generated images
                </p>
              </div>
              
              <div className="text-gray-600 mb-12 space-y-6">
                <p className="text-lg">Describe your dream vision through 5 simple questions</p>
                <p className="text-lg">Watch AI bring your dreams to life</p>
                <p className="text-lg">Download your personalized dream image</p>
              </div>

              <Button 
                onClick={handleStartJourney}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
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
