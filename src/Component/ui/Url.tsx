import React from "react";
import { getTheme } from "../../config/them.config";

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

const Url: React.FC<UrlProps> = ({
  protocol = "https://",
  domain,
  themeMode = "light",
  className = "url flex",

  style,
  ariaLabel = "URL display",
}) => {
  const theme = getTheme(themeMode);
  const valid = isValidDomain(domain);

  let [Domain, setDomain] = React.useState(domain);

  return (
    <div className={className} style={style} aria-label={ariaLabel} role="presentation">
      <div
        className="Protocol p-2 rounded-l-lg border-2 w-[25%]"
        style={{
          backgroundColor: theme.background.secondary,
          borderColor: theme.borderColor.primary,
          color: theme.textColor.primary,
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
          color: theme.textColor.primary,
          backgroundColor: theme.background.primary,
          borderColor: valid ? theme.borderColor.primary : theme.textColor.error,
        }}
      />

      {!valid && (
        <span style={{ color: theme.textColor.error || "red", marginLeft: 8 }} role="alert">
          Invalid domain
        </span>
      )}
    </div>
  );
};

export default Url;
