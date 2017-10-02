import './reset.css'
import './styles.css'
import * as React from 'react'
import { Kora, Store } from '../kora'

import Container from '../components/container'

export default class Root extends React.Component<any, any> {
	constructor() {
		super()
	}
	componentDidMount() {
		Store.onChanged.add(() => {
			console.log(Store.get([]))
			this.forceUpdate()
		})
		Kora.query_path([])
	}
	render() {
		const user = Store.get(['user', 'key'])
		if (!user)
			return false
		return (
			<Container vertical>
				{
					[].concat(this.props.children).map((item, n) => React.cloneElement(item, {key: n}))
				}
			</Container>
		)
	}
}
