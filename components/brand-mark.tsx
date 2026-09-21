import Image from "next/image";

export function BrandMark({ priority = false }: { priority?: boolean }) {
  return (
    <span className="brand-mark" aria-label="Genesis 360 Empresarial">
      <Image
        className="brand-logo"
        src="/brand/genesis-360-empresarial.png"
        alt=""
        width={2167}
        height={726}
        sizes="(max-width: 640px) 168px, 204px"
        priority={priority}
      />
    </span>
  );
}
