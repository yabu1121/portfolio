// タイムラインの日付表示を1箇所に集約する。
// 表示側（AboutTimeline / AdminTimeline）はここだけを見ればよい。

export type TimelinePeriodInput = {
  year: string;
  month: number;
  day?: number | null;
  endYear?: string | null;
  endMonth?: number | null;
  endDay?: number | null;
  isOngoing?: boolean | null;
};

export type TimelinePeriodKind = 'single' | 'range' | 'ongoing';

const pad = (n: number) => String(n).padStart(2, '0');

/** 年月日を 2024.10 / 2024.10.15 の形にする。day が null なら月まで。 */
const formatPoint = (year: string, month: number, day?: number | null) =>
  day == null ? `${year}.${pad(month)}` : `${year}.${pad(month)}.${pad(day)}`;

/**
 * 3パターンのどれに当たるかを判定する。
 * is_ongoing を最優先し、次に終了年月の有無で期間か単発かを決める。
 */
export const getTimelinePeriodKind = (item: TimelinePeriodInput): TimelinePeriodKind => {
  if (item.isOngoing) return 'ongoing';
  if (item.endYear && item.endMonth != null) return 'range';
  return 'single';
};

/**
 * 表示用の文字列を作る。
 *   single  : 2024.10        / 2024.10.15
 *   range   : 2024.04 – 2025.03 / 2024.04.01 – 2025.03.31
 *   ongoing : 2024.04 – 現在
 * 区切りは en dash（–）。ハイフンより長く、日付の区切りとして読みやすい。
 */
export const formatTimelinePeriod = (item: TimelinePeriodInput): string => {
  const start = formatPoint(item.year, item.month, item.day);

  switch (getTimelinePeriodKind(item)) {
    case 'ongoing':
      return `${start} – 現在`;
    case 'range':
      return `${start} – ${formatPoint(item.endYear!, item.endMonth!, item.endDay)}`;
    default:
      return start;
  }
};
