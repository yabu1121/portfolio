import { TECH_KIND_LABEL, TECH_KINDS, type TechKind } from "@/app/utils/techKind"

/*
 * 作品に使った技術を、役割ごとにまとめて出す。
 *
 * **全部を同じ重さのタグで並べない。** 以前は言語もツールも大文字の
 * タグで横一列に並べていて、Git や GitHub が Go や Next.js と同じ顔で
 * 出ていた。何をどう組んだのかが読み取れず、機械が吐いた一覧に見える。
 *
 * techs.kind（言語 / フレームワーク / ライブラリ / データベース /
 * インフラ・ツール）は既に持っているので、それで束ねるだけで足りる。
 */

export type TechItem = { id: string; name: string; kind: string | null }

/** 役割ごとに束ねる。並びは TECH_KINDS の順（言語から） */
const groupByKind = (techs: TechItem[]) => {
  const byKind = new Map<TechKind, string[]>()

  for (const tech of techs) {
    // 知らない kind は「ライブラリ」に寄せる。既定値と同じ扱い
    const kind = (TECH_KINDS as readonly string[]).includes(tech.kind ?? "")
      ? (tech.kind as TechKind)
      : "library"
    if (!byKind.has(kind)) byKind.set(kind, [])
    byKind.get(kind)!.push(tech.name)
  }

  return TECH_KINDS.filter((kind) => byKind.has(kind)).map((kind) => ({
    kind,
    label: TECH_KIND_LABEL[kind],
    names: byKind.get(kind)!.toSorted((a, b) => a.localeCompare(b)),
  }))
}

export const TechByKind = ({ techs }: { techs: TechItem[] }) => {
  const groups = groupByKind(techs)
  if (!groups.length) return null

  return (
    <dl className="grid gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-[6.5rem_1fr]">
      {groups.map((group) => (
        <div key={group.kind} className="contents">
          <dt className="font-mono text-[10px] tracking-wider text-ink-3 sm:pt-[3px]">
            {group.label}
          </dt>
          <dd className="text-ink-2">{group.names.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  )
}
