import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {HDRLoader} from 'three/examples/jsm/loaders/HDRLoader';

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(6, 6, 6);
orbit.update();

const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const gltfloader = new GLTFLoader();
const rgbloader = new HDRLoader();

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

rgbloader.load('./assets/MR_INT-001_NaturalStudio_NAD.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    gltfloader.load('./assets/model2/scene.gltf', function(gltf){  
        const model = gltf.scene;
        model.position.set(5, 1, 0);
        model.scale.set(5, 5, 5);
        scene.add(model);
       
    });

    gltfloader.load('./assets/model1/scene.gltf', function(gltf){
        const model2 = gltf.scene;
        model2.position.set(-3, 2, 0);
        model2.scale.set(0.05, 0.05, 0.05);
        model2.traverse(function(child){
            if(child.isMesh){
                child.material.side = THREE.DoubleSide;
                child.material.transparent = true;
                child.material.alphaTest = 0.1;
                child.material.depthWrite = true;
                child.material.needsUpdate = true;
            }
        });
        scene.add(model2);
    });
});


function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
