import { LoadingMascot } from './LoadingMascot'

/*
 * 管理画面の読み込み中。
 *
 * **ここは「打っている」。** 中身を書き換えに来ている場所なので、
 * 公開ページ（歩いている）と描き分ける。
 */
const AdminLoading = () => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center">
    <LoadingMascot pose="typing" width={110} label="LOADING" />
  </div>
)

export default AdminLoading
