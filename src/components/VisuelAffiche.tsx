import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  sizes: string;
  className?: string;
};

/* Une affiche (souvent en portrait) dans un cadre paysage : on la montre en
   entier plutot que de la rogner, posee sur un fond flou tire de la meme
   image. Le cadre parent doit etre `relative` et avoir sa taille. */
export function VisuelAffiche({ src, alt = "", sizes, className = "" }: Props) {
  const webp = src.endsWith(".webp");
  return (
    <span className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        unoptimized={webp}
        sizes={sizes}
        className="scale-110 object-cover opacity-45 blur-2xl"
      />
      <Image src={src} alt={alt} fill unoptimized={webp} sizes={sizes} className="object-contain" />
    </span>
  );
}
