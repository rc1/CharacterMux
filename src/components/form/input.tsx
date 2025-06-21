import { InputHTMLAttributes } from "react";

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
  return (
    <div className="input-container">
      <label className="secondary">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...inputProps}
      />
    </div>
  );
}
