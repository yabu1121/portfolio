import type { NextConfig } from "next";

/*
 * 共通のセキュリティヘッダー。**4 サイトで同じものを付ける。**
 *
 *   X-Content-Type-Options ... 型を推測して別物として実行されるのを止める
 *   Referrer-Policy        ... 外のサイトへ行くとき、どのページから来たかを渡さない
 *   X-Frame-Options        ... 他所の枠に嵌め込まれて、押し間違いを誘われるのを止める
 *   Permissions-Policy     ... カメラ・マイク・位置情報は使わないので塞いでおく
 *
 * HSTS は Vercel が付けている（max-age=63072000）ので、ここでは足さない。
 * CSP は next/script や画像の最適化と当たりやすいので、まずはこの 4 つから。
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  /*
   * CSP。**Report-Only で違反ゼロを確かめてから強制にした。**
   *
   * いきなり強制すると、見落としが 1 つあるだけで画面が白くなる。
   * 実際、最初の指定では経歴ページの外部サムネと blog の帯のアイコンが
   * 弾かれていた（admin では Cloudflare が差し込むビーコンも）。
   * 読み込み先を足すときは、必ず Report-Only に戻して確かめ直す。
   *
   * script-src に 'unsafe-inline' が要るのは、Next が組み立てのための
   * インラインスクリプトを埋めるため。nonce を配る形にすれば外せるが、
   * 作り置きしたページを配っている以上、ページごとに nonce を変えられない。
   */
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co https://cdn.jsdelivr.net https://cdn.simpleicons.org https://raw.githubusercontent.com https://res.cloudinary.com https://files.speakerdeck.com; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  // 何で動いているかを自分から言わない
  poweredByHeader: false,
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
  images: {
    remotePatterns: [
      {
        /*
         * Supabase の画像置き場。**ホスト名は環境変数から組む。**
         * 以前はプロジェクトの参照 ID を直接書いていたので、DB を
         * 別プロジェクトに移したときにここだけ古いままになり、
         * 画像が 400（INVALID_IMAGE_OPTIMIZE_REQUEST）で出なくなった。
         */
        protocol: "https",
        hostname: new URL(
          process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pxirfvsmjlwtgzofqdjj.supabase.co",
        ).hostname,
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        port: '',
        pathname: '/**',
      },
      // works の "Hate AI" がリポジトリ上の画像を直接参照しているため許可。
      // 恒久的には /api/upload で Supabase に移すのが望ましい。
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: '',
        pathname: '/**',
      },
    ]
  },
  allowedDevOrigins: [
    'http://192.168.40.55:3000',
  ]
};

export default nextConfig;
