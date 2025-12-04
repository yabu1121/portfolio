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
  { id: 5, year: "2025", month: 11, category: "learn", title: "Go", detail: "独学で簡単にGoを学習開始"},
  { id: 6, year: "2025", month: 11, category: "intern", title: "Next.js TS", detail: "合同会社ニフロでNext.js, TSを用いてアプリの作成業務"},
]

export const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio",
    description: "Next.js と Tailwind CSS で作成した個人ポートフォリオサイト。",
    techs: ["Next.js", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/yabu1121/portfilio",
    url: "/",
    image: "/images/portfolioProject.png",
    category: "self",
  },
  {
    id: 2,
    title: "Todo App",
    description: "シンプルなタスク管理。状態管理とアクセシビリティを意識したUI。",
    techs: ["React", "TypeScript"],
    github: "#",
    url: "#",
    image: "/images/todoProject.png",
    category: "udemy",
  },
  {
    id: 3,
    title: "Order System",
    description: "カフェのオーダーシステムを簡易的に作成、レシートを印刷できる。",
    techs: ["Next.js"],
    github: "https://github.com/yabu1121/order-system.git",
    url: "https://order-system-pink.vercel.app/",
    image: "/images/orderSystemProject.png",
    category: "self",
  },
  {
    id: 4,
    title: "old portfolio",
    description: "昔のポートフォリオサイト、",
    techs: ["React.js"],
    github: "https://github.com/yabu1121/PortfolioSite.git",
    url: "https://portfolio-site-delta-two.vercel.app/",
    image: "/images/noImage.jpg",
    category: "self",
  },
  {
    id: 5,
    title: "blog",
    description: "database連携をしたblogアプリ",
    techs: ["Next.js", "Tailwind CSS", "Supabase"],
    github: "https://github.com/yabu1121/blog-app.git",
    url: "https://blog-app-pu5r.vercel.app/",
    image: "/images/blog.png",
    category: "udemy",
  },
  {
    id: 6,
    title: "calculator",
    description: "簡単な計算機",
    techs: ["Next.js"],
    github: "https://github.com/yabu1121/calculator.git",
    url: "https://calculator-smoky-phi-btvo8k36hd.vercel.app/",
    image: "/images/calculator.png",
    category: "self",
  },
  {
    id: 7,
    title: "ecサイト風アプリ",
    description: "今後は実際に機能を増やしていきます。",
    techs: ["Next.js","Tailwind css", "supabase"],
    github: "https://github.com/yabu1121/market",
    url: "https://market-pied-seven.vercel.app/",
    image: "/images/market.png",
    category: "self",
  },
  {
    id: 8,
    title: "ニュースアプリ",
    description: "news apiを使って取得した内容を表示し、記事に遷移する簡単なアプリです",
    techs: ["Next.js","Tailwind css", "news api"],
    github: "https://github.com/yabu1121/news-app",
    url: "https://news-app-alpha-murex.vercel.app/",
    image: "/images/news.png",
    category: "self",
  }
]

export const links: Links[] = [
    { id: 1, topic: "Top", link: "/" },
    { id: 2, topic: "About", link: "about" },
    { id: 3, topic: "Projects", link: "projects" },
    { id: 4, topic: "Contact", link: "contact" },
  ];
