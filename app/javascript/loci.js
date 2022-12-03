import $ from 'jquery'
import * as THREE from 'three'

function init() {
    console.log("testing loci init")
    //$('.container').text('something init')

    // set scene size
    const WIDTH = window.innerWidth; // var WIDTH = 400;
    const HEIGHT = window.innerHeight; // var HEIGHT = 300;
    
    // set some camera attributes
    const VIEW_ANGLE = 75; // AKA FOV field of view
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    const CAMERA_X = 200;
    const CAMERA_Y = 400;
    const CAMERA_Z = 700;
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    // camera.lookAt(scene.position);

    // world
    const scene = new THREE.Scene();

    const pointLight = new THREE.PointLight(0xFFFF00);
    pointLight.position.set(-7000, 7000, 7000);
    scene.add(pointLight);

    // skybox
    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0xB4CDCD, side: THREE.BackSide });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);


    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xdddddd, 1); // just to see the shapes better for now
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = $('.container');
    container.append(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);

}

init()
