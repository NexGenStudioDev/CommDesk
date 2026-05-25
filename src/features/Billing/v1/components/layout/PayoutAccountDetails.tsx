import { useState } from "react";
import { CheckCircle2, Landmark, Save } from "lucide-react";
import { useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import Input from "@/Component/ui/Input";

export default function PayoutAccountDetails() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: ""
  });

  const handleSave = () => {
    if (!form.accountHolder || !form.bankName || !form.accountNumber || !form.ifsc) {
      addToast("error", "Incomplete Form", "Please fill out all banking details.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      addToast("success", "Bank Details Saved", "Your payout account has been updated.");
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 14px 34px var(--cd-shadow)",
      }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black" style={{ color: "var(--cd-text)" }}>Payout Account Details</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--cd-text-muted)" }}>Receive funds and revenue securely to your bank account.</p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: "var(--cd-success-subtle)", color: "var(--cd-success)" }}>
          <Landmark size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-2">
        <Input
          label="Account Holder Name"
          name="accountHolder"
          type="text"
          value={form.accountHolder}
          onChange={(_, val) => setForm({ ...form, accountHolder: val })}
          placeholder="John Doe"
          className="w-full"
        />
        <Input
          label="Bank Name"
          name="bankName"
          type="text"
          value={form.bankName}
          onChange={(_, val) => setForm({ ...form, bankName: val })}
          placeholder="HDFC Bank"
          className="w-full"
        />
        <Input
          label="Account Number"
          name="accountNumber"
          type="password"
          value={form.accountNumber}
          onChange={(_, val) => setForm({ ...form, accountNumber: val })}
          placeholder="********4567"
          className="w-full"
        />
        <Input
          label="IFSC / Swift Code"
          name="ifsc"
          type="text"
          value={form.ifsc}
          onChange={(_, val) => setForm({ ...form, ifsc: val.toUpperCase() })}
          placeholder="HDFC0001234"
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading || saved}
          className="cd-btn cd-btn-secondary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          {loading ? <div className="animate-spin h-4 w-4 border-2 border-[var(--cd-text)] border-t-transparent rounded-full" /> :
           saved ? <CheckCircle2 size={16} className="text-green-500" /> : <Save size={16} />}
          {saved ? "Saved" : "Save Details"}
        </button>
      </div>
    </div>
  );
}
