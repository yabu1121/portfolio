import type { Metadata } from 'next'
import { GutterMascots } from '@/app/components/common/GutterMascots'

export const metadata: Metadata = {
  title: 'cookie とデータの扱い',
  description: 'このサイトが置く cookie と、数えているものの説明。',
}

/*
 * cookie の説明。blog のバナーから来る。
 *
 * **3 サイトぶんをここ 1 枚にまとめる。** ライセンスと同じで、同じ説明を
 * 3 つ置くと片方だけ古くなる。
 */
const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border-t border-line py-4 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6">
    <dt className="font-mono text-[11px] tracking-wider text-ink-3">{label}</dt>
    <dd className="mt-1.5 text-[13px] leading-relaxed text-ink-2 sm:mt-0">{children}</dd>
  </div>
)

const PrivacyPage = () => (
  <div className="paper min-h-screen">
    <section className="relative mx-auto w-full max-w-3xl px-5 pt-24 pb-28">
      <GutterMascots items={[{ pose: 'guide', side: 'left', top: 120, width: 120 }]} />

      <header>
        <p className="font-mono text-[11px] tracking-widest text-ink-3">PRIVACY</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">cookie とデータの扱い</h1>
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-2">
          個人のサイトです。広告は出していません。自分で数えているものと、
          配信元（Vercel）の計測だけが入っています。置いているもの、数えているものを
          そのまま書きます。
        </p>
      </header>

      <section className="mt-14">
        <h2 className="font-mono text-[10px] tracking-widest text-ink-3">COOKIE</h2>
        <dl className="mt-4">
          <Row label="y4bu_consent">
            同意するかどうかの返事を覚えておくもの。これ自体は同意が要りません
            （「使わない」を覚えるためのものなので）。半年で消えます。
          </Row>
          <Row label="y4bu_reactions">
            記事の「よかった」と閲覧を二重に数えないための乱数です。
            <strong className="font-normal text-ink">同意したときだけ</strong>置きます。
            名前もメールアドレスも入っておらず、ほかのサイトには出ていきません。半年で消えます。
          </Row>
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-[10px] tracking-widest text-ink-3">数えているもの</h2>
        <dl className="mt-4">
          <Row label="よかった">
            どの記事に何件ついたか。誰が押したかは残していません（上の乱数を、さらに
            鍵付きで変換した文字列で突き合わせています）。もう一度押すと取り消せます。
          </Row>
          <Row label="閲覧">
            どの記事が何日に何回開かれたか。同じ端末の同じ日は 1 回として数えます。
          </Row>
          <Row label="IP アドレス">
            そのまま保存はしていません。短い文字列に変換したものだけを持ち、
            <strong className="font-normal text-ink">1 つの回線から入れられる数の上限</strong>
            （水増しの歯止め）にだけ使います。元の IP には戻せません。
          </Row>
          <Row label="数の行き先">
            上の 3 つは管理画面で自分が見るだけです。公開ページには出していません。
            サイトを置いている Vercel には、下の 2 つだけが届きます。
          </Row>
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-[10px] tracking-widest text-ink-3">
          配信元（Vercel）に届くもの
        </h2>
        <dl className="mt-4">
          <Row label="表示の速さ">
            ページが出るまでの時間などの数値です。cookie は使わず、誰かを見分けるものも
            持ちません。自分のサイトが遅くなっていないかを見るためのもので、
            <strong className="font-normal text-ink">同意の有無にかかわらず</strong>送られます。
          </Row>
          <Row label="どのページが見られたか">
            Vercel の Web Analytics です。こちらも cookie は使いませんが、
            訪問者を数えるものなので
            <strong className="font-normal text-ink">同意したときだけ</strong>動かしています。
            「使わない」を選べば読み込まれません。
          </Row>
          <Row label="渡していないもの">
            名前・メールアドレス・お問い合わせの内容は、どこにも渡していません。
            広告にも使っていません。
          </Row>
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-[10px] tracking-widest text-ink-3">やめたいとき</h2>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-2">
          ブラウザの設定でこのサイトの cookie を消すと、置いたものは無くなり、バナーがもう一度出ます。
          そこで「使わない」を選べば、以降は何も置かず、何も数えません。
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-[10px] tracking-widest text-ink-3">サーバについて</h2>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-2">
          このサイトは Vercel で動かし、データは Supabase（PostgreSQL）に置いています。
          どちらも仕組み上アクセスログを持ちますが、こちらから解析のために取り出してはいません。
        </p>
      </section>
    </section>
  </div>
)

export default PrivacyPage
