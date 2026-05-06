import { useFormContext, Controller } from "react-hook-form";
import { SignupFormData } from "../../hooks/useSignupForm";
import { SearchableDropdown } from "@/Component/ui/SearchableDropdown";


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
    control,
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
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <SearchableDropdown
            label="Country *"
            options={COUNTRIES}
            value={field.value}
            onChange={field.onChange}
            placeholder="Select a country"
            error={errors.country?.message}
          />
        )}
      />

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
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide inter">
          Contact Phone *
        </label>
        <div className="flex gap-2">
          {/* Country Code Selector */}
          <div className="w-[110px] shrink-0">
            <select
              {...register("phoneCode")}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all bg-gray-50 inter cursor-pointer ${
                errors.phoneCode
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              }`}
            >
              <option value="+1">+1 (US)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (IN)</option>
              <option value="+254">+254 (KE)</option>
              <option value="+27">+27 (SA)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+81">+81 (JP)</option>
              <option value="+33">+33 (FR)</option>
              <option value="+49">+49 (DE)</option>
              <option value="+971">+971 (UAE)</option>
            </select>
          </div>

          {/* Phone Number Input */}
          <div className="flex-1">
            <input
              id="phoneNumber"
              {...register("phoneNumber")}
              type="text"
              inputMode="numeric"
              placeholder="000 000 000"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all inter ${
                errors.phoneNumber
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
        </div>
        {(errors.phoneCode || errors.phoneNumber) && (
          <span className="text-xs text-red-500">
            {errors.phoneCode?.message || errors.phoneNumber?.message}
          </span>
        )}
      </div>
    </div>
  );
}
