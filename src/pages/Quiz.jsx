import axios from "axios";
import { AES, enc, mode, format } from "crypto-js";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigation } from "react-router";

const listLessons = [5, 3, 4, 2];
function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [select, setSelect] = useState();
  const { state } = useLocation();
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
  const handleAnswer = useCallback(
    (id) => () => {
      setQuestions((old) => {
        old[id].status = questions[id]?.correct === select[id] ? "✓" : "✕";
        return old;
      });
      setCurrentQ((old) => old + 1);
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
        return old;
      });
      setCurrentQ((old) => old + 1);
    },
    []
  );

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="mockup-window border carousel bg-base-300 w-3/5 mb-8 overflow-y-scroll">
        <div key={questions[currentQ]?.id} className="carousel-item w-full">
          <div className="px-8 pb-5 text-end w-full">
            <h1 className="text-2xl font-bold mb-5 text-start">
              <span>Question {currentQ}: </span>
              {questions[currentQ]?.q}
            </h1>
            <div className="form-control bg-white mb-3 p-3 rounded-xl">
              <label className="label cursor-pointer justify-start">
                <input
                  type="radio"
                  name={currentQ}
                  value={questions[currentQ]?.a}
                  className="radio checked:bg-blue-500 mr-5"
                  onChange={handleSelect(currentQ)}
                />
                <span className="label-text">{questions[currentQ]?.a}</span>
              </label>
            </div>
            <div className="form-control bg-white mb-3 p-3 rounded-xl">
              <label className="label cursor-pointer justify-start">
                <input
                  type="radio"
                  name={currentQ}
                  value={questions[currentQ]?.b}
                  className="radio checked:bg-blue-500 mr-5"
                  onChange={handleSelect(currentQ)}
                />
                <span className="label-text">{questions[currentQ]?.b}</span>
              </label>
            </div>
            <div className="form-control bg-white mb-3 p-3 rounded-xl">
              <label className="label cursor-pointer justify-start">
                <input
                  type="radio"
                  name={currentQ}
                  value={questions[currentQ]?.c}
                  className="radio checked:bg-blue-500 mr-5"
                  onChange={handleSelect(currentQ)}
                />
                <span className="label-text">{questions[currentQ]?.c}</span>
              </label>
            </div>
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
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {questions?.map((q, id) => (
          <>
            {questions[id]?.status ? (
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
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
