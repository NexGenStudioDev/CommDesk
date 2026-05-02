import { Achievement } from "../mock/AchievementMock";
import { BadgeCheck, Award } from "lucide-react";

export default function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  if (!achievements || achievements.length === 0) {
    return <p>No achievements yet</p>;
  }

  // 🔹 Split data
  const badges = achievements.filter((a) => a.type === "badge");
  const certificates = achievements.filter((a) => a.type === "certificate");

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Achievements</h2>

      {/* 🔵 BADGES */}
      <h3 style={{ marginBottom: "10px" }}>Badges</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        {badges.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#eef4ff",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid #e0e7ff",
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                background: "#dbeafe",
                padding: "6px",
                borderRadius: "8px",
                width: "fit-content",
                color: "#2563eb",
              }}
            >
              <BadgeCheck size={18} />
            </div>

            <strong style={{ fontSize: "14px" }}>{item.title}</strong>

            <span style={{ fontSize: "12px", color: "#555" }}>{item.description}</span>
          </div>
        ))}
      </div>

      {/* 🟣 CERTIFICATES */}
      <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>Certificates Earned</h3>

      <div style={{ display: "grid", gap: "12px" }}>
        {certificates.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#f3e8ff",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid #e9d5ff",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                background: "#ede9fe",
                padding: "6px",
                borderRadius: "8px",
                width: "fit-content",
                color: "#7c3aed",
              }}
            >
              <Award size={18} />
            </div>

            <strong>{item.title}</strong>

            <span style={{ fontSize: "12px", color: "#555" }}>{item.description}</span>

            <span style={{ fontSize: "11px", color: "#666" }}>
              Issued by {item.issuedBy} • {item.date}
            </span>

            {/* Optional CTA */}
            <button
              style={{
                marginTop: "6px",
                fontSize: "12px",
                color: "#7c3aed",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
              }}
            >
              View Certificate →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
