import { CSSProperties } from "react";

export default function More({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      style={style}
      className={className}
      width="9"
      height="7"
      viewBox="0 0 9 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.5 6.5L8.5 6.5" stroke="#888888" />
      <path d="M0.5 3.5L8.5 3.5" stroke="#888888" />
      <path d="M0.5 0.5L8.5 0.499999" stroke="#888888" />
    </svg>
  );
}
