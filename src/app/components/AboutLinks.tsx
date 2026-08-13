// SNSリンク一覧（/about）。データは src/app/utils/snsLinks.ts で一元管理。
// アイコンは next/image ではなく素の <img>（simpleicons / 自前SVG を確実に表示）。
import { snsLinks, iconFor } from "@/app/utils/snsLinks";
import Section from "./common/Section";

const AboutLinks = () => {
  return (
    <Section className="bg-white rounded">
      <h2 className="text-center text-2xl font-medium mb-6">Links</h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {snsLinks.map((l) => (
          <li key={l.href} className="list-none">
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-sky-50 hover:border-sky-200 transition-colors"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconFor(l, "light")}
                  alt={l.label}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-800">{l.label}</span>
                <span className="block truncate text-xs text-slate-500">{l.user}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default AboutLinks;
