import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5",
        hover && "cursor-pointer hover:border-brand-400/50 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}
