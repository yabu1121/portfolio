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
  { id: 1, year: "2024", month: 4, category: "learn", title: "C", detail: "大学での情報工学コースの講義でc言語を学習開始、基本構文からソートなどのアルゴリズムを学習しています"},
  { id: 2, year: "2024", month: 6, category: "learn", title: "HTML, CSS, JavaScript", detail: "独学でフロントエンド技術を学習開始"},
  { id: 3, year: "2025", month: 8, category: "learn", title: "Next.js TS Tailwind css", detail: "Udemyを用いて学習開始"},
  { id: 4, year: "2025", month: 9, category: "learn", title: "Java", detail: "大学の講義でJavaを学習開始"},
  { id: 5, year: "2025", month: 11, category: "learn", title: "Go", detail: "独学でGoを学習開始"},
  { id: 6, year: "2025", month: 11, category: "intern", title: "Next.js TS", detail: "合同会社ニフロでNext.js, TSを用いてアプリの作成業務"},
]

export const links: Links[] = [
    { id: 1, topic: "Top", link: "/" },
    { id: 2, topic: "About", link: "about" },
    { id: 3, topic: "Projects", link: "projects" },
    { id: 4, topic: "Contact", link: "contact" },
  ];
