// 技術の種別。language だけが「理解度(level)」を持つ意味のある単位で、
// それ以外は「どのプロジェクトで何に使ったか」で語る。
export const TECH_KINDS = ['language', 'framework', 'library', 'database', 'infra'] as const;

export type TechKind = (typeof TECH_KINDS)[number];

export const TECH_KIND_LABEL: Record<TechKind, string> = {
  language: '言語',
  framework: 'フレームワーク',
  library: 'ライブラリ',
  database: 'データベース',
  infra: 'インフラ・ツール',
};

// 言語以外を表示するときの並び順
export const NON_LANGUAGE_KINDS: TechKind[] = ['framework', 'library', 'database', 'infra'];

export const isLanguage = (kind: string | null | undefined) => kind === 'language';
