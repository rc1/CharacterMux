import { InputHTMLAttributes, useState } from "react";

import "./input.css";

export default function Input({
  value,
  onChange,
  inputProps,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  label: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`input-container ${isFocused ? "focused" : ""}`}>
      <label className="secondary">{label}</label>
      <input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...inputProps}
      />
    </div>
  );
}
