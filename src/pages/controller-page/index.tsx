import './styles.css'
import * as React from 'react'

import Container from '../../components/container'
import Image from '../../components/image'
import Text from '../../components/text'
import Tag from '../../components/tag'
import { Modal } from '../../components/modal'

import { broadcast, Store } from '../../kora'
import { UUID } from '@ironbay/kora'

export default class ControllerPage extends React.Component<any, any> {
	constructor() {
		super()
		this.state = {}
	}
	componentDidMount() {
		const user = Store.get(['user', 'key'])
		broadcast({
			delete: {
				motion: 1
			}
		})
		window.addEventListener('deviceorientation', e => {
			broadcast({
				merge: {
					motion: {
						[user]: {
							beta: e.beta,
							gamma: e.gamma,
						}
					}
				}
			})
		})
	}
	render() {
		let devices = Store.get(['motion']) || {}
		devices = Object.keys(devices).map(k => devices[k])
		return (
			<Container fill justify-center align-center >
			{
				devices.map(device => {
					const rotation = (device.beta - 90) * Math.sign(device.gamma) * -1
					return (
						<Container block pad-4>
							<Image
								style={{
									transform: `rotate(${rotation}deg)`,
									transformOrigin: '50% 90%',
								}}
								src='https://cdn.shopify.com/s/files/1/1061/1924/products/Raised_Hand_Emoji_large.png?v=1480481047'
								width='50'
								height='50' />
						</Container>
					)
				})


			}
			</Container>
		)
	}
}