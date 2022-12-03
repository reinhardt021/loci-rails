import $ from 'jquery'
import * as THREE from 'three'
// should include requestAnimationFrame()

function setupCamera() {
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

    return camera;
}

function addSkybox(scene) {
    // skybox
    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0xB4CDCD, side: THREE.BackSide });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
}

function addGrid(scene) {
    // creates the grid
    const size = 500;
    const step = 50;
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true });

    const points = []
    for (let i = -size; i <= size; i += step) {
      points.push( new THREE.Vector3(-size, 0, i    ) );
      points.push( new THREE.Vector3( size, 0, i    ) );
      points.push( new THREE.Vector3( i,    0, -size) );
      points.push( new THREE.Vector3( i,    0, size ) );
    }
    const gridGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.LineSegments(gridGeometry, gridMaterial);
    scene.add(line);
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xdddddd, 1); // just to see the shapes better for now
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
}

function init() {
    console.log("testing loci init")

    const camera = setupCamera();
    const scene = new THREE.Scene(); // 3D world

    //const pointLight = new THREE.PointLight(0xFFFF00);
    //pointLight.position.set(-7000, 7000, 7000);
    //scene.add(pointLight);

    addSkybox(scene);
    addGrid(scene);
    const renderer = createRenderer();

    const container = $('.container');
    container.append(renderer.domElement);

    const onWindowResize = () => {
        const WIDTH = window.innerWidth; // var WIDTH = 400;
        const HEIGHT = window.innerHeight; // var HEIGHT = 300;
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(WIDTH, HEIGHT);
        //controls.handleResize();
        renderer.render(scene, camera);
    }
    window.addEventListener('resize', onWindowResize, false);      
    renderer.render(scene, camera); // render the scene

}

init()
