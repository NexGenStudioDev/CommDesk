import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, AlertCircle } from "lucide-react";
import { SignupFormData } from "../../hooks/useSignupForm";
import { uploadCommunityLogo } from "../../api/signup";

export default function CommunityStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoUrl = watch("communityLogo");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Only JPG, PNG, and WEBP files are accepted.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File must be under 2MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    const url = await uploadCommunityLogo(file);
    setValue("communityLogo", url, { shouldValidate: true });
    setUploading(false);
  };

  const handleRemoveLogo = () => {
    setValue("communityLogo", "");
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 inter">Community Information</h2>
        <p className="text-gray-500 text-sm mt-1 inter">Tell us about your community to get started.</p>
      </div>

      {/* Logo Upload */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-dashed border-indigo-300 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-indigo-500 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : logoUrl ? (
              <img src={logoUrl} alt="Community Logo" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-6 h-6 text-indigo-400" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors text-left"
            >
              {logoUrl ? "Change Logo" : "Upload Community Logo"}
            </button>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 2MB · 400×400px recommended</p>
            {logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 w-fit"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        {uploadError && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {uploadError}
          </div>
        )}
      </div>

      {/* Community Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="communityName"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Community Name *
        </label>
        <input
          id="communityName"
          {...register("communityName")}
          placeholder="e.g. React Developers Kenya"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
            errors.communityName
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.communityName && (
          <span className="text-xs text-red-500">{errors.communityName.message}</span>
        )}
      </div>

      {/* Community Bio */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="communityBio"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Community Bio *
        </label>
        <textarea
          id="communityBio"
          {...register("communityBio")}
          rows={3}
          placeholder="What is your community about? What value does it provide?"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none inter ${
            errors.communityBio
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.communityBio && (
          <span className="text-xs text-red-500">{errors.communityBio.message}</span>
        )}
      </div>

      {/* Website */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="communityWebsite"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Website
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-300 inter">
            https://
          </span>
          <input
            id="communityWebsite"
            {...register("communityWebsite")}
            placeholder="example.com"
            className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent inter"
          />
        </div>
        {errors.communityWebsite && (
          <span className="text-xs text-red-500">{errors.communityWebsite.message}</span>
        )}
      </div>
    </div>
  );
}
