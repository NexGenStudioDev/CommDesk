import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { SignupFormData } from "../../hooks/useSignupForm";

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? "text-green-600" : "text-gray-400"}`}>
      {met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </div>
  );
}

export default function OwnerStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  const [showPw, setShowPw] = useState(false);
  const pw = watch("password") ?? "";

  const rules = [
    { met: pw.length >= 8,        label: "At least 8 characters" },
    { met: /[0-9]/.test(pw),      label: "At least one number" },
    { met: /[^a-zA-Z0-9]/.test(pw), label: "At least one special character" },
  ];

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 inter">Organizer Account</h2>
        <p className="text-gray-500 text-sm mt-1 inter">
          This will be the primary admin account for your community.
        </p>
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="fullName"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Full Name *
        </label>
        <input
          id="fullName"
          {...register("fullName")}
          placeholder="e.g. Jane Doe"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
            errors.fullName
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.fullName && (
          <span className="text-xs text-red-500">{errors.fullName.message}</span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Email Address *
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
            errors.email
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Password *
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-all ${
            errors.password
              ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200"
              : "border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
          }`}
        >
          <input
            id="password"
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="Create a strong password"
            className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent inter"
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <span className="text-xs text-red-500">{errors.password.message}</span>
        )}
        <div className="flex flex-col gap-1 mt-1">
          {rules.map((r) => (
            <PasswordRule key={r.label} met={r.met} label={r.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
