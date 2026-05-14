import { LenisProvider } from "@/components/providers/lenis-provider";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
