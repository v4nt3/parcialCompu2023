class Sound {

    constructor(sources, radius, scene, additionalParams) {

        this.audio = document.createElement("audio");
        this.radius = radius;
        this.scene = scene;

        for (var i = 0; i < sources.length; i++) {
            var source = document.createElement("source");
            source.src = sources[i];
            this.audio.appendChild(source);
        }

        // Additional params
        let ap = additionalParams || {};
        this.volume = ap.volume || 1;
        this.position = new THREE.Vector3(
            ap.position ? ap.position.x : 0,
            ap.position ? ap.position.y : 0,
            ap.position ? ap.position.z : 0
        );

        if (ap.debug) {
            this.debugMode();
        }
    }

    debugMode() {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 5, 5),
            new THREE.MeshBasicMaterial({
                color: 0x0099ff,
                wireframe: true,
                transparent: true,
                opacity: 0
            })
        );
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);
    }

    play() {
        this.audio.play().catch(function(e) {
            console.log(e);
        });
    }

    update(element) {
        var distance = this.position.distanceTo(element.position);

        let volume = (distance <= this.radius) ? this.volume * (1 - distance / this.radius) : 0;
        this.audio.volume = volume;
    }
}


