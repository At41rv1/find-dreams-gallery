
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md border-white/20">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-white/70">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentQuestion 
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {currentQ.title}
          </h2>
          <p className="text-white/80 text-lg">
            {currentQ.subtitle}
          </p>
        </div>

        <div className="mb-8">
          {currentQ.type === 'textarea' ? (
            <Textarea
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQ.placeholder}
              className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg resize-none"
            />
          ) : (
            <Input
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQ.placeholder}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg h-12"
            />
          )}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            {isLastQuestion ? (
              <>
                Generate Dream
                <Sparkles className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuestionFlow;
