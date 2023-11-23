var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    origin = new THREE.Vector3(0, 0, 0),
    figuresGeo = [],
    obj = null,
    count = 0,
    toAlter = null;
    nightLights = [];


var sound1, sound2, sound3, sound4,  ppPlayer = null, collidableMeshList = [];

var plane, modelLoad, light, nightLights = [];

function start() {
    window.onresize = onWindowResize;
    initScene();
    animate();
    initSound();
}

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
    renderer.setClearColor(0x0099ff);
    renderer.setSize(window.innerWidth, window.innerHeight - 4);
    document.body.appendChild(renderer.domElement);

    var cubeGeometry = new THREE.BoxGeometry(300, 300, 300);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./img/cielo.jpg'),
        side: THREE.BackSide,
    });

    plane = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(plane);

    createFistModel('./modelos/zoo/OBJ/', 'zoo2.mtl', 'zoo2.obj');
    createFistModel('./modelos/zoo/OBJ/', 'panda.mtl', 'panda.obj');
    createFistModel('./modelos/zoo/OBJ/', 'oso polar.mtl', 'oso polar.obj');
    createFistModel('./modelos/zoo/OBJ/', 'camello.mtl', 'camello.obj');
    createFistModel('./modelos/zoo/OBJ/', 'tortuga(2) vox.mtl', 'tortuga(2) vox.obj');

    createFistModel('./modelos/zoo/OBJ/', 'panda2.mtl', 'panda2.obj');
    createFistModel('./modelos/zoo/OBJ/', 'oso polar2.mtl', 'oso polar2.obj');
    createFistModel('./modelos/zoo/OBJ/', 'camello2.mtl', 'camello2.obj');
    createFistModel('./modelos/zoo/OBJ/', 'tortuga(2) vox2.mtl', 'tortuga(2) vox2.obj');
    camera.position.set(0, 3, 40);
    camera.position.x = -35.5;
    camera.position.y = 7;
    camera.position.z = 40;
    createLight('AmbientLight');
    initGUI();
    recoControls();
    initSound();
    pricipalPlayer();
}

function playAudio() {
    sound1.play();
    sound2.play();
    sound3.play();
    sound4.play();
}

function pricipalPlayer() {
    var geometry = new THREE.BoxGeometry(1, 2, 1, 1, 2, 1);
    var material = new THREE.MeshBasicMaterial({  color: 0x0099ff,
        wireframe: true,
        transparent: true,
        opacity: 0});
    ppPlayer = new THREE.Mesh(geometry, material);
    ppPlayer.position.x = -35.5;
    ppPlayer.position.y = 7;
    ppPlayer.position.z = 40;
    scene.add(ppPlayer);
}

function initSound() {
    sound1 = new Sound(["./songs/panda.mp3"], 15, scene, { volume: 0.5, position: { x: -45, y: 5, z: 20 }, debug: true });
    sound2 = new Sound(["./songs/agua.mp3"], 15, scene, { volume: 0.2, position: { x: -45, y: 5, z: 0 }, debug: true });
    sound3 = new Sound(["./songs/camello.mp3"], 15, scene, { volume: 1, position: { x: -25, y: 5, z: -6 }, debug: true });
    sound4 = new Sound(["./songs/polar.mp3"], 15, scene, { volume: 0.3, position: { x: -25, y: 5, z: 14 }, debug: true });
}



function go2Play() {
    document.getElementById('blocker').style.display = 'none';
}

var rotationAngle = 0;

function recoControls() {
    document.addEventListener("keydown", onDocumentKeyDown, false);

    function onDocumentKeyDown(event) {
        var keyCode = event.which;

        if (keyCode == 37 || keyCode == 65) {
            ppPlayer.rotation.y += Math.PI / 4;
            rotationAngle += Math.PI / 4;
        } else if (keyCode == 39 || keyCode == 68) {
            ppPlayer.rotation.y -= Math.PI / 4;
            rotationAngle -= Math.PI / 4;
        } else if (keyCode == 38 || keyCode == 87) {
            ppPlayer.position.x -= 5 * Math.sin(rotationAngle);
            ppPlayer.position.z -= 5 * Math.cos(rotationAngle);
            camera.position.x = ppPlayer.position.x;
            camera.position.z = ppPlayer.position.z;
            sound1.play();
            sound2.play();
            sound3.play();
            sound4.play();
        } else if (keyCode == 40 || keyCode == 83) {
            ppPlayer.position.x += 5 * Math.sin(rotationAngle);
            ppPlayer.position.z += 5 * Math.cos(rotationAngle);
            camera.position.x = ppPlayer.position.x;
            camera.position.z = ppPlayer.position.z;
        }

        updateCamera();
    }

    function updateCamera() {
        camera.position.y = 7.5;
        camera.lookAt(ppPlayer.position);
        camera.rotation.set(ppPlayer.rotation.x, ppPlayer.rotation.y, ppPlayer.rotation.z);
        camera.updateProjectionMatrix();
    }
}
const lightPositions = [
    new THREE.Vector3(-37.5, 10.2, 27.5),
    new THREE.Vector3(-33.5, 10.2, 6.5),
    new THREE.Vector3(-37.5, 10.2, -10.5),
];
function createLight(typeLight, positions, clearPrevious) {

    if (clearPrevious) {
        for (const nightLight of nightLights) {
            scene.remove(nightLight);
        }
        nightLights = []; 
    }

    switch (typeLight) {
        case "PointLight":
            if (nightLights.length === 0) {
                for (let i = 0; i < positions.length; i++) {
                    const position = positions[i];
                    const light = new THREE.PointLight(0xF7EC09, 0.3, 100);
                    light.position.copy(position);
                    scene.add(light);

                    const sphereSize = 0.2;
                    const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
                    scene.add(pointLightHelper);

                    nightLights.push(light); // Agrega la luz al array
                }
            }
            break;
        case "AmbientLight":
            var light2 = new THREE.AmbientLight(0xffffff);
            light2.position.set(10, 10, 10);
            light2.intensity = 0.8;
            scene.add(light2);
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sound1.update(camera);
    sound2.update(camera);
    sound3.update(camera);
    sound4.update(camera);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function mostrarInformacion() {
    var infoPanda = document.getElementById("infoPanda");
    if (infoPanda.style.display === "none") {
        infoPanda.style.display = "block";
    } else {
        infoPanda.style.display = "none";
    }
}
function mostrarOsoPolarInfo() {
    var osoPolarInfo = document.getElementById("osoPolarInfo");
    if (osoPolarInfo.style.display === "none") {
        osoPolarInfo.style.display = "block";
    } else {
        osoPolarInfo.style.display = "none";
    }
}
function mostrarCamelloInfo() {
    var camelloInfo = document.getElementById("camelloInfo");
    if (camelloInfo.style.display === "none") {
        camelloInfo.style.display = "block";
    } else {
        camelloInfo.style.display = "none";
    }
}
function mostrartotugaInfo() {
    var infoTortuga = document.getElementById("tortuga");
    if (infoTortuga.style.display === "none") {
        infoTortuga.style.display = "block";
    } else {
        infoTortuga.style.display = "none";
    }
}

function createFistModel(generalPath, pathMtl, pathObj) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {
            modelLoad = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(10, 10, 10);

            if (pathObj === 'zoo2.obj') {
                object.scale.set(10, 10, 10);
                object.position.set(-36, 4, 8);
                object.rotation.y += Math.PI / 2;
            } else if (pathObj === 'panda.obj') {
                object.scale.set(1, 1, 1);
                object.position.set(-50, 5, 20);
                object.rotation.y += Math.PI / 2;
                informacion();
            } else if (pathObj === 'oso polar.obj') {
                object.scale.set(1.5, 1.5, 1.5);
                object.position.set(-26, 5, 20);
                object.rotation.set(0, 8, 0);
            } else if (pathObj === 'tortuga(2) vox.obj') {
                object.scale.set(1, 1, 1);
                object.position.set(-46, 7, -3);
                object.rotation.set(0, 2, 0);
            } else if (pathObj === 'camello.obj') {
                object.scale.set(1, 1, 1);
                object.position.set(-26, 5, -6);
                object.rotation.set(0, 4, 0);
            }
            else if (pathObj === 'panda2.obj') {
                object.scale.set(1, 1, 1);
                object.position.set(-50, 5, 17);
                object.rotation.y += Math.PI / 2;
            } else if (pathObj === 'oso polar2.obj') {
                object.scale.set(1.5, 1.5, 1.5);
                object.position.set(-26, 5, 11);
                object.rotation.set(0, 7, 0);
            } else if (pathObj === 'tortuga(2) vox2.obj') {
                object.scale.set(1, 1, 1);
                object.position.set(-46, 6, 2);
                object.rotation.set(0, 1, 0);
            } else if (pathObj === 'camello2.obj') {
                object.scale.set(1, 1, 1);
                object.position.set(-26, 5, 2);
                object.rotation.set(0, 5, 0);
            }
        });
    });
}

function informacion(){
    var textGeometry = new THREE.TextGeometry('El panda es un animal muy perezoso', {
        size: 20, // Tamaño del texto
        height: 0.6, // Grosor del texto
    });
    
    // Crear un material para el texto
    var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    // Crear un objeto Mesh utilizando la geometría y el material
    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // Posicionar y rotar el texto en 3D
    textMesh.position.set(-50, 10, 20);
     // Ajusta según sea necesario
    
    // Agregar el texto a la escena
    scene.add(textMesh);
    
}


function initGUI() {
    var gui = new dat.GUI(),
        speed = 0.1;

    parametros = {
        dayNightSwitch: "Day",
    };

    var dayNightSwitchGUI = gui.add(parametros, 'dayNightSwitch', ['Day', 'Night']).name('Select');

    dayNightSwitchGUI.onChange(function (value) {
        if (value === 'Day') {
            plane.material.map = new THREE.TextureLoader().load('./img/cielo.jpg');
            scene.children.forEach(child => {
                if (child instanceof THREE.PointLight) {
                    scene.remove(child);
                }
            });
        } else if (value === 'Night') {
            plane.material.map = new THREE.TextureLoader().load('./img/noche.jpg');
            createLight('PointLight', lightPositions, true)
        }
    });

    gui.close();
}

start();
