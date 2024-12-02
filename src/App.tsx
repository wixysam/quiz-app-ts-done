import { useState, useRef } from "react";
import "./App.css";

const calculateWixAge = (): number => {
  const wixFounded = new Date("2006-06-01");
  const today = new Date();
  return (
    today.getFullYear() -
    wixFounded.getFullYear() -
    (today <
    new Date(today.getFullYear(), wixFounded.getMonth(), wixFounded.getDate())
      ? 1
      : 0)
  );
};

type QuestionType = "multiple_choice" | "true_false" | "numeric";

type AnswerType = string | boolean | number;

interface BaseQuestion {
  type: QuestionType;
  question: string;
  answer: AnswerType;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  options: string[];
  answer: string;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "true_false";
  answer: boolean;
}

interface NumericQuestion extends BaseQuestion {
  type: "numeric";
  answer: number;
}

type Question = MultipleChoiceQuestion | TrueFalseQuestion | NumericQuestion;

// Array of Questions
const questions: Array<Question> = [
  {
    type: "multiple_choice",
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    type: "true_false",
    question: "The Wix Campus has a pool.",
    answer: false,
  },
  {
    type: "true_false",
    question: "The sky is blue.",
    answer: true,
  },
  {
    type: "multiple_choice",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    type: "numeric",
    question: "How old is Wix?",
    answer: calculateWixAge(),
  },
];

const getNextQuestion = (currentQuestion: Question): Question | null => {
  const currentIndex = questions.findIndex(
    (question) => question.question === currentQuestion.question
  );

  return currentIndex < questions.length ? questions[currentIndex + 1] : null;
};

function App() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    questions[0]
  );
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<"Correct!" | "Wrong!" | "">("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const startQuiz = () => {
    setCurrentQuestion(questions[0]);
    setScore(0);
    setFeedback("");
    setShowResults(false);
  };

  const checkAnswer = (selectedAnswer: AnswerType) => {
    const question = currentQuestion;
    const isCorrect = selectedAnswer === question.answer;

    setFeedback(isCorrect ? "Correct!" : "Wrong!");
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      const nextQuestion = getNextQuestion(currentQuestion);

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setFeedback("");
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  // Render Multiple Choice Options
  const renderOptions = (options: string[]) => {
    return options.map((option, index) => (
      <button
        key={index}
        onClick={() => checkAnswer(option)}
        className="option-button"
      >
        {option}
      </button>
    ));
  };

  // Render True/False Options
  const renderTrueFalseOptions = () => (
    <>
      <button onClick={() => checkAnswer(true)} className="option-button">
        True
      </button>
      <button onClick={() => checkAnswer(false)} className="option-button">
        False
      </button>
    </>
  );

  // Render Numeric Options
  const renderNumericOptions = () => (
    <>
      <input type="number" ref={inputRef} className="option-input" />
      <button
        onClick={() => checkAnswer(Number(inputRef.current?.value) || 0)}
        className="option-button"
      >
        Submit
      </button>
    </>
  );

  return (
    <div className="app">
      <h1>Quiz App Done</h1>
      {showResults ? (
        <div>
          <h2>
            You scored {score} out of {questions.length}
          </h2>
          <button onClick={startQuiz} className="start-button">
            Restart Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-container">
            <h2>{currentQuestion.question}</h2>
            {(() => {
              switch (currentQuestion.type) {
                case "multiple_choice":
                  return renderOptions(currentQuestion.options);
                case "true_false":
                  return renderTrueFalseOptions();
                case "numeric":
                  return renderNumericOptions();
              }
            })()}
          </div>
          <div
            className={`feedback ${
              feedback === "Correct!" ? "correct" : "wrong"
            }`}
          >
            {feedback}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
