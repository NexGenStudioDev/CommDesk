import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  MapPin,
  Lock,
  Briefcase,
  Tag,
  Heart,
  ShieldCheck,
  X,
} from "lucide-react";
import { SignupFormData } from "../../hooks/useSignupForm";

interface PasswordRuleProps {
  met: boolean;
  label: string;
}

function PasswordRule({ met, label }: PasswordRuleProps) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? "text-emerald-600" : "text-slate-400"}`}>
      {met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </div>
  );
}

const ROLES = ["ORGANISER", "ADMIN", "COORDINATOR", "MODERATOR"];
const INTERESTS = ["Technology", "Education", "Healthcare", "Environment", "Arts & Culture", "Social Welfare", "Business", "Sports"];

export default function OwnerStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const password = watch("password") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";
  const skills = watch("skills") ?? [];
  const areaOfInterest = watch("areaOfInterest") ?? [];

  const passwordRules = [
    { met: password.length >= 8, label: "8+ characters" },
    { met: /[0-9]/.test(password), label: "Include number" },
    { met: /[^a-zA-Z0-9]/.test(password), label: "Special character" },
  ];

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setValue("skills", [...skills, skillInput.trim()], { shouldValidate: true });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setValue("skills", skills.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const toggleInterest = (interest: string) => {
    const updated = areaOfInterest.includes(interest)
      ? areaOfInterest.filter((i) => i !== interest)
      : [...areaOfInterest, interest];
    setValue("areaOfInterest", updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Organizer Profile
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Configure the primary administrator account for your community.
        </p>
      </div>

      {/* Basic Information Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <User className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">First Name *</label>
            <input
              {...register("firstName")}
              placeholder="John"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-4 ${errors.firstName ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
            />
            {errors.firstName && <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.firstName.message}</span>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">Last Name *</label>
            <input
              {...register("lastName")}
              placeholder="Doe"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-4 ${errors.lastName ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
            />
            {errors.lastName && <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-4 ${errors.email ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
            />
            {errors.email && <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.email.message}</span>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Location *
            </label>
            <input
              {...register("location")}
              placeholder="City, Country"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-4 ${errors.location ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
            />
            {errors.location && <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.location.message}</span>}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Lock className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Security</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">Password *</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all pr-10 focus:ring-4 ${errors.password ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {passwordRules.map((rule) => (
                <PasswordRule key={rule.label} met={rule.met} label={rule.label} />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">Confirm Password *</label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirmPw ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all pr-10 focus:ring-4 ${errors.confirmPassword ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {password && confirmPassword && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  {password === confirmPassword ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>
      </section>

      {/* Role & Expertise Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Briefcase className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Professional Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">Primary Role</label>
            <select
              {...register("primaryRole")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1 flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Skills (Press Enter) *
            </label>
            <div className={`flex flex-wrap gap-2 p-2 rounded-xl border transition-all ${errors.skills ? "border-red-300 bg-red-50/20" : "border-slate-200 bg-slate-50/30"
              }`}>
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={skills.length === 0 ? "e.g. Management, Public Speaking" : "Add more..."}
                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] py-1"
              />
            </div>
            {errors.skills && <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.skills.message}</span>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 ml-1 flex items-center gap-1.5">
            <Heart className="w-3 h-3" /> Areas of Interest *
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${areaOfInterest.includes(interest)
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
          {errors.areaOfInterest && (
            <span className="text-[11px] text-red-500 ml-1 font-medium">{errors.areaOfInterest.message}</span>
          )}
        </div>
      </section>

      {/* Permissions Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Access Permissions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "internalDashboard", label: "Internal Dashboard", desc: "Access to community analytics & metrics" },
            { id: "communityForum", label: "Community Forum", desc: "Moderate discussions and group permissions" },
            { id: "adminControls", label: "Admin Controls", desc: "Modify system setting and user roles" },
            { id: "superAdmin", label: "Super Admin", desc: "Full system access and data export" },
          ].map((perm) => (
            <label
              key={perm.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${watch(`permissions.${perm.id}` as any)
                ? "border-indigo-200 bg-indigo-50/30"
                : "border-slate-100 bg-white"
                }`}
            >
              <div className="relative flex items-center mt-1">
                <input
                  type="checkbox"
                  {...register(`permissions.${perm.id}` as any)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">{perm.label}</span>
                <span className="text-[11px] text-slate-500 leading-tight">{perm.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Internal Notes */}
      <section className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 ml-1">Internal Notes (Optional)</label>
        <textarea
          {...register("internalNotes")}
          rows={3}
          placeholder="Anything else we should know?"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
        />
      </section>
    </div>
  );
}
