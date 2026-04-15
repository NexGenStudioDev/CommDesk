import { useFormContext } from "react-hook-form";
import { SignupFormData } from "../../hooks/useSignupForm";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Australia", "Austria", "Bangladesh",
  "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "Ethiopia",
  "Finland", "France", "Germany", "Ghana", "Greece", "India", "Indonesia",
  "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Pakistan", "Philippines", "Portugal", "Romania", "Russia",
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain",
  "Sweden", "Switzerland", "Tanzania", "Thailand", "Turkey", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Vietnam", "Zimbabwe",
];

export default function ContactStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 inter">Contact Information</h2>
        <p className="text-gray-500 text-sm mt-1 inter">
          How can people reach your community?
        </p>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="country"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Country *
        </label>
        <select
          id="country"
          {...register("country")}
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all bg-white inter ${
            errors.country
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        >
          <option value="">Select a country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && (
          <span className="text-xs text-red-500">{errors.country.message}</span>
        )}
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="city"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          City *
        </label>
        <input
          id="city"
          {...register("city")}
          placeholder="e.g. Nairobi"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
            errors.city
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.city && (
          <span className="text-xs text-red-500">{errors.city.message}</span>
        )}
      </div>

      {/* Official Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="officialEmail"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Official Email *
        </label>
        <input
          id="officialEmail"
          {...register("officialEmail")}
          type="email"
          placeholder="community@example.com"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
            errors.officialEmail
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.officialEmail && (
          <span className="text-xs text-red-500">{errors.officialEmail.message}</span>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contactPhone"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter"
        >
          Contact Phone *
        </label>
        <input
          id="contactPhone"
          {...register("contactPhone")}
          type="tel"
          placeholder="+1 (555) 000-0000"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
            errors.contactPhone
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
        {errors.contactPhone && (
          <span className="text-xs text-red-500">{errors.contactPhone.message}</span>
        )}
      </div>
    </div>
  );
}
