import Link from "next/link"

/*
 * 共通ボタン。slides / blog と同じ言語に合わせてある。
 *   角は丸めない／色は空色 1 色／文字は Geist Mono の大文字
 *
 * variant は 2 つだけ。
 *   solid   ... 主な行き先（面を空色で塗る）
 *   outline ... 補助（罫だけ）
 * link が無いときは押せない見た目にする（以前は空文字の Link になっていた）。
 */

interface CommonButtonProps {
  text: string;
  link?: string | null;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  variant?: "solid" | "outline";
}

const base =
  "inline-block px-4 py-2 font-mono text-[11px] tracking-wider transition-[opacity,border-color,color] md:text-[12px]";

const styles = {
  solid: "bg-sky-ink text-white hover:opacity-85",
  outline: "border border-line bg-white text-ink-2 hover:border-sky hover:text-sky-ink",
};

const CommonButton = ({ text, link, type, className = "", variant = "solid" }: CommonButtonProps) => {
  const label = text.toUpperCase();

  // 行き先が無いボタンは押させない。見た目も落とす
  if (!link) {
    return (
      <span
        aria-disabled
        className={`${base} ${styles[variant]} cursor-not-allowed opacity-40 ${className}`}
      >
        {label}
      </span>
    );
  }

  const external = link.startsWith("http");

  if (external) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${styles[variant]} ${className}`}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={link} className={`${base} ${styles[variant]} ${className}`} type={type}>
      {label}
    </Link>
  );
};

export default CommonButton
