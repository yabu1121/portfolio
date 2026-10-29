import { deckThumbUrl, deckUrl } from "@/lib/siteUrls";

/*
 * 経歴に紐付いたスライド。
 *
 * 登壇やインターンの成果発表は資料が残っていることが多いので、URL を文章に
 * 混ぜるのではなく、表紙つきのカードで見せる。
 *
 * **公開中のデッキだけ出す。** 非公開・予約待ち・ファイルが消えたものは
 * slides 側で配信されておらず、押しても 404 になる。
 *
 * **出していいかの判定はサーバでやる。** 以前は公開状態をここまで持ってきて
 * 画面で隠していたが、API は誰でも叩けるので、隠したはずの題名や公開予定
 * 時刻がそのまま読めていた。いまは結合の条件に入れてあり、出せないデッキは
 * すべて null で返る。ここでは中身があるかだけを見る。
 */

export type LinkedDeck = {
  deckSlug: string | null;
  deckTitle: string | null;
  deckDate: string | null;
  deckSlideCount: number | null;
};

export const isDeckVisible = (row: LinkedDeck) => Boolean(row.deckSlug && row.deckTitle);

export const DeckCard = ({ deck }: { deck: LinkedDeck }) => {
  if (!isDeckVisible(deck) || !deck.deckSlug) return null;

  return (
    <a
      href={deckUrl(deck.deckSlug)}
      target="_blank"
      rel="noreferrer"
      className="group mt-3 flex items-center gap-3 border border-line bg-white p-2.5 transition-[border-color,transform] duration-200 hover:-translate-y-[2px] hover:border-sky"
    >
      <span className="relative block aspect-video w-24 shrink-0 overflow-hidden border border-line bg-surface sm:w-32">
        {/* slides が配っている表紙。next/image は通さない */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deckThumbUrl(deck.deckSlug)}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-contain"
        />
      </span>

      <span className="min-w-0">
        <span className="block font-mono text-[10px] tracking-wider text-ink-3">SLIDE</span>
        <span className="mt-0.5 block truncate font-display text-[14px] font-black text-ink group-hover:text-sky-ink">
          {deck.deckTitle}
        </span>
        <span className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-ink-3">
          {deck.deckDate && <span className="tabular-nums">{deck.deckDate.replace(/-/g, ".")}</span>}
          {deck.deckSlideCount && <span>{deck.deckSlideCount} 枚</span>}
        </span>
      </span>
    </a>
  );
};
