import { LoadingMascot } from './LoadingMascot'

/*
 * 読み込み中。方眼紙の上にハヤブサと芯だけ置く。
 * 回るスピナーはこの資料の語彙に無いので、空色の芯が伸びる形にしている。
 *
 * **ここは「歩いている」。** ページの移動を待たせているので、
 * 行き先へ向かっている絵にする（保存を待たせるときは打っている絵）。
 */
const Loading = () => (
  <div className="paper flex min-h-dvh flex-col items-center justify-center">
    <LoadingMascot pose="walk" width={120} label="LOADING" />

    <div className="mt-4 h-[3px] w-40 overflow-hidden bg-surface">
      <div className="h-full w-full origin-left bg-sky animate-[loading_1.4s_infinite_ease-in-out]" />
    </div>
  </div>
)

export default Loading
