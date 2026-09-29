import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  sizes: string;
  /** Point de l'image garde au centre du cadre (object-position). */
  position?: string;
  className?: string;
};

/* Une affiche de roster qui remplit son cadre. Le recadrage est choisi par
   affiche (`position`) pour garder l'essentiel visible. Le cadre parent doit
   etre `relative` et avoir sa taille. */
export function VisuelAffiche({ src, alt = "", sizes, position = "50% 50%", className = "" }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={src.endsWith(".webp")}
      sizes={sizes}
      className={`object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
