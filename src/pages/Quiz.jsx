import axios from "axios";
import { AES, enc, mode, format } from "crypto-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const listLessons = [5, 3, 4, 2];
function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [select, setSelect] = useState({});
  const [easyMode, setEasyMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = useRef({ score: 0, accuracy: 0 });
  useEffect(() => {
    axios
      .get(
        `http://app.weczs.xyz:8080/api/v1/quizzes/${
          listLessons[state?.lesson ?? listLessons.length - 1]
        }/questions`
      )
      .then((rs) => {
        setQuestions(rs.data.questions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const selected = useMemo(
    () => questions.filter((q) => q?.status).length + 1, //default is selected question 1
    [currentQ]
  );
  const canReviewQuestions = useMemo(
    () => questions.filter((q) => q?.status === "✕").length > 0,
    [questions?.length, currentQ]
  );
  const handleAnswer = useCallback(
    (id) => () => {
      if (id in select) {
        const scoreOfCurrentQuestion = easyMode ? 1 : 3;
        const statusAnswer = questions[id]?.correct === select[id];
        setQuestions((old) => {
          old[id].status = statusAnswer ? "✓" : "✕";
          old[id].score = scoreOfCurrentQuestion;
          return [...old];
        });
        if (statusAnswer) {
          result.current.score = result.current.score + scoreOfCurrentQuestion;
        }
        const answersTrue =
          questions.filter((q) => q.status === "✓").length + statusAnswer;
        result.current.accuracy = answersTrue / selected;
        if (currentQ < questions?.length - 1) {
          setCurrentQ((old) => old + 1);
        } else {
          setCompleted(true);
        }
      }
    },
    [select]
  );
  const handleSelect = useCallback(
    (id) => (e) => {
      setSelect((oldSelect) => ({
        ...oldSelect,
        [id]: e.target.value,
      }));
    },
    []
  );
  const handleSkip = useCallback(
    (id) => () => {
      setQuestions((old) => {
        old[id].status = "O";
        return [...old];
      });
      if (currentQ < questions?.length - 1) {
        setCurrentQ((old) => old + 1);
      } else {
        setCompleted(true);
      }
    },
    [currentQ]
  );
  const handleEasyModeChange = () => {
    setEasyMode(!easyMode);
    if (!easyMode) {
      setQuestions((oldQ) => {
        oldQ.forEach((q) => {
          const keysInCorrect = Object.keys(q).filter(
            (key) => ["a", "b", "c"].includes(key) && q[key] !== q["correct"]
          );
          q.disabled =
            keysInCorrect[Math.floor(Math.random() * keysInCorrect.length)];
        });
        return [...oldQ];
      });
    } else {
      setQuestions((oldQ) => {
        oldQ.forEach((q) => {
          Reflect.deleteProperty(q, "disabled");
        });
        return [...oldQ];
      });
    }
  };
  const onReview = () => {
    setCurrentQ(0);
    setSelect({});
    result.current = {
      score: 0,
      accuracy: 0,
    };
    setQuestions(
      questions
        .map((q) => {
          if (q?.status === "✕") {
            const { score, status, ...base } = q;
            return base;
          }
        })
        .filter(Boolean)
    );
  };
  return (
    <div className="w-screen my-10 flex flex-col justify-center items-center">
      <div className="mockup-window border bg-base-300 w-4/5 md:w-3/5 mb-8">
        <div className="px-8 pb-5 text-end w-full">
          <div className="md:flex md:justify-between">
            <h1 className="text-2xl font-bold mb-5 text-start">
              <span>Question {currentQ}: </span>
              {questions[currentQ]?.q}
            </h1>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text mr-5">Easy Mode</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={handleEasyModeChange}
                />
              </label>
            </div>
          </div>
          {["a", "b", "c"].map(
            (ele) =>
              ele !== questions[currentQ]?.disabled && (
                <div
                  key={ele}
                  className="form-control bg-white mb-3 p-3 rounded-xl"
                >
                  <label className="label cursor-pointer justify-start">
                    <input
                      type="radio"
                      name={`item-${currentQ}`}
                      value={questions[currentQ]?.[ele]}
                      checked={
                        select?.[currentQ] === questions[currentQ]?.[ele]
                      }
                      className="radio checked:bg-blue-500 mr-5"
                      onChange={handleSelect(currentQ)}
                    />
                    <span className="label-text">
                      {questions[currentQ]?.[ele]}
                    </span>
                  </label>
                </div>
              )
          )}
          {!completed && (
            <>
              <button
                className="btn btn-primary btn-outline justify-self-end mt-3 mr-3"
                onClick={handleSkip(currentQ)}
              >
                Skip
              </button>
              <button
                className="btn btn-primary justify-self-end mt-3"
                onClick={handleAnswer(currentQ)}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
      <div className="w-4/5 md:w-3/5 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex-1 grid grid-cols-12 gap-2">
          {questions?.map((q, id) =>
            questions[id]?.status ? (
              <nav
                key={q.id}
                className={`btn btn-xs ${
                  {
                    "✓": "btn-success",
                    "✕": "btn-error",
                    O: "btn-ghost",
                  }[questions[id]?.status]
                }`}
              >
                {questions[id]?.status}
              </nav>
            ) : (
              <nav
                key={q.id}
                className={`btn btn-xs ${
                  currentQ === id ? "btn-outline" : "btn-disabled"
                }`}
                onClick={() => setCurrentQ(id)}
              >
                {id}
              </nav>
            )
          )}
        </div>
        <div className="flex-1 grid place-items-center mt-10 md:mt-0">
          <div className="stats shadow-2xl">
            <div className="stat place-items-center">
              <div className="stat-title">Score</div>
              <div className="stat-value">{result.current.score}</div>
              <div className="stat-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => navigate("/")}
                >
                  Restart
                </button>
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Accuracy</div>
              <div className="stat-value text-secondary">
                {(result.current.accuracy * 100).toFixed(1)}%
              </div>
              <div className="stat-actions">
                <button
                  className={`btn btn-sm btn-success ${
                    canReviewQuestions ? "" : "btn-disabled"
                  }`}
                  disabled={!canReviewQuestions}
                  onClick={onReview}
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
