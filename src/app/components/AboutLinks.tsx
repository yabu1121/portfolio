// SNSリンク一覧。増やすときは links 配列に { label, href, slug } を足すだけ。
// slug は simpleicons のスラッグ（https://simpleicons.org で検索）。
// アイコンは next/image ではなく素の <img>（外部SVGを確実に表示するため）。

type LinkItem = { label: string; href: string; slug: string };

const links: LinkItem[] = [
  { label: "X (Twitter)", href: "https://x.com/papox_57", slug: "x" },
  { label: "GitHub", href: "https://github.com/yabu1121", slug: "github" },
  { label: "Zenn", href: "https://zenn.dev/yabu_p", slug: "zenn" },
];

const AboutLinks = () => {
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 max-w-2xl mx-auto bg-white my-4 rounded">
      <h2 className="text-center text-2xl font-medium mb-6">Links</h2>

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {links.map((l) => (
          <li key={l.href} className="list-none">
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-slate-200 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${l.slug}`}
                alt={l.label}
                width={28}
                height={28}
                className="w-7 h-7 shrink-0"
              />
              <span className="text-sm sm:text-base font-medium text-slate-800 truncate">
                {l.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AboutLinks;
