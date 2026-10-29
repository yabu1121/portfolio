import Link from 'next/link';
import { Mascot } from '@/app/components/common/Mascot';

const SendPage = () => {
  return (
    <div className="paper min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-5 py-28">
        {/* 送信できたときだけ出る。祝うポーズ */}
        <Mascot pose="celebrate" width={200} className="mb-6 h-auto w-36" />

        <p className="font-mono text-[11px] tracking-widest text-sky-ink">SENT</p>

        <h1 className="mt-3 font-display text-3xl leading-snug font-black tracking-tight text-ink">
          送信が完了しました
        </h1>

        <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
          お問い合わせいただきありがとうございます。
          <br />
          いただいたメールアドレスに返信します。
        </p>

        {/* 空色の芯。slides のカードと同じ手 */}
        <div className="mt-10 h-[3px] w-16 bg-sky" />

        <Link
          href="/"
          className="mt-10 inline-block font-mono text-[11px] tracking-wider text-ink-3 transition-colors hover:text-sky-ink"
        >
          ← ホームへ戻る
        </Link>
      </main>
    </div>
  );
};

export default SendPage;
