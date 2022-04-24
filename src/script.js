import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { MaterialLoader } from 'three';

//
const textureLoader = new THREE.TextureLoader();

const rain = textureLoader.load('/textures/rainTex.png');
const normal = textureLoader.load('/textures/NormalMap.png');
const worldNormalMap = textureLoader.load('/textures/worldNormalMap.png');
//const worldTexture = textureLoader.load('/textures/world.jpg');
const worldTexture = new THREE.TextureLoader().load( '/textures/worldImage.jpg');
worldTexture.wrapS = THREE.RepeatWrapping;
worldTexture.wrapT = THREE.RepeatWrapping;
worldTexture.repeat.set( 1, 1 );

//displacment da profundidade ao normal map
const displacmentMap = new THREE.TextureLoader().load( '/textures/DisplacementMap.png');


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 64, 64);

// Materials
const meshStandardMaterialFolder = gui.addFolder('THREE.MeshStandardMaterial')

const material = new THREE.MeshStandardMaterial({
    metalness : 1,
    aoMap : (new THREE.TextureLoader().load( '/textures/AmbientOcclusionMap.png')),
    //vertexColors : true,
    //color : new THREE.Color(0x7718ff)
});
material.normalMap = worldNormalMap;
material.map = worldTexture;
material.displacementMap = displacmentMap;
material.displacementScale = 0.3;
material.displacementBias = -0.26;
material.flatShading = true;


meshStandardMaterialFolder.add(material, 'displacementScale', -1, 1, 0.01)
meshStandardMaterialFolder.add(material, 'displacementBias', -1, 1, 0.01)
meshStandardMaterialFolder.add(material, 'flatShading').onChange(() => updateMaterial())

function updateMaterial() {
    material.side = Number(material.side)
    material.needsUpdate = true
}
//material.color = new THREE.Color(0x7718ff)

// Mesh
let sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.x = 10;
pointLight.position.y = 2.44;
pointLight.position.z = 10;
pointLight.intensity = 1;
scene.add(pointLight)


//redLight
//const light1 = gui.addFolder('Light 1')
//
//const pointLight2 = new THREE.PointLight(0xff0000, 2)
//pointLight2.position.set(1.41,0.5,-1.97);
//pointLight2.intensity = 1;
//scene.add(pointLight2)
//
//light1.add(pointLight2.position, 'y').min(-10).max(10).step(0.01);
//light1.add(pointLight2.position, 'x').min(-10).max(10).step(0.01);
//light1.add(pointLight2.position, 'z').min(-10).max(10).step(0.01);
//light1.add(pointLight2, 'intensity').min(-3).max(100).step(0.01);

//const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
//scene.add(pointLightHelper);

//bluelight
//const light2 = gui.addFolder('Light 2')
//
//const pointLight3 = new THREE.PointLight(0x7718ff, 2)
//pointLight3.position.set(-2.19,-1.75,-7.26);
//pointLight3.intensity = 24;
//scene.add(pointLight3)
//
//light2.add(pointLight3.position, 'y').min(-10).max(10).step(0.01);
//light2.add(pointLight3.position, 'x').min(-10).max(10).step(0.01);
//light2.add(pointLight3.position, 'z').min(-10).max(10).step(0.01);
//light2.add(pointLight3, 'intensity').min(-3).max(100).step(0.01);
//
//const light3Color = {
//    color: 0x7718ff
//}
//
//light2.addColor(light3Color, 'color')
//.onChange(() => {
//    pointLight3.color.set(light3Color.color)
//});

//const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1)
//scene.add(pointLightHelper3);

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
document.addEventListener('mousemove', onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerWidth / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

window.addEventListener('scroll', () => {
    sphere.position.y = window.scrollY*.005
})

const clock = new THREE.Clock()
let lastTime = 0;

const tick = () =>
{
    targetX = mouseX * .001;
    targetY = mouseY * .001;
    var segments

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime;

    if(elapsedTime > lastTime+1)
    {
        sphere.geometry = new THREE.SphereBufferGeometry(1, getRandomInt(1, 64), getRandomInt(1, 64));

        //console.log(elapsedTime);
        lastTime = elapsedTime;
    }
    
    //let geo 
    //sphere = new THREE.Mesh(geo,material)
    

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y);
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x);
    sphere.position.z += .05 * (targetY*2 - sphere.position.z);
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }