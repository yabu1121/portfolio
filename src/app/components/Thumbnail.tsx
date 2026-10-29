import Image from 'next/image';
import React from 'react';

/*
 * 作品の表紙。
 *
 * **幅を固定しない。** 以前は w-100 h-80（400x320px）で、390px の画面から
 * 50px はみ出して横スクロールが出ていた。比（5:4）だけ保って幅は器に合わせ、
 * 大きくなりすぎないよう max-w-100 で止める。
 *
 * icon はファビコン用の小さい絵。**表紙の右上に重ねる。**
 * 以前は表紙の下に別の枠で並べていたが、同じ作品の絵が 2 つ縦に並ぶので
 * どちらが表紙か分からず、カードも間延びしていた。
 */

interface ThumbnailProps {
  url: string | null;
  altText: string;
  /** ファビコン用の小さい絵。右上に重ねる */
  icon?: string | null;
}

const Thumbnail = ({ url, altText, icon }: ThumbnailProps) => (
  <div className="relative aspect-5/4 w-full max-w-100">
    {url ? (
      <div className="size-full overflow-hidden border border-line">
        <Image
          src={url}
          alt={altText}
          width={500}
          height={500}
          className="size-full object-cover"
        />
      </div>
    ) : (
      <div className="flex size-full items-center justify-center border border-dashed border-line bg-surface">
        <p className="font-mono text-[11px] tracking-wider text-ink-3">NO IMAGE</p>
      </div>
    )}

    {icon && (
      /*
       * 表紙の上に乗るので、白地と罫で一段持ち上げる。
       * 表紙が暗い絵でも沈まないようにするため。
       *
       * **ここだけ角を丸める。** サイトの約束は「角は丸めない」だが、
       * これはアプリのアイコンなので、四角のままだと画像の切れ端に見える。
       * 丸みは iOS のアイコンに寄せて辺の 22%（中の絵は枠の内側なので 18%）。
       */
      <span className="absolute -top-2 -right-2 block size-12 overflow-hidden rounded-[22%] border border-line bg-white p-1 shadow-[0_6px_16px_-10px_var(--c-sky-deep)] sm:size-14">
        <Image
          src={icon}
          alt=""
          width={120}
          height={120}
          className="size-full rounded-[18%] object-contain"
        />
      </span>
    )}
  </div>
);

export default Thumbnail;
