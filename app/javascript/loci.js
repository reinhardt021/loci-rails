import $ from 'jquery'
import * as THREE from 'three'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'

const itemCount = {
    sphere: 0,
    cube: 0
};

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

function addCube(scene, vector, color, dimensions) {
    if (!color) color = 0xFFCC00;
    if (!dimensions) dimensions = {l: 50, w: 50, h: 50};
    itemCount.cube += 1;

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(dimensions.l, dimensions.w, dimensions.h),
      new THREE.MeshLambertMaterial({ color: color })
    );
    cube.position.set(vector.x, vector.y, vector.z);
    cube.name = 'cube' + itemCount.cube;

    scene.add(cube);
}


function addSphere(scene, vector, color) {
    if (!color) color = 0xCCFF00;
    itemCount.sphere += 1;

    const radius = 50;
    const segments = 60;
    const rings = 16;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      new THREE.MeshPhongMaterial({ color })
    );
    sphere.position.set(vector.x, vector.y, vector.z);
    sphere.updateMatrix();
    sphere.matrixAutoUpdate = false;
    sphere.name = 'sphere' + itemCount.sphere;

    scene.add(sphere);
}

function addItems(scene) {
    const sphere = addSphere(scene, {x:100, y:100, z:100}, 0xCC0000);
    const cube = addCube(scene, {x:-100,y:-100,z:-100}, 0x00FF00, {l:50,w:50,h:50});
    const cubeX = addCube(scene, {x:-200,y:-200,z:-200}, 0x00FF00, {l:50,w:50,h:50});

    const cubeTR = addCube(scene, {x:500,z:500,y:0}, 0x0000FF, {l:50,w:50,h:50});
    const cubeBR = addCube(scene, {x:500,z:-500,y:0}, 0x0000FF, {l:50,w:50,h:50});
    const cubeBL = addCube(scene, {x:-500,z:-500,y:0}, 0x0000FF, {l:50,w:50,h:50});
    const cubeTL = addCube(scene, {x:-500,z:500,y:0}, 0x0000FF, {l:50,w:50,h:50});

}

function addLights(scene) {
    // light from the left of initial camera
    //const pointLight = new THREE.PointLight(0xFFFF00);
    //pointLight.position.set(-7000, 7000, 7000);
    //scene.add(pointLight);

    // light from above of initial camera
     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
     directionalLight.position.set(0, 1, 0);
     scene.add(directionalLight);

    // some light on bottom of initial camera
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
}

function addSkybox(scene) {
    // DEFAULT
    //const size = 10000; // length, width, and height
    const size = 8000; // length, width, and height
    const color = 0xB4CDCD;

    const box = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
    const skybox = new THREE.Mesh(box, material);
    scene.add(skybox);

    // IMAGE
    const fileUrls = [
      // right & left
      "/assets/images/textures/skybox/px.jpg"
      //"<%= asset_path('assets/images/textures/skybox/px.jpg')%>",
      //"<%= asset_path('textures/skybox/nx.jpg')%>",
      // top & bottom
      //"<%= asset_path('textures/skybox/py.jpg')%>",
      //"<%= asset_path('textures/skybox/ny.jpg')%>",
      // back & front
      //"<%= asset_path('textures/skybox/pz.jpg')%>",
      //"<%= asset_path('/images/textures/skybox/nz.jpg')%>",
    ];
    //scene.add( makeSkybox(fileUrls, 8000) );
    scene.background = new THREE.CubeTextureLoader()
        .load(fileUrls)
    //const cubemap = THREE.ImageUtils.loadTextureCube(urls);
    //cubemap.format = THREE.RGBFormat;

    //const skyboxShader = THREE.ShaderLib['cube'];
    //skyboxShader.uniforms['tCube'].value = cubemap;

    //const box2 = new THREE.BoxGeometry(size, size, size);
    //const material2 = new THREE.ShaderMaterial({
        //fragmentShader : skyboxShader.fragmentShader,
        //vertexShader : skyboxShader.vertexShader,
        //uniforms : skyboxShader.uniforms,
        //depthWrite : false,
        //side : THREE.BackSide
    //})
    //const skybox2 = new THREE.Mesh(box2, material2);
    //scene.add(skybox);
}

function addGrid(scene) {
    // creates the grid
    const size = 500;
    const step = 50;
    const color = 0x000000;
    const opacity = 0.2;
    const transparent = true;
    const gridMaterial = new THREE.LineBasicMaterial({ color, opacity, transparent });

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

function handleWindowResize(scene, camera, renderer) {
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
}

function handleControlUpdates(scene, camera, renderer) {
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 5.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    //controls.dynamicDampingFactor = 0.3; // only needed if staticMoving = false
    controls.keys = [65, 83, 68];
    const onControlInputs = () => renderer.render(scene, camera)
    controls.addEventListener('change', onControlInputs);

    return controls;
}

function init() {
    console.log("Welcome to Loci the digital sky!")

    const camera = setupCamera();
    const scene = new THREE.Scene(); // 3D world

    addSkybox(scene);
    addGrid(scene);
    addItems(scene);
    addLights(scene);

    const renderer = createRenderer();

    // note this needs to be before handleControlUpdates()
    $('.container').append(renderer.domElement);

    handleWindowResize(scene, camera, renderer);
    const controls = handleControlUpdates(scene, camera, renderer);

    renderer.render(scene, camera); // render the scene

    return controls;
}

function animate(controls) {
    // recursion needed to animate the page on control updates
    window.requestAnimationFrame(() => animate(controls));
    controls.update();
}


const controls = init();
animate(controls);
