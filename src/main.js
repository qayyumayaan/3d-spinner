import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// need a scene, camera, renderer

// https://threejs.org/editor/

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
camera.rotation.set(-1.57,0,0);
// camera.up.set(0,-1,0)

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(0, 10, 0);
const controls = new OrbitControls(camera, renderer.domElement);

renderer.render( scene, camera );

// instantiate a loader
const loader = new OBJLoader();

let object;
let rotationSpeed = 0.01;

const container = new THREE.Group(); 

// load a resource
loader.load(
    // resource URL
    'src/assets/fidgetSpinner.obj',
    // called when resource is loaded
    function (object) {

        // Create a material with the desired color
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Apply the material to all child meshes of the loaded object
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        container.add(object);
        scene.add(container);

    },
    // called when loading is in progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);


// Add event listeners for click and touch events
// renderer.domElement.addEventListener('mousedown', onMouseDown, false);
// renderer.domElement.addEventListener('touchstart', onTouchStart, false);

let isRotating = false; // Flag to track rotation state


const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight)

// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)


function addStar() {
  const geometry = new THREE.SphereGeometry(.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)



function animate() {
  requestAnimationFrame( animate );

  container.rotateY(.1);
  renderer.render( scene, camera );
}

animate()

//   console.log(camera.position.x); // X-coordinate
//     console.log(camera.position.y); // Y-coordinate
//     console.log(camera.position.z); // Z-coordinate