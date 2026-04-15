import { Mail, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Stage = "email" | "pending";

export default function SuccessScreens({ stage }: { stage: Stage }) {
  if (stage === "email") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
          <Mail className="w-9 h-9 text-indigo-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 inter">Check your email</h2>
          <p className="text-gray-500 text-sm inter max-w-xs">
            We've sent a verification link to your email address. Please verify to continue.
          </p>
        </div>
        <div className="w-full max-w-xs bg-indigo-50 rounded-xl p-4 text-xs text-indigo-700 inter">
          Didn't receive it? Check your spam folder or wait a few minutes.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
      <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
        <Clock className="w-9 h-9 text-amber-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 inter">Pending Approval</h2>
        <p className="text-gray-500 text-sm inter max-w-xs">
          Your community registration is under review. We typically respond within 24–48 hours.
        </p>
      </div>
      <div className="w-full max-w-xs border border-gray-200 rounded-xl p-4 space-y-3 text-left">
        {["Application submitted", "Email verified", "Admin review", "Community approved"].map(
          (step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 2
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-sm inter ${i < 2 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
          )
        )}
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition-colors inter"
      >
        Go to Login <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
