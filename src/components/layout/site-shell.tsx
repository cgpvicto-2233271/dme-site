import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-dvh bg-[#050505] text-white", className)}>
      {children}
    </div>
  );
}
