import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { addStar } from './stars.js';
// need a scene, camera, renderer

// https://threejs.org/editor/

export const scene = new THREE.Scene();

const c = -.63

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 5000 );

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
camera.position.set(0, 10, c);
camera.rotation.set(-2.6, 0, 3.1415);

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

const controls = new OrbitControls(camera, renderer.domElement);

controls.update()

renderer.render( scene, camera );

// instantiate a loader
const loader = new OBJLoader();

const container = new THREE.Group(); 

loader.load(
    './fidgetSpinnerInner.obj',
    function (object) {

        const material = new THREE.MeshBasicMaterial({ color: 0x999999 });

        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        const box = new THREE.Box3().setFromObject(object);

        const center = box.getCenter(new THREE.Vector3());

        const rotationCenter = new THREE.Vector3(0, 0, c); 

        object.position.sub(center).add(rotationCenter);

        container.add(object);
        scene.add(container);

    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);


loader.load(
    './fidgetSpinnerOuter.obj',
    function (object) {

        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        const box = new THREE.Box3().setFromObject(object);

        const center = box.getCenter(new THREE.Vector3());

        const rotationCenter = new THREE.Vector3(0, 0, c); 

        object.position.sub(center).add(rotationCenter);

        container.add(object);
        scene.add(container);

    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);


const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight)

// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)


Array(200).fill().forEach(addStar)

renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('touchstart', onTouchStart, false);

let rotationSpeed = 0.1;
let isRotating = false;

function onMouseDown(event) {
    rotationSpeed += .1
    event.preventDefault();
    isRotating = true;
}

function onTouchStart(event) {
    event.preventDefault();
    if (event.touches.length === 1) {
        rotateObject();
    }
}

function rotateObject() {
    container.rotateY(rotationSpeed);
    rotationSpeed *= .99
    // console.log(rotationSpeed)
    if (rotationSpeed < .001) {
        rotationSpeed = 0
        isRotating = false;
    }
}


function animate() {
    requestAnimationFrame( animate );
    if (isRotating) {
        rotateObject();
        console.log(rotationSpeed.toFixed(2));
    }
    renderer.render( scene, camera );
}

animate()

// console.log(camera.position.x); // X-coordinate
// console.log(camera.position.y); // Y-coordinate
// console.log(camera.position.z); // Z-coordinate
// console.log(camera.rotation.x)
// console.log(camera.rotation.y)
// console.log(camera.rotation.z)