import { useFormContext } from "react-hook-form";
import { Twitter, Linkedin, Instagram, Github, Facebook } from "lucide-react";
import { SignupFormData } from "../../hooks/useSignupForm";

const SOCIAL_FIELDS = [
  { key: "twitter",   label: "Twitter / X",  icon: Twitter,   placeholder: "https://twitter.com/yourcommunity" },
  { key: "linkedin",  label: "LinkedIn",      icon: Linkedin,  placeholder: "https://linkedin.com/company/..." },
  { key: "instagram", label: "Instagram",     icon: Instagram, placeholder: "https://instagram.com/..." },
  { key: "github",    label: "GitHub",        icon: Github,    placeholder: "https://github.com/..." },
  { key: "facebook",  label: "Facebook",      icon: Facebook,  placeholder: "https://facebook.com/..." },
] as const;

export default function SocialStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 inter">Social Links</h2>
        <p className="text-gray-500 text-sm mt-1 inter">
          Help people find your community online. All fields are optional.
        </p>
      </div>

      <div className="space-y-4">
        {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label
              htmlFor={`social-${key}`}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter flex items-center gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </label>
            <input
              id={`social-${key}`}
              {...register(`socialLinks.${key}`)}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
                errors.socialLinks?.[key]
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
            {errors.socialLinks?.[key] && (
              <span className="text-xs text-red-500">
                {errors.socialLinks[key]?.message}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
