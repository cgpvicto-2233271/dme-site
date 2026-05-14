import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonTone = "primary" | "secondary" | "ghost";

const toneClasses: Record<ButtonTone, string> = {
  primary:
    "border-[#e1192d] bg-[#e1192d] text-white hover:bg-[#f02a3d] hover:border-[#f02a3d]",
  secondary:
    "border-white/14 bg-white/[0.035] text-white/82 hover:border-white/24 hover:bg-white/[0.065] hover:text-white",
  ghost:
    "border-transparent bg-transparent text-white/48 hover:text-white hover:bg-white/[0.04]",
};

export function ButtonLink({
  href,
  children,
  tone = "primary",
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  tone?: ButtonTone;
  className?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
    </>
  );

  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 border px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/55",
    toneClasses[tone],
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
