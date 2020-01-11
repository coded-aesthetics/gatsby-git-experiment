(function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var container,stats;

    var camera, scene, renderer;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var triangles;

    var pointCloud = [];
    var pcl = [];

    var numVertices =1000;
    var w = 598/2;
    var h = 362/2;
    var vertices = [];
    var colors = [];
    var meshes = [];
    var blob;
    var dirs = [];
    var texture1;
    var material1;
    var controls;
    var sphereObj;
    var timePassed = 0;
    var blobChildren = [];
    var first = true;
    var raycaster= new THREE.Raycaster();

    var INTERSECTED;

    window.onresize = function () {
			SCREEN_WIDTH = window.innerWidth;
			SCREEN_HEIGHT = window.innerHeight;
			camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 25000 );
        camera.position.z = 200;
			renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		};

    var cubey;

    var particleSystem;
    var verts;

    var lines = [];
    var MAX_NUM_LINES =150;

    function Joi() {
        this.pos = new THREE.Vector3();
        this.phi = 0.0;
        this.theta = 0.0;
        this.deltaPhi = Math.random()*0.2-0.1;
        this.deltaTheta = Math.random()*0.2-0.1;
        this.length = Math.random()*20.0 + 5;
        this.joint;
    }

    var joint = {
        pos: new THREE.Vector3(),
        phi: 0.0, theta: 0.0,
        deltaPhi: Math.random()*.051, deltaTheta: Math.random()*.051,
        length: Math.random()*20.0 + 20,
        joint: {
            phi: 0.0, theta: 0.0,
            deltaPhi: Math.random()*.051, deltaTheta: Math.random()*.051,
            length: Math.random()*20.0 + 2,
            joint: {
                phi: 0.0, theta: 0.0,
                deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                length: Math.random()*20.0 + 2,
                joint: {
                    phi: 0.0, theta: 0.0,
                    deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                    length: Math.random()*20.0 + 2,
                    joint: {
                        phi: 0.0, theta: 0.0,
                        deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                        length: Math.random()*20.0 + 2,
                        joint: {
                            phi: 0.0, theta: 0.0,
                            deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                            length: Math.random()*20.0 + 2,
                            joint: {
                                phi: 0.0, theta: 0.0,
                                deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                length: Math.random()*20.0 + 2,
                                joint: {
                                    phi: 0.0, theta: 0.0,
                                    deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                    length: Math.random()*20.0 + 2,
                                    joint: {
                                        phi: 0.0, theta: 0.0,
                                        deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                        length: Math.random()*20.0 + 2,
                                        joint: {
                                            phi: 0.0, theta: 0.0,
                                            deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                            length: Math.random()*20.0 + 2,
                                            joint: {
                                                phi: 0.0, theta: 0.0,
                                                deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                                length: Math.random()*20.0 + 2,
                                                joint: {
                                                    phi: 0.0, theta: 0.0,
                                                    deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                                    length: Math.random()*20.0 + 2,
                                                    joint: {
                                                        phi: 0.0, theta: 0.0,
                                                        deltaPhi: Math.random()*0.2-0.1, deltaTheta: Math.random()*0.2-0.1,
                                                        length: Math.random()*20.0 + 2
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    var DEPTH = 12;

    var colors = [];
    var light, light2;
    function init() {
        var spMat = new THREE.MeshBasicMaterial( { color: 0x100afa } );
        var spMat2 = new THREE.MeshPhongMaterial({
            // light
            specular: '#1001aa',
            // intermediate
            color: '#1001ff',
            // dark
            emissive: '#006063',
            shininess: 5
        });
        for (var i = 3; i--;) {
            colors.push(Math.floor(Math.random()*0xFFFFFF));
        }

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        raycaster = new THREE.Raycaster();

        renderer = new THREE.WebGLRenderer( { antialias: true } );

        camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 25000 );
        camera.position.z = 200;

        scene = new THREE.Scene();


        joint = new Joi();
        var j = joint;

        for (var b = DEPTH; b--;) {
            j.joint = new Joi();
            j = j.joint;
        }

        //scene.add(sphereObj);

        light2 = new THREE.DirectionalLight( 0x222222, 2 );
        light2.position.set( 10, 1, 15 );
        scene.add( light2 );

        light = new THREE.DirectionalLight( 0x222222, 2 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        var ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        //scene.add()

        // RENDERER
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.setClearColor( 0x0, 1 );
        renderer.autoClear = false;

        renderer.domElement.style.position = "relative";
        container.appendChild( renderer.domElement );

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        // STATS1
        stats = new Stats();
        container.appendChild( stats.domElement );

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

        lastTime = new Date().getTime();
    }

    var mouse = new THREE.Vector2();

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    function onMouseDown( event ) {



    }

    var lastPos;// = joint.pos;

    function drawJoints(deltaTime) {

        var geometry = new THREE.Geometry();
        var j = joint;
        var pos = j.pos;

        if (j) {
            geometry.vertices.push(lastPos);
            var col = new THREE.Color();
            col.setHSL(j.phi/100%1.0, 0.8,0.5)
            var material = new THREE.LineBasicMaterial({
                color: col
            });
        }
        while (j) {
            var r = j.length;
            var x = pos.x + r * Math.sin(j.theta) * Math.cos(j.phi);
            var y = pos.y + r * Math.sin(j.theta) * Math.sin(j.phi);
            var z = pos.z + r * Math.cos(j.theta);
            pos = new THREE.Vector3(x, y, z);
            if (j != joint) geometry.vertices.push(pos);
            if (j.joint) {
                if (!j.joint.joint) {
                    geometry.vertices.push(pos);
                }
            }
            j.theta += j.deltaTheta/2.0;
            j.phi   += j.deltaPhi/2.0;
            j = j.joint;
            if (!j) {
                var bail = false;
                if (!lastPos) bail = true;
                lastPos = pos;
                if(bail) return;
                geometry.vertices.push(pos);
            }
        }
        var line = new THREE.Line(geometry, material);

        scene.add(line);
        lines.push(line);
        if (lines.length > MAX_NUM_LINES) {
            var a = lines.splice(1);
            scene.remove(lines[0]);
            lines = a;
        }
    }

var uuu = 0;
    function animate() {
        var thisTime = new Date().getTime();
        var deltaTime = thisTime - lastTime;
        /*
conole
            */
//console.log(uuu);
        drawJoints();

        requestAnimationFrame( animate );

        render();
        controls.update();
        stats.update();
        lastTime = thisTime;
    }

    var timeNewLookAt = 0;
    var nextUpdate = 0;
    var lookAt = new THREE.Vector3(0,0,0);
    var newLookAt = new THREE.Vector3(0,0,0);
    var oldLookAt = new THREE.Vector3(0,0,0);
    var lookAtDist = new THREE.Vector3(0,0,0);
    var theta = 45;
    var radius = 100;
    var radius2 = 100;
    var beta = 33;
    var gamma = 33;
    var delta = 33;
    function render() {

        camera.position.x = 0;//+= ( mouseX - camera.position.x ) * .05;
        camera.position.y = -200;// THREE.Math.clamp( camera.position.y + ( - ( mouseY - 200 ) - camera.position.y ) * .05, 50, 1000 );
        camera.position.z = 200;

        theta += 1.5;
        beta += 0.5;
        gamma -= 0.8;

        camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

        var x = radius2 * Math.sin( THREE.Math.degToRad( beta ) );
        var y = radius2 * Math.sin( THREE.Math.degToRad( beta ) );
        var z = radius2 * Math.cos( THREE.Math.degToRad( beta ) );

        light.position.set(x,y,z);

        var x = radius2 * Math.sin( THREE.Math.degToRad( gamma ) );
        var y = radius2 * Math.sin( THREE.Math.degToRad( gamma ) );
        var z = radius2 * Math.cos( THREE.Math.degToRad( gamma ) );

        light2.position.set(x,y,z);

        var tp = timePassed - timeNewLookAt;
        if (tp < 1000) {
            var x = (oldLookAt.x) + lookAtDist.x * (tp / 1000);
            var y = (oldLookAt.y) + lookAtDist.y * (tp / 1000);
            var z = (oldLookAt.z) + lookAtDist.z * (tp / 1000);

            //lookAt = new THREE.Vector3(x,y,z);
        }
       // lookAt = new THREE.Vector3(mouse.x*50, mouse.y*50, 0);
        camera.lookAt( lookAt );

        //radius = 30+100*Math.pow(0.99999, timePassed);
        //camera.fov = 35*Math.pow(0.9998, timePassed);
        camera.fov = 35;
        camera.updateProjectionMatrix ();

        renderer.enableScissorTest( false );
        renderer.clear();
        renderer.enableScissorTest( true );

        renderer.setScissor( 0, 0, SCREEN_WIDTH - 2, SCREEN_HEIGHT );

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( scene.children );

        if ( intersects.length > 0 ) {
            var obj = intersects[ 0 ].object;
            scene.updateMatrixWorld();

            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition( obj.matrixWorld );
            newLookAt = vector;
            oldLookAt = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
            timeNewLookAt = timePassed;

            lookAtDist = new THREE.Vector3(newLookAt.x-lookAt.x,newLookAt.y-lookAt.y,newLookAt.z-lookAt.z);
            if ( false && INTERSECTED != intersects[ 0 ].object ) {

               if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );


                INTERSECTED = intersects[ 0 ].object;
                makeSmaller();
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff0000 );
                //INTERSECTED.material.emissive.setHex( Math.floor(Math.random()*0xFFFFFF) );

            }

        } else {
           // newLookAt = new THREE.Vector3(0,0,0);
          //  oldLookAt = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
           // lookAtDist = new THREE.Vector3(newLookAt.x-lookAt.x,newLookAt.y-lookAt.y,newLookAt.z-lookAt.z);
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = null;

        }

        renderer.render( scene, camera );

    }

    function update() {
        controls.update();
    }

    document.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    document.addEventListener("DOMContentLoaded", function(event) {
        init();
        animate();
    });
})();