/**
 * 管理画面 / 管理用 API の Basic 認証。
 * middleware (Edge runtime) からも呼ぶため node:crypto には依存しない。
 */

/** 文字列長に依存しない比較。タイミング差で資格情報を推測されないようにする。 */
const safeEqual = (a: string, b: string) => {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);

  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
};

export const verifyBasicAuth = (header: string | null) => {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  // 環境変数が未設定なら誰も通さない（設定漏れで素通りする状態を作らない）
  if (!expectedUser || !expectedPassword) return false;
  if (!header) return false;

  const [scheme, encoded] = header.split(" ");
  if (scheme?.toLowerCase() !== "basic" || !encoded) return false;

  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return false; // Base64 として壊れたヘッダ
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) return false;

  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1); // ":" を含むパスワードも扱える

  return safeEqual(user, expectedUser) && safeEqual(password, expectedPassword);
};
