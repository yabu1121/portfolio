import { Tech, TimelineItem, Project, Links } from "@/app/utils/type"

export const techs: Tech[] = [
  { id: 1, name: "C", level:  30, description: "基礎、ファイル操作、ポインタ、ソートのアルゴリズム、二分木の探索"},
  { id: 2, name: "C++", level: 30, description: "基礎部分、ソートのアルゴリズム、二分木の探索、DFS"},
  { id: 3, name: "Python", level: 20, description: "Pandas, Numpyに少し触れた程度"},
  { id: 4, name: "Go", level: 10, description: "基本構文を学習中"},
  { id: 5, name: "Java", level: 20, description: "基礎、ファイル操作"},
  { id: 6, name: "Next.js", level: 35, description: "Api操作、データベース接続学習中"},
]

export const timeline: TimelineItem[] = [
  { id: 1, year: "2024", month: 4, category: "learn", title: "芝浦工業大学情報通信工学課程情報工学コース", detail: "C言語を用いた基礎的なプログラミング、CS基礎、アルゴリズム学習を開始"},
  { id: 2, year: "2024", month: 6, category: "learn", title: "独学プログラミング学習開始", detail: "プログラミングサークルに入り、HTML, CSS, Javascriptを用いた ホームページなどを作成する。プログラミングで実際に物を作る経験をする"},
  { id: 3, year: "2024", month: 10, category: "learn", title: "初ハッカソン参加", detail: "プログラミングサークルの人と一緒に参加し、Aiに頼らないとしっかりしたアプリケーションを作れない実力を痛感"},
  { id: 4, year: "2025", month: 8, category: "learn", title: "db操作に触れる", detail: "以前から触っていたReactからNext.jsにかえ、それと同時にPrisma, TailwindCSS, Supabaseなどモダンな技術に触れる。"},
  { id: 5, year: "2025", month: 9, category: "learn", title: "バックエンド言語", detail: "大学の講義でJavaを学習開始, オブジェクト指向を学習した。"},
  { id: 6, year: "2025", month: 11, category: "intern", title: "合同会社ニフロ", detail: "Next.js, TS, Drizzle, Supabase, tRPC, zustand, zodなどを用いて受託アプリケーションの作成業務、DRY原則など、チーム開発に触れる"},
]

export const links: Links[] = [
    { id: 1, topic: "Top", link: "/" },
    { id: 2, topic: "About", link: "about" },
    { id: 3, topic: "Projects", link: "projects" },
    { id: 4, topic: "Contact", link: "contact" },
  ];
