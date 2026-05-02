export default function SummaryCard({ title, value }: any) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "16px",
        border: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#666" }}>{title}</span>
      <strong style={{ fontSize: "22px" }}>{value}</strong>
    </div>
  );
}
