import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/Addons.js';

// Debug GUI
const gui = new GUI();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

const scene = new THREE.Scene()

// Textures

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// material, geometry = mesh
// MeshBasicMaterial and some properties of material

// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('red')
// material.wireframe = false
// material.side = THREE.DoubleSide
// material.transparent = true
// material.opacity = 0.1

// MeshNormalMaterial

// const material = new THREE.MeshNormalMaterial()

// MeshMatCapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight, ambientLight)

// Environment Map
const rgbe = new RGBELoader()
rgbe.load('./textures/environmentMap/2k.hdr', (eMap) => {
    eMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = eMap
    scene.environment = eMap
})

// Mesh Standard Material
// const material = new THREE.MeshStandardMaterial();
// material.side = THREE.DoubleSide
// material.metalness = 1
// material.roughness = 1

// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1

// // where ever is bright it goes up and whereever is dark it goes down.
// // to make it more precise increase the sub-divisions of the materials.

// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1

// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture

// // normal map will just fake the normal orientation and adds details to the surface
// // regardless of the sub-divisions.

// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.1)

// material.transparent = true
// material.alphaMap = doorAlphaTexture

// Mesh Physical Material
const material = new THREE.MeshPhysicalMaterial();
material.side = THREE.DoubleSide
material.metalness = 1
material.roughness = 1

material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1

// where ever is bright it goes up and whereever is dark it goes down.
// to make it more precise increase the sub-divisions of the materials.

material.displacementMap = doorHeightTexture
material.displacementScale = 0.1

material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture

// normal map will just fake the normal orientation and adds details to the surface
// regardless of the sub-divisions.

material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.1)

material.transparent = true
material.alphaMap = doorAlphaTexture


gui.add(material, 'metalness')
    .min(0)
    .max(1)
    .step(0.001)

gui.add(material, 'roughness')
    .min(0)
    .max(1)
    .step(0.001)

gui.add(material, 'displacementScale')
    .min(0.01)
    .max(2)
    .step(0.01)

gui.add(material, 'wireframe')

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64), 
    material
)

sphere.position.y = 2.5


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)



const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 64, 128),
    material
)

torus.position.y = -2.5

scene.add(sphere, torus, plane)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // animate the objects using rotation
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()