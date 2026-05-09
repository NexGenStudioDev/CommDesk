import React from "react";

interface UrlProps {
  protocol?: string;
  domain: string;
  themeMode?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
  setDomain?: (domain: string) => void;
  ariaLabel?: string;
}

const isValidDomain = (domain: string) => {
  return /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(domain);
};

// Remove themeMode from props too since it's unused now
const Url: React.FC<UrlProps> = ({
  protocol = "https://",
  domain,
  className = "url flex",
  style,
  ariaLabel = "URL display",
}) => {
  const valid = isValidDomain(domain);
  const [Domain, setDomain] = React.useState(domain);

  return (
    <div className={className} style={style} aria-label={ariaLabel} role="presentation">
      <div
        className="Protocol p-2 rounded-l-lg border-2 w-[25%]"
        style={{
          backgroundColor: "var(--cd-surface-2)",
          borderColor: "var(--cd-border)",
          color: "var(--cd-text)",
        }}
      >
        {protocol}
      </div>
      <input
        type="text"
        value={Domain}
        onChange={(e) => setDomain(e.target.value)}
        className="Domain p-2 rounded-r-lg border w-[80%]"
        style={{
          color: "var(--cd-text)",
          backgroundColor: "var(--cd-surface)",
          borderColor: valid ? "var(--cd-border)" : "var(--cd-danger)",
        }}
      />
      {!valid && (
        <span style={{ color: "var(--cd-danger)", marginLeft: 8 }} role="alert">
          Invalid domain
        </span>
      )}
    </div>
  );
};

export default Url;
