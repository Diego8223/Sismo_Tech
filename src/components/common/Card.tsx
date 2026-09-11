import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}