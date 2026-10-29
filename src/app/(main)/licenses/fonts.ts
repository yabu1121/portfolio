/*
 * 自前配布している書体。サイトごとに違うので、どこで配っているかまで持つ。
 *
 * **出すのは義理ではなく条件。** woff2 を public/fonts に置いて配って
 * いる＝再配布なので、SIL OFL 2 項により著作権表示とライセンス本文を
 * 添えないといけない。本文は各サイトの public/fonts/OFL-*.txt に置いて
 * あり、ここからはそれへのリンクを出す。
 */

export type FontEntry = {
  name: string;
  /** OFL 本文のファイル名（public/fonts に置いてある） */
  file: string;
  /** 配っているサイト */
  sites: ('portfolio' | 'blog' | 'slides')[];
  project: string;
};

export const FONTS: FontEntry[] = [
  {
    name: 'Murecho',
    file: 'OFL-Murecho.txt',
    sites: ['portfolio', 'blog', 'slides'],
    project: 'https://github.com/positype/Murecho-Project',
  },
  {
    name: 'Space Grotesk',
    file: 'OFL-Space-Grotesk.txt',
    sites: ['portfolio', 'blog', 'slides'],
    project: 'https://github.com/floriankarsten/space-grotesk',
  },
  {
    name: 'Geist',
    file: 'OFL-Geist.txt',
    sites: ['portfolio', 'blog'],
    project: 'https://github.com/vercel/geist-font',
  },
  {
    name: 'Geist Mono',
    file: 'OFL-Geist-Mono.txt',
    sites: ['portfolio', 'blog', 'slides'],
    project: 'https://github.com/vercel/geist-font',
  },
  {
    name: 'Fraunces',
    file: 'OFL-Fraunces.txt',
    sites: ['portfolio'],
    project: 'https://github.com/undercasetype/Fraunces',
  },
  {
    name: 'M PLUS 2',
    file: 'OFL-M-PLUS-2.txt',
    sites: ['slides'],
    project: 'https://github.com/coz-m/MPLUS_FONTS',
  },
  {
    name: 'JetBrains Mono',
    file: 'OFL-JetBrains-Mono.txt',
    sites: ['slides'],
    project: 'https://github.com/JetBrains/JetBrainsMono',
  },
];

/*
 * 本文の置き場。**このページを持つ portfolio から出す。**
 * 本文は配っている各サイトの public/fonts にも同じものを置いてあるが
 * （OFL 2 項はフォントに添えることを求めるため）、ここから案内するのは
 * 1 箇所に揃えた方が読む側が迷わない。
 */
export const oflHref = (font: FontEntry) => `/fonts/${font.file}`;

export const OFL_URL = 'https://openfontlicense.org/open-font-license-official-text/';
