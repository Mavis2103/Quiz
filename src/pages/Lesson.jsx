import { useNavigate } from "react-router";
import { useState } from "react";

const Lesson = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const onSubmit = () => {
    if ("lesson" in formData) {
      navigate("/quiz", {
        state: formData,
      });
    }
  };
  const handleSelectChange = (ev) => {
    setFormData((oldData) => ({ ...oldData, lesson: ev.target.value }));
  };
  // const handleNameChange = (ev) => {
  //   setFormData((oldData) => ({ ...oldData, name: ev.target.value }));
  // };
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="hero bg-base-200 w-3/5 shadow-2xl shadow-slate-500 rounded-2xl py-5">
        <div className="hero-content w-full flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Der Die Das: Booster</h1>
            <p className="py-6">Magical Mastery</p>
            <p className="">Hello. We've been expecting you....</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              {/* <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Please enter your nick name:
                  </span>
                </label>
                <input
                  type="text"
                  onChange={handleNameChange}
                  placeholder="Name"
                  className="input input-bordered"
                />
              </div> */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Please choose your lesson pack:
                  </span>
                </label>
                <div className="form-control w-full max-w-xs">
                  <select
                    className="select select-bordered"
                    onChange={handleSelectChange}
                    defaultValue={0}
                  >
                    <option disabled value={0}>
                      Pick one
                    </option>
                    <option value={0}>[1] English 100 Basic words</option>
                    <option value={1}>[2] DDD common endings</option>
                    <option value={2}>[3] DDD all in action</option>
                  </select>
                  {/* <label className="label">
                    <span className="label-text-alt">Alt label</span>
                  </label> */}
                </div>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={onSubmit}>
                  Let's go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
