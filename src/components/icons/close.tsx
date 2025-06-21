import { CSSProperties } from "react";

export default function Close({
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
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L7 7" stroke="#888888" />
      <path d="M1 7L7 0.999999" stroke="#888888" />
    </svg>
  );
}
