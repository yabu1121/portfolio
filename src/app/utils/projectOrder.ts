type ProjectWithTitle = {
  title: string;
};

// 採用担当者に見てほしい順番。
// 公開済みのプロダクト → 技術的な旗艦 → ローンチ予定 → 学習プロジェクトの順にする。
const PROJECT_PRIORITY: Record<string, number> = {
  "Hate AI": 0,
  "expense-api": 1,
  "questionapp": 2,
  "kakeibo（家計簿育成アプリ）": 3,
  "Kinga!!": 4,
  "Portfolio": 5,
  "mygit": 6,
};

export const sortProjectsForPortfolio = <T extends ProjectWithTitle>(
  projects: readonly T[]
): T[] =>
  [...projects].sort((a, b) => {
    const aPriority = PROJECT_PRIORITY[a.title] ?? Number.MAX_SAFE_INTEGER;
    const bPriority = PROJECT_PRIORITY[b.title] ?? Number.MAX_SAFE_INTEGER;

    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.title.localeCompare(b.title, "ja");
  });
