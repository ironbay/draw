import { MemoryStore, Store as StoreBase, Kora as KoraBase, UUID } from '@ironbay/kora'

export const Store = new MemoryStore() as StoreBase
export const BufferStore = new MemoryStore() as StoreBase
// const host = 'ws://localhost:12000/socket'
const host = 'ws://hub.ironbay.digital/socket'
export const Kora = new KoraBase(host, Store)

export function broadcast(mutation) {
	Store.apply(mutation)
	return Kora.send('hub.broadcast', mutation)
}

Store.intercept(["connection"], async layer => {
	if (layer.merge['status'] !== 'ready')
		return
	const user = localStorage.getItem('user') || UUID.ascending()
	Store.put(["user", "key"], user)
	localStorage.setItem("user", user)

	await Kora.send('kora.template.add', {
		name: 'draw.point',
		action: 'hub.broadcast',
		arity: 4,
		version: 0,
		template: {
			merge: {
				drawing: {
					lines: {
						'$0': {
							'$1': {
								x: '$2',
								y: '$3',
							}
						}
					}
				}
			}
		}
	})

	await Kora.subscribe()
	await Kora.query_path(['drawing', 'lines'])
})