import { ReactNode } from "react";
import "./header-bar.css";

export interface HeaderProps {
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
}

export default function Header({ start, center, end }: HeaderProps) {
  return (
    <div className="header-bar">
      {start && <div>{start}</div>}
      <div className="divider" />
      {center && (
        <>
          <div>{center}</div>
          <div className="divider" />
        </>
      )}
      {end && <div>{end}</div>}
    </div>
  );
}
