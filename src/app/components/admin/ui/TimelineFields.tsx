'use client'

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FormRow } from "./FormPage";

/** textarea の内容を1行1URLとして配列にする。空行は捨て、全部空なら null。 */
export const toUrlList = (v: string) => {
  const list = v.split("\n").map((l) => l.trim()).filter(Boolean);
  return list.length ? list : null;
};

/** 空欄は「未指定」なので null にする */
export const toNullableNumber = (v: string) => {
  if (v.trim() === "") return null;
  return Number(v);
};

export type TimelineDefaults = {
  year: string;
  month: number;
  day?: number | null;
  endYear?: string | null;
  endMonth?: number | null;
  endDay?: number | null;
  category?: string;
  title?: string;
  detail?: string;
  urls?: string[] | null;
};

/**
 * フォームの入力値を name で取り出す。
 * 個々の ref を親から渡すと数が多く、レンダー中の ref 参照にもなるため
 * FormData から読む方式にしている。
 */
export const readTimelineForm = (form: HTMLFormElement) => {
  const fd = new FormData(form);
  const s = (k: string) => String(fd.get(k) ?? "");
  return {
    year: s("year"),
    month: Number(s("month")),
    day: toNullableNumber(s("day")),
    endYear: s("endYear").trim(),
    endMonth: toNullableNumber(s("endMonth")),
    endDay: toNullableNumber(s("endDay")),
    category: s("category"),
    title: s("title"),
    detail: s("detail"),
    urls: toUrlList(s("urls")),
  };
};

/**
 * 経歴の入力欄。作成と編集で同じ並び・同じ説明にするため共通化する。
 * 期間の3パターン（単発 / 期間 / 継続中）が入力から読み取れるように、
 * 開始と終了を分けて、継続中のときは終了欄を無効化する。
 */
export const TimelineFields = ({
  defaults,
  isOngoing,
  setIsOngoing,
  categories,
}: {
  defaults: TimelineDefaults;
  isOngoing: boolean;
  setIsOngoing: (v: boolean) => void;
  categories: string[];
}) => (
  <>
    <fieldset className="space-y-4 rounded-lg border p-3">
      <legend className="px-1.5 font-mono text-[10px] tracking-[0.14em] uppercase">
        開始
      </legend>
      <div className="grid grid-cols-3 gap-3 sm:max-w-sm">
        <FormRow id="year" label="年" required>
          <Input
            id="year"
            name="year"
            type="text"
            defaultValue={defaults.year}
            className="font-mono tabular-nums"
            required
          />
        </FormRow>
        <FormRow id="month" label="月" required>
          <Input
            id="month"
            name="month"
            type="number"
            min={1}
            max={12}
            defaultValue={defaults.month}
            className="font-mono tabular-nums"
            required
          />
        </FormRow>
        <FormRow id="day" label="日">
          <Input
            id="day"
            name="day"
            type="number"
            min={1}
            max={31}
            defaultValue={defaults.day ?? ""}
            className="font-mono tabular-nums"
          />
        </FormRow>
      </div>
      <p className="text-[11px] text-muted-foreground">
        日を空にすると「2024.10」のように月単位で表示されます。
      </p>
    </fieldset>

    <fieldset className="space-y-4 rounded-lg border p-3">
      <legend className="px-1.5 font-mono text-[10px] tracking-[0.14em] uppercase">
        終了
      </legend>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="isOngoing"
          checked={isOngoing}
          onCheckedChange={(v) => setIsOngoing(v === true)}
        />
        <Label htmlFor="isOngoing" className="cursor-pointer text-sm font-normal">
          現在も継続中（「2024.04 – 現在」と表示）
        </Label>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:max-w-sm">
        <FormRow id="endYear" label="終了年">
          <Input
            id="endYear"
            name="endYear"
            type="text"
            defaultValue={defaults.endYear ?? ""}
            disabled={isOngoing}
            className="font-mono tabular-nums"
          />
        </FormRow>
        <FormRow id="endMonth" label="終了月">
          <Input
            id="endMonth"
            name="endMonth"
            type="number"
            min={1}
            max={12}
            defaultValue={defaults.endMonth ?? ""}
            disabled={isOngoing}
            className="font-mono tabular-nums"
          />
        </FormRow>
        <FormRow id="endDay" label="終了日">
          <Input
            id="endDay"
            name="endDay"
            type="number"
            min={1}
            max={31}
            defaultValue={defaults.endDay ?? ""}
            disabled={isOngoing}
            className="font-mono tabular-nums"
          />
        </FormRow>
      </div>
      <p className="text-[11px] text-muted-foreground">
        終了月は終了年とセットで必須です。継続中でもなく終了年月も空なら、単発の予定として開始日だけを表示します。
      </p>
    </fieldset>

    <Separator />

    <FormRow id="category" label="分類" hint="既存の分類から選ぶか、新しく入力します" required>
      <Input
        id="category"
        name="category"
        type="text"
        defaultValue={defaults.category ?? ""}
        list="timeline-categories"
        className="sm:w-72"
        required
      />
      <datalist id="timeline-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </FormRow>

    <FormRow id="title" label="タイトル" required>
      <Input
        id="title"
        name="title"
        type="text"
        defaultValue={defaults.title ?? ""}
        required
      />
    </FormRow>

    <FormRow id="detail" label="詳細" required>
      <Textarea
        id="detail"
        name="detail"
        rows={6}
        defaultValue={defaults.detail ?? ""}
        required
      />
    </FormRow>

    <FormRow
      id="urls"
      label="関連リンク"
      hint="1行に1つ。登壇資料・記事・リポジトリなど。speakerdeck / zenn / qiita / github はラベルを自動判別します"
    >
      <Textarea
        id="urls"
        name="urls"
        rows={3}
        defaultValue={(defaults.urls ?? []).join("\n")}
        placeholder={"https://speakerdeck.com/...\nhttps://zenn.dev/..."}
        className="font-mono text-xs"
      />
    </FormRow>
  </>
);
