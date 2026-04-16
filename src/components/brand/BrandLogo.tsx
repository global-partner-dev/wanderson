import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const sizes = {
  sm: "h-7 w-auto",
  md: "h-8 w-auto",
  lg: "h-10 w-auto",
  xl: "h-11 w-auto",
  "2xl": "h-14 w-auto",
} as const;

type Props = {
  /** Use `null` for a non-clickable mark (e.g. footer). */
  href?: string | null;
  size?: keyof typeof sizes;
  className?: string;
  linkClassName?: string;
  priority?: boolean;
};

export function BrandLogo({ href = "/", size = "md", className, linkClassName, priority }: Props) {
  const img = (
    <Image
      src={logo}
      alt="Polonia4u"
      width={220}
      height={64}
      sizes="(max-width: 768px) 140px, 180px"
      className={cn(sizes[size], className)}
      priority={priority}
    />
  );

  if (href === null) {
    return <span className={cn("inline-flex shrink-0 items-center", linkClassName)}>{img}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", linkClassName)}>
      {img}
    </Link>
  );
}
