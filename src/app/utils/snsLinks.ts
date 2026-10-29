// SNS/外部リンクの一元管理。Home(ヒーロー)と /about の Links で共有。
// 追加はこの配列に1行足すだけ。ロゴが simpleicons にあれば slug、無ければ icon(自前パス)を指定。

export type SnsLink = {
  label: string;      // サービス名
  href: string;       // リンク先
  user: string;       // 表示するユーザー名/ハンドル
  slug?: string;      // simpleicons のスラッグ（あれば）
  hidden?: boolean;   // 画面に出さない。URL は残しておきたいので消さずに伏せる
  icon?: string;      // 自前アイコン（明るい背景用・ブランド色）
  iconWhite?: string; // 自前アイコン（暗い背景/Home用・白）
};

export const snsLinks: SnsLink[] = [
  { label: "X (Twitter)", href: "https://x.com/papox_57", user: "@papox_57", slug: "x" },
  { label: "GitHub", href: "https://github.com/yabu1121", user: "yabu1121", slug: "github" },
  { label: "Zenn", href: "https://zenn.dev/yabu_p", user: "yabu_p", slug: "zenn" },
  { label: "Speaker Deck", href: "https://speakerdeck.com/hayato_1121", user: "hayato_1121", slug: "speakerdeck", hidden: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hayato-nasu-4aa1ba411", user: "hayato-nasu", icon: "/logos/linkedin.svg", iconWhite: "/logos/linkedin-white.svg", hidden: true },
  { label: "Instagram", href: "https://www.instagram.com/squ1_nh", user: "squ1_nh", slug: "instagram" },
  { label: "Wantedly", href: "https://www.wantedly.com/id/hayato_nasu_c", user: "hayato_nasu_c", slug: "wantedly", hidden: true },
];

/*
 * 実際に画面に出すもの。トップのリンク一覧もフッターもこちらを使う。
 * 伏せたいものは snsLinks 側に hidden を付ける（配列から消すと URL ごと
 * 失うので、戻せるように残しておく）。
 */
export const visibleSnsLinks = snsLinks.filter((l) => !l.hidden);

// アイコンURLを解決。variant: "dark"=暗い背景(白ロゴ) / "light"=明るい背景(ブランド色)
export const iconFor = (l: SnsLink, variant: "light" | "dark"): string => {
  if (l.slug) return `https://cdn.simpleicons.org/${l.slug}${variant === "dark" ? "/ffffff" : ""}`;
  return variant === "dark" ? (l.iconWhite ?? l.icon ?? "") : (l.icon ?? "");
};
