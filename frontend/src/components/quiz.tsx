import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
type QuizModalProps = {
  question: string;
  answers: string[];
  correctAnswer: string;
  time: number;
  className?: string;
  questionId: string | number;
  dispatchQuiz: React.ActionDispatch<React.AnyActionArg>;
};

const QuizModal = ({
  question,
  answers,
  correctAnswer,
  questionId,
  time,
  className,
  dispatchQuiz,
}: QuizModalProps) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(time);
  const progress = Math.min(100, ((time - timeLeft) / time) * 100);
  useEffect(() => {
    if (clickedIndex !== null) return;
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [clickedIndex, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && clickedIndex === null) {
      dispatchQuiz({ type: "HIDE_QUIZ" });
    }
  }, [timeLeft, clickedIndex, dispatchQuiz]);

  const handleAnswerClick = (index: number) => {
    if (clickedIndex !== null) return;
    setClickedIndex(index);
    dispatchQuiz({
      type: "ADD_ANSWERED_QUIZ",
      payload: {
        questionId,
        selectedAnswer: answers[index],
        correct: answers[index] === correctAnswer,
      },
    });
    setTimeout(() => {
      dispatchQuiz({ type: "HIDE_QUIZ" });
    }, 1500);
  };

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div
      className={`bg-blue-50 shadow-md rounded-md md:min-w-65 max-w-85 px-5 py-3 flex flex-col gap-4 items-center ${className}`}
    >
      <div className="w-full flex gap-2 justify-center items-center">
        <Progress value={progress} className="bg-info-50/20" />
        <span className="text-xs w-3/10">{timeLeft}s left</span>
      </div>
      <div className="ring-2 ring-primary-80/50 min-h-10 w-full bg-primary-80 rounded-md px-3 py-1.5 text-white flex items-center">
        {question}
      </div>
      <div className="w-full flex flex-col gap-2 text-sm">
        {answers?.map((answer, index) => {
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
