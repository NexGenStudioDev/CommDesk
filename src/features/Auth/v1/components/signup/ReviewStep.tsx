import { useFormContext } from "react-hook-form";
import {
  Globe, MapPin, Mail, Phone, Twitter, Linkedin,
  Instagram, Github, Facebook, User, Lock, Image,
} from "lucide-react";
import { SignupFormData } from "../../hooks/useSignupForm";

function ReviewRow({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 p-1.5 bg-indigo-50 rounded-md">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
        <span className="text-sm text-gray-700 inter break-all">{value}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider inter">{title}</h4>
      </div>
      <div className="px-4 divide-y divide-gray-100">{children}</div>
    </div>
  );
}

export default function ReviewStep() {
  const { watch } = useFormContext<SignupFormData>();
  const data = watch();

  const hasSocials = Object.values(data.socialLinks ?? {}).some(Boolean);

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 inter">Review & Submit</h2>
        <p className="text-gray-500 text-sm mt-1 inter">
          Confirm your details before submitting. You can go back to edit any step.
        </p>
      </div>

      {/* Logo Preview */}
      {data.communityLogo && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <img
            src={data.communityLogo}
            alt="Community Logo"
            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200"
          />
          <div>
            <p className="font-semibold text-gray-800 inter">{data.communityName}</p>
            <p className="text-xs text-gray-500 inter">{data.city}, {data.country}</p>
          </div>
        </div>
      )}

      <Section title="Community">
        <ReviewRow label="Name"        value={data.communityName}    icon={Globe} />
        <ReviewRow label="Bio"         value={data.communityBio}     icon={Globe} />
        <ReviewRow label="Website"     value={data.communityWebsite} icon={Globe} />
        <ReviewRow label="Logo"        value={data.communityLogo ? "Uploaded ✓" : undefined} icon={Image} />
      </Section>

      <Section title="Contact">
        <ReviewRow label="Country"  value={data.country}       icon={MapPin} />
        <ReviewRow label="City"     value={data.city}          icon={MapPin} />
        <ReviewRow label="Email"    value={data.officialEmail} icon={Mail} />
        <ReviewRow label="Phone"    value={data.contactPhone}  icon={Phone} />
      </Section>

      {hasSocials && (
        <Section title="Social Links">
          <ReviewRow label="Twitter"   value={data.socialLinks?.twitter}   icon={Twitter} />
          <ReviewRow label="LinkedIn"  value={data.socialLinks?.linkedin}  icon={Linkedin} />
          <ReviewRow label="Instagram" value={data.socialLinks?.instagram} icon={Instagram} />
          <ReviewRow label="GitHub"    value={data.socialLinks?.github}    icon={Github} />
          <ReviewRow label="Facebook"  value={data.socialLinks?.facebook}  icon={Facebook} />
        </Section>
      )}

      <Section title="Organizer Account">
        <ReviewRow label="Full Name" value={data.fullName} icon={User} />
        <ReviewRow label="Email"     value={data.email}    icon={Mail} />
        <ReviewRow label="Password"  value="••••••••"      icon={Lock} />
      </Section>

      <p className="text-xs text-gray-400 inter text-center pt-1">
        By submitting, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
