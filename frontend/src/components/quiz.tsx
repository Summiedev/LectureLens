import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
type QuizModalProps = {
  question: string;
  answers: string[];
  correctAnswer: string;
  time: number;
};

const QuizModal = ({
  question,
  answers,
  correctAnswer,
  time,
}: QuizModalProps) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    if (clickedIndex !== null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
      setProgress((prev) => {
        const newProgress = prev + 100 / time;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [clickedIndex, timeLeft, time]);

  const handleAnswerClick = (index: number) => {
    if (clickedIndex !== null) return;
    setClickedIndex(index);
  };

  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="bg-blue-50 shadow-md rounded-md md:min-w-65 px-5 py-3 flex flex-col gap-4 items-center">
      <div className="w-full flex gap-2 justify-center items-center">
        <Progress value={progress} className="bg-info-50" />
        <span className="text-xs w-3/10">{timeLeft}s left</span>
      </div>
      <div className="ring-2 ring-primary-80/50 min-h-10 w-full bg-primary-80 rounded-md px-3 py-1.5 text-white flex items-center">
        {question}
      </div>
      <div className="w-full flex flex-col gap-2 text-sm">
        {answers.map((answer, index) => {
          const selected = clickedIndex === index;
          const answerIsCorrect = answer === correctAnswer;
          const answered = clickedIndex !== null;

          let colorClasses = "";
          if (answered) {
            if (answerIsCorrect) {
              colorClasses = "bg-green-500 text-white border-green-500";
            } else if (selected) {
              colorClasses = "bg-warning-50 text-white border-warning-50";
            } else {
              colorClasses = "bg-neutral-10 text-neutral-70";
            }
          } else {
            colorClasses =
              "bg-neutral-10 text-neutral-70 hover:bg-neutral-30 hover:text-white";
          }

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => handleAnswerClick(index)}
              className={`text-left shadow-sm border px-4 py-2 rounded-md transition-colors duration-200
                border-neutral-30 cursor-pointer disabled:cursor-not-allowed
                ${colorClasses}`}
            >
              {letters[index]}. {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizModal;
