
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Sparkles, Heart } from 'lucide-react';

interface QuestionFlowProps {
  onComplete: (answers: string[]) => void;
}

const questions = [
  {
    id: 1,
    title: "What's the main subject of your dream?",
    subtitle: "e.g., dream girl, dream boy, fantasy creature, magical landscape",
    placeholder: "Describe the main focus of your dream image...",
    type: "textarea"
  },
  {
    id: 2,
    title: "What does the place you're thinking of look and feel like?",
    subtitle: "e.g., enchanted forest, futuristic city, peaceful beach, mystical realm",
    placeholder: "Where does your dream take place?",
    type: "textarea"
  },
  {
    id: 3,
    title: "What mood or atmosphere should it have?",
    subtitle: "e.g., serene and peaceful, mysterious and dark, vibrant and energetic",
    placeholder: "What feeling should your dream evoke?",
    type: "input"
  },
  {
    id: 4,
    title: "What colors dominate your dream?",
    subtitle: "e.g., soft pastels, bold neons, warm sunset tones, cool blues",
    placeholder: "What color palette speaks to you?",
    type: "input"
  },
  {
    id: 5,
    title: "Any specific details or magical elements?",
    subtitle: "e.g., glowing effects, sparkles, flowing hair, ethereal lighting",
    placeholder: "Add any special touches to make it uniquely yours...",
    type: "textarea"
  }
];

const QuestionFlow = ({ onComplete }: QuestionFlowProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[currentQuestion].trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <Card className="max-w-3xl mx-auto p-12 bg-white/90 backdrop-blur-xl border-0 shadow-2xl shadow-pink-200/30 rounded-3xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500 font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="flex space-x-3">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-500 transform ${
                      index <= currentQuestion 
                        ? 'bg-gradient-to-r from-pink-400 to-purple-500 scale-110 shadow-lg' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-pink-500 mr-3" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {currentQ.title}
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {currentQ.subtitle}
            </p>
          </div>

          <div className="mb-10">
            {currentQ.type === 'textarea' ? (
              <Textarea
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQ.placeholder}
                className="min-h-40 bg-white/80 border-2 border-pink-100 focus:border-pink-300 text-gray-800 placeholder:text-gray-400 text-lg resize-none rounded-2xl shadow-inner transition-all duration-300 focus:shadow-lg"
              />
            ) : (
              <Input
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQ.placeholder}
                className="bg-white/80 border-2 border-pink-100 focus:border-pink-300 text-gray-800 placeholder:text-gray-400 text-lg h-16 rounded-2xl shadow-inner transition-all duration-300 focus:shadow-lg"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
              className="bg-white/80 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 px-8 py-4 text-lg rounded-full transition-all duration-300 disabled:opacity-50"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLastQuestion ? (
                <>
                  Generate Dream
                  <Sparkles className="ml-2 w-5 h-5" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionFlow;
