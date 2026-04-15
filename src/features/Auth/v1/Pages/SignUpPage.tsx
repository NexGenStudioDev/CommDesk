import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { useSignupForm, STEP_FIELDS, SignupFormData } from "../hooks/useSignupForm";
import { submitCommunitySignup } from "../api/signup";
import StepProgress from "../components/signup/StepProgress";
import CommunityStep from "../components/signup/CommunityStep";
import ContactStep from "../components/signup/ContactStep";
import SocialStep from "../components/signup/SocialStep";
import OwnerStep from "../components/signup/OwnerStep";
import ReviewStep from "../components/signup/ReviewStep";
import SuccessScreens from "../components/signup/SuccessScreens";

const TOTAL_STEPS = 5;

const STEP_COMPONENTS: Record<number, () => React.ReactElement> = {
  1: () => <CommunityStep />,
  2: () => <ContactStep />,
  3: () => <SocialStep />,
  4: () => <OwnerStep />,
  5: () => <ReviewStep />,
};

const CURRENT_YEAR = new Date().getFullYear();

type PostState = "idle" | "email" | "pending";

export default function SignUpPage() {
  const methods = useSignupForm();
  const { handleSubmit, trigger, setError, formState: { isSubmitting } } = methods;

  const [step, setStep] = useState(1);
  const [post, setPost] = useState<PostState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const goNext = async () => {
    const fields = STEP_FIELDS[step] as (keyof SignupFormData)[];
    const valid = fields.length ? await trigger(fields) : true;
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      await submitCommunitySignup(data);
      setPost("email");
    } catch (err: unknown) {
      const e = err as { status?: number; data?: { message?: string; errors?: Record<string, string> } };
      if (e.status === 422 && e.data?.errors) {
        Object.entries(e.data.errors).forEach(([rawField, msg]) => {
          // Normalize snake_case backend keys → camelCase RHF keys
          const field = rawField.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
          if (field in methods.getValues()) {
            setError(field as keyof SignupFormData, { message: msg });
          }
        });
      } else {
        setServerError(e.data?.message ?? "Something went wrong. Please try again.");
      }
    }
  });

  useEffect(() => {
    if (post !== "email") return;
    const id = setTimeout(() => setPost("pending"), 3500);
    return () => clearTimeout(id);
  }, [post]);

  return (
    <div className="w-screen h-screen flex inter overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex w-[45%] xl:w-[42%] relative flex-col">
        <img
          src="https://img.freepik.com/premium-photo/lego-man-with-glasses-holding-tablet-with-picture-man-holding-tablet_644690-181393.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Community"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/60 to-purple-900/70" />

        <div className="relative z-10 flex flex-col h-full p-10 justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src="/logoWithoutText.png" alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-white tracking-tight">CommDesk</span>
          </div>

          {/* Pitch */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">
                Join the future of community management
              </span>
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                Build something <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                  extraordinary
                </span>
              </h1>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
              CommDesk gives communities a powerful workspace to manage members, events, and communications in one place.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "10k+", label: "Communities" },
                { value: "500k+", label: "Members" },
                { value: "99.9%", label: "Uptime" },
                { value: "4.9★", label: "Rating" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-indigo-300 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-indigo-400 text-xs">© {CURRENT_YEAR} CommDesk. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <img src="/logoWithoutText.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-gray-800">CommDesk</span>
        </div>

        <div className="flex-1 flex items-start justify-center py-8 px-6">
          <div className="w-full max-w-[480px]">

            {post !== "idle" ? (
              <SuccessScreens stage={post} />
            ) : (
              <div className="space-y-8">
                {/* Step progress */}
                <StepProgress current={step} total={TOTAL_STEPS} />

                {/* Form */}
                <FormProvider {...methods}>
                  <form onSubmit={onSubmit} noValidate>
                    {/* Step content with slide animation */}
                    <div
                      key={step}
                      className="animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                      {STEP_COMPONENTS[step]()}
                    </div>

                    {/* Server error */}
                    {serverError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 inter">
                        {serverError}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 gap-3">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inter"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < TOTAL_STEPS ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all inter shadow-sm shadow-indigo-200"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all inter shadow-sm shadow-indigo-200"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting…
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </FormProvider>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 inter">
                  Already have an account?{" "}
                  <Link to="/" className="text-indigo-600 font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
