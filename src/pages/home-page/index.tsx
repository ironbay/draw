import './styles.css'
import * as React from 'react'

import Container from '../../components/container'
import Text from '../../components/text'
import Tag from '../../components/tag'
import { Modal } from '../../components/modal'

import { broadcast, Kora, Store } from '../../kora'
import { UUID } from '@ironbay/kora'

export default class HomePage extends React.Component<any, any> {
	constructor() {
		super()
		this.state = {}
	}
	componentDidMount() {
		const width = window.outerWidth
		const height = window.outerHeight
		this.canvas.width = 700
		this.canvas.height = 700
		this.loop()
	}
	render() {
		return (
			<Container fill block >
				<canvas
					onMouseDown={this.handle_down}
					onMouseMove={this.handle_move}
					onMouseUp={this.handle_up}
					ref='canvas'
					style={{border: '1px solid'}} />
				<button onClick={this.handle_clear}>Clear</button>
			</Container>
		)
	}
	private get canvas() { return this.refs.canvas as HTMLCanvasElement }

	private handle_clear = () => {
		broadcast({
			delete: {
				drawing: 1
			}
		})
	}

	private line = null
	private handle_down = (e: React.MouseEvent<HTMLCanvasElement>) => {
		this.line = UUID.ascending()
	}
	private handle_move = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!this.line)
			return
		// broadcast({
		// 	merge: {
		// 		'drawing': {
		// 			'lines': {
		// 				[this.line]: {
		// 					[new Date().getTime()]: {
		// 						x: e.clientX,
		// 						y: e.clientY,
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// })
		Kora.send('kora.template.call', {
			name: 'draw.point',
			args: [this.line, new Date().getTime().toString(), e.clientX, e.clientY]
		})
	}
	private handle_up = (e: React.MouseEvent<HTMLCanvasElement>) => {
		this.line = null
	}
	private loop = () => {
		const canvas = this.canvas
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		Object
		.values(Store.get(['drawing', 'lines']) || {})
		.map(line => {
			const [first, ...points] = Object.entries(line || {}).sort((a,b) => a[0] < b[0] ? 1 : -1).map(r => r[1])
			if (!first)
				return
			ctx.beginPath()
			ctx.moveTo(first.x, first.y)
			points.forEach(point => ctx.lineTo(point.x, point.y))
			ctx.lineWidth = 4
			ctx.stroke()
			ctx.closePath()
		})
		requestAnimationFrame(this.loop)
	}
}