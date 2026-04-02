import React from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Community_Info from "../Sections/Community_Info";
import { Link } from "react-router";

let Steps = [
  {
    id: 1,
    title: "Info",
    Element: <Community_Info />,
  },
  {
    id: 2,
    title: "Set Up Your Organization",
    description: "Provide details about your organization to create a workspace.",
  },
  {
    id: 3,
    title: "Invite Team Members",
    description: "Add your team members to collaborate and manage tasks together.",
  },
  {
    id: 4,
    title: "Start Managing Tasks",
    description: "Create and assign tasks, track progress, and stay organized.",
  },
];

const SignUpPage = () => {
  let [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div className="w-screen  flex inter ">
      <div className="left w-1/2 bg-cover bg-center relative top-0  ">
        <div className="absolute top-0 left-0 w-full z-50 flex items-center bg-transparent p-4">
          <img src="/logoWithoutText.png" alt="Logo" className="w-16 h-16" />
          <h1 className="text-2xl text-white ml-2 font-bold inter">CommDesk</h1>
        </div>
        <img
          src="https://img.freepik.com/premium-photo/lego-man-with-glasses-holding-tablet-with-picture-man-holding-tablet_644690-181393.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Login Icon"
          className="w-full h-full mx-auto  object-cover absolute"
        />
      </div>
      <div className="right w-1/2 flex flex-col items-center justify-between">
        <div className="Steps w-[80%]  flex gap-[2vw] mt-[2vh]   ">
          {Steps.map((step) => (
            <div
              key={step.id}
              className="Step mb-6 flex items-center gap-4 text-gray-700"
              onClick={() => setCurrentStep(step.id)}
            >
              <div
                className={`Number ${currentStep === step.id ? "bg-[#4f46e5]" : ""}  ${currentStep !== step.id ? "border-2 border-gray-300" : ""} py-[1vh] px-[2vh] rounded-full text-[1vw] font-bold ${currentStep === step.id ? "text-white" : "text-gray-700"}`}
              >
                {step.id}
              </div>
              {currentStep === step.id && (
                <div className="Details">
                  <h3 className="text-lg font-semibold inter text-gray-700">{step.title}</h3>
                </div>
              )}
              {Steps.length !== step.id && <div className="Line w-8 h-1 bg-gray-300"></div>}
            </div>
          ))}
        </div>

        <div className="Navigation_Buttons w-[80%] flex justify-end gap-4 mb-6  flex-col items-center overflow-x-hidden relative">
          {Steps[currentStep - 1].Element}
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, Steps.length))}
            disabled={currentStep === Steps.length}
            className="w-full bg-[#4f46e5] text-white py-2  hover:bg-blue-600 transition duration-200 inter  mt-[2vh] text-lg"
          >
            Continue to Step {currentStep + 1}
          </button>

          <p className="text-gray-500">Cancel registration</p>
        </div>

        <div className="w-[80%] mt-[5vh]  flex items-center justify-center py-[2vh]">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Login Here!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
