import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  tone?: "green" | "blue" | "orange" | "purple";
}

export default function StatCard({ title, value, subtitle, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <div className={"stat-card " + tone}>
      <div className="stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
}