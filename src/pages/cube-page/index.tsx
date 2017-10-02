import './styles.css'
import * as React from 'react'
import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols'
import * as DragControls from 'three-dragcontrols'

import Container from '../../components/container'
import Image from '../../components/image'
import Text from '../../components/text'
import Tag from '../../components/tag'
import { Modal } from '../../components/modal'

import { broadcast, Store } from '../../kora'
import { UUID } from '@ironbay/kora'

export default class CubePage extends React.Component<any, any> {
	constructor() {
		super()
		this.state = {}
	}
	componentDidMount() {
		const container = document.getElementById('container')
		const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
		camera.position.z = 1000

		const controls = new TrackballControls(camera)
		controls.rotateSpeed = 1.0
		controls.zoomSpeed = 1.2
		controls.panSpeed = 0.8
		controls.noZoom = false
		controls.noPan = false
		controls.staticMoving = true
		controls.dynamicDampingFactor = 0.3

		const scene = new THREE.Scene()
		scene.add( new THREE.AmbientLight( 0x505050 ) );
		const light = new THREE.SpotLight( 0xffffff, 1.5 );
		light.position.set( 0, 500, 2000 );
		light.castShadow = true;
		// light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
		light.shadow.bias = - 0.00022;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		scene.add( light );
		var geometry = new THREE.BoxGeometry( 40, 40, 40 );
		const objects = []

		var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
		this.set_position(Math.random() * 1000 - 500, Math.random() * 600 - 300, Math.random() * 800 - 400)
		object.castShadow = true;
		object.receiveShadow = true;
		scene.add( object );

		const renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor( 0xf0f0f0 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.sortObjects = false;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		container.appendChild( renderer.domElement );

		const dragControls = new DragControls([object], camera, renderer.domElement );
		dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
		dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );
		dragControls.addEventListener( 'drag', e => this.set_position(e.object.position.x, e.object.position.y, e.object.position.z));

		this.loop(renderer, object, controls, scene, camera)
	}
	render() {
		return (
			<Container fill justify-center align-center id='container' >
			</Container>
		)
	}
	private set_position(x, y, z) {
		broadcast({
			merge: {
				cube: {
					position: { x, y, z }
				}
			}
		})
	}
	private loop(renderer: THREE.Renderer, object, controls, scene, camera) {
		controls.update()
		const { x, y, z } = Store.get(['cube', 'position'])
		object.position.x = x
		object.position.y = y
		object.position.z = z
		renderer.render(scene, camera)
		requestAnimationFrame(() => this.loop(renderer, object, controls, scene, camera))
	}
}