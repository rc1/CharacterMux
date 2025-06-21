import { CSSProperties } from "react";

export default function Spin({
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
      <path
        d="M7 4C7 3.40666 6.82405 2.82664 6.49441 2.33329C6.16476 1.83994 5.69623 1.45542 5.14805 1.22836C4.59987 1.0013 3.99667 0.941889 3.41473 1.05764C2.83279 1.1734 2.29824 1.45912 1.87868 1.87868C1.45912 2.29824 1.1734 2.83279 1.05764 3.41473C0.941889 3.99667 1.0013 4.59987 1.22836 5.14805C1.45542 5.69623 1.83994 6.16476 2.33329 6.49441C2.82664 6.82405 3.40666 7 4 7"
        stroke="#888888"
      />
    </svg>
  );
}
