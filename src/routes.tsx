import * as React from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import Root from './root'

import HomePage from './pages/home-page'
import ControllerPage from './pages/controller-page'
import CubePage from './pages/cube-page'

export default () => {
	return (
		<BrowserRouter>
			<Root>
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route exact path='/controller' component={ControllerPage} />
					<Route exact path='/cube' component={CubePage} />
				</Switch>
			</Root>
		</BrowserRouter>
	)
}


export class RouteHack extends React.Component<any, any> {
	render() {
		return (
			<BrowserRouter>
				{this.props.routes()}
			</BrowserRouter>
		)
	}
}
