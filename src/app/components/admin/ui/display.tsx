'use client'

import Image from "next/image";

/** アイコン未登録でも列が崩れないように、頭文字のプレースホルダを出す */
export const IconCell = ({
  src,
  name,
}: {
  src: string | null;
  name: string;
}) =>
  src ? (
    <Image
      src={src}
      alt=""
      width={28}
      height={28}
      className="size-7 shrink-0 object-contain"
    />
  ) : (
    <span
      aria-hidden
      className="flex size-7 shrink-0 items-center justify-center rounded bg-muted font-mono text-[11px] text-muted-foreground"
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );

/** 理解度（0-100）。数字だけより、並べたときの差が一目で分かる。 */
export const LevelBar = ({ level }: { level: number }) => (
  <span className="flex items-center gap-2">
    <span
      className="h-1 w-16 overflow-hidden rounded-full bg-muted"
      role="img"
      aria-label={`理解度 ${level}%`}
    >
      <span
        className="block h-full rounded-full bg-primary"
        style={{ width: `${Math.min(Math.max(level, 0), 100)}%` }}
      />
    </span>
    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
      {level}
    </span>
  </span>
);

export const Mono = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-xs whitespace-nowrap tabular-nums">
    {children}
  </span>
);

export const Dash = () => (
  <span className="font-mono text-xs text-muted-foreground/40">—</span>
);

/**
 * 説明・詳細は長文なので3行で頭出しする。
 * min-h で3行分の高さを常に確保し、短い説明でも行の高さが揃うようにする。
 */
/* block を併記すると display が -webkit-box を上書きしてクランプが効かないので付けない */
export const Clamp3 = ({ children }: { children: React.ReactNode }) => (
  <span className="line-clamp-3 min-h-[3.66rem] text-xs leading-relaxed text-muted-foreground">
    {children}
  </span>
);
