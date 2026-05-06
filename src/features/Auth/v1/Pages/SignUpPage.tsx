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
      const finalData = {
        ...data,
        contactPhone: `${data.phoneCode}${data.phoneNumber}`,
      };
      await submitCommunitySignup(finalData as any);
      setPost("email");
    } catch (err: unknown) {
      const e = err as { status?: number; data?: { message?: string; errors?: Record<string, string> } };
      
      if (e.status === 422 && e.data?.errors) {
        Object.entries(e.data.errors).forEach(([rawField, msg]) => {
          const field = rawField.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
          if (field in methods.getValues()) {
            setError(field as keyof SignupFormData, { message: msg });
          }
        });
      } else {
        const errorMessages: Record<number, string> = {
          400: "Invalid request. Please check your information and try again.",
          401: "Session expired. Please refresh the page.",
          403: "You don't have permission to perform this action.",
          409: "A community with these details already exists.",
          429: "Too many requests. Please wait a moment before trying again.",
          500: "Server error. Our engineers are investigating. Please try again later.",
        };

        const message = e.data?.message || (e.status ? errorMessages[e.status] : null) || "Unable to connect to service. Please check your internet connection.";
        setServerError(message);
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
      <div className="hidden lg:flex w-[45%] xl:w-[42%] relative flex-col overflow-hidden bg-indigo-950">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        </div>

        {/* Abstract Illustration Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Backdrop Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/90 via-indigo-950/95 to-purple-900/90" />

        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16 justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <img src="/logoWithoutText.png" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CommDesk</span>
          </div>

          {/* Main Content Area */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">
                  The Future of Management
                </span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15]">
                Empower Your <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300">
                  Community
                </span>
              </h1>
              
              <p className="text-indigo-100/70 text-lg leading-relaxed max-w-md font-medium">
                The all-in-one workspace designed to help you organize, grow, and manage your members seamlessly.
              </p>
            </div>

            {/* Highlight Cards */}
            <div className="space-y-4">
              {[
                { 
                  icon: <ArrowRight className="w-5 h-5" />, 
                  title: "12k+ Communities", 
                  desc: "Trusted by leaders worldwide.",
                  color: "from-blue-500/20 to-indigo-500/20"
                },
                { 
                  icon: <ArrowRight className="w-5 h-5" />, 
                  title: "Real-time Insights", 
                  desc: "Detailed analytics at your fingertips.",
                  color: "from-purple-500/20 to-pink-500/20"
                },
                { 
                  icon: <ArrowRight className="w-5 h-5" />, 
                  title: "Scalable Infrastructure", 
                  desc: "Grows with your community's needs.",
                  color: "from-indigo-500/20 to-purple-500/20"
                }
              ].map((card, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1 group`}
                >
                  <div className={`p-2.5 rounded-xl bg-linear-to-br ${card.color} border border-white/10 text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">{card.title}</h3>
                    <p className="text-indigo-200/60 text-xs font-medium">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <p className="text-indigo-400/60 text-xs font-medium">© {CURRENT_YEAR} CommDesk Inc.</p>
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-wider">System Operational</span>
            </div>
          </div>
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
