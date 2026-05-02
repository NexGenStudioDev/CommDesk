export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "32px",
        paddingLeft: "40px",
        background: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "24px", fontWeight: 600 }}>Dashboard</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>{children}</div>
    </div>
  );
}
