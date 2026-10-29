/*
 * 反応の窓口。**3 サイトで 1 本（ここ、www）に集めている。**
 *
 * slides は静的な HTML でサーバを持たないし、同じ処理を 3 つに写すと
 * 直すたびに 3 回直すことになる。cookie は親ドメイン（.y4bu.net）に
 * 置いてあるので、どのサイトから叩いても同じ端末として届く。
 *
 * 自分のサイトからは同じオリジンなので credentials は要らないが、
 * blog / slides と同じ書き方に揃えておく（写すときに落とさないため）。
 */

export type Kind = 'post' | 'work' | 'deck' | 'page'

const urlOf = (kind: Kind, target: string) =>
  `/api/reactions?kind=${kind}&target=${encodeURIComponent(target)}`

export const sendReaction = (kind: Kind, target: string, action: 'like' | 'unlike' | 'view') =>
  fetch(urlOf(kind, target), {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action }),
  })

export const askLiked = (kind: Kind, target: string) =>
  fetch(urlOf(kind, target), { credentials: 'include' })
    .then((res) => res.json() as Promise<{ liked?: boolean }>)
    .then((data) => Boolean(data.liked))
