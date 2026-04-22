import { Tech, TimelineItem, Project, Links } from "@/app/utils/type"

export const techs: Tech[] = [
  { id: 1, name: "C", level:  30, description: "基礎、ファイル操作、ポインタ、ソートのアルゴリズム、二分木の探索"},
  { id: 2, name: "C++", level: 30, description: "基礎部分、ソートのアルゴリズム、二分木の探索、DFS"},
  { id: 3, name: "Python", level: 20, description: "Pandas, Numpyに少し触れた程度"},
  { id: 4, name: "Go", level: 10, description: "基本構文を学習中"},
  { id: 5, name: "Java", level: 20, description: "基礎、ファイル操作"},
  { id: 6, name: "Next.js", level: 35, description: "Api操作、データベース接続学習中"},
]

export const links: Links[] = [
    { id: 1, topic: "Top", link: "/" },
    { id: 2, topic: "About", link: "about" },
    { id: 3, topic: "Projects", link: "projects" },
    { id: 4, topic: "Contact", link: "contact" },
  ];
