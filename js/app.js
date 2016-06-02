var tbCamPos = [
  { x: 12, y: -25, z: -100, pitch: 0, yawn: 0, roll:0 },
  { x: 12, y: -25, z: -100, pitch: 0, yawn: 0, roll:0 },
  {x:-19, y:-6, z:-25.00000000000003, pitch:0, yawn:0, roll:0 },
  {x:-31, y:-5, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:-1.3400000000000007 },
  {x:-18, y:-7, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:-1.3400000000000007 },
  {x:-18, y:-10, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:-1.560000000000001 },
  {x:-2, y:-10, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:-1.560000000000001 },
  {x:8, y:2, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:0 },
  {x:8, y:-25, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:0 },
  {x:5, y:-26, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:-0.2599999999999999 },
  {x:13, y:-36, z:-8.6666666666667, pitch:-1.0400000000000005, yawn:0, roll:-0.2599999999999999 },
  {x:19, y:-46, z:-20.333333333333364, pitch:0, yawn:0, roll:0 },
  { x: 12, y: -25, z: -100, pitch: 0, yawn: 0, roll:0 }        
];

var container;

var camera, scene, renderer, effect, clock, controls;

init();

function setCamPos( camPos ) {
  camera.position.set(-camPos.x, -camPos.y, -camPos.z);
  camera.rotation.set(-camPos.pitch, -camPos.yawn, -camPos.roll, "ZXY");        
}

function testCamPos(iPos) {
  var camPos = tbCamPos[iPos];
  setCamPos( camPos );
  if (iPos<tbCamPos.length-1) {
    setTimeout( function() {
      testCamPos(iPos+1);
    }, 2500 );
  }        
}      

function lerp (start, end, t, storage, prop ) {
  storage[prop] = start[prop] + t * (end[prop] - start[prop]);        
}

function animCamPos(iPos) {
  var start = tbCamPos[iPos];
  setCamPos( start );
  
  var end = tbCamPos[iPos+1];
  
  var param = { t: 0 };
  var anim = new TWEEN.Tween(param).to( {t: 1.0}, 2500 ).easing( TWEEN.Easing.Sinusoidal.InOut );
  anim.onUpdate( function() {
    var currentPos = {};
    lerp( start, end, param.t, currentPos, 'x' );
    lerp( start, end, param.t, currentPos, 'y' );
    lerp( start, end, param.t, currentPos, 'z' );
    lerp( start, end, param.t, currentPos, 'pitch' );
    lerp( start, end, param.t, currentPos, 'yawn' );
    lerp( start, end, param.t, currentPos, 'roll' );
    setCamPos( currentPos );    
  } );
  anim.onComplete( function() {
    if (iPos<tbCamPos.length-2) {
      animCamPos(iPos+1);
    } else {
      animCamPos(0);
    }
  } );
  anim.start();
}   

function init() {
  
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 700);
  //testCamPos(0);
  //setCamPos(tbCamPos[8]);
  animCamPos(0);
  scene.add(camera);
  
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('webglviewer');
  container.appendChild(element);
          
  renderer.setClearColor( 0xffffff, 1 );
  
  effect = new THREE.StereoEffect(renderer);
  
  //controls = new THREE.OrbitControls(camera, element);
  element.addEventListener('click', fullscreen, false);
  /*controls.target.set(
    camera.position.x + 0.15,
    camera.position.y,
    camera.position.z
  );*/
  //controls.noPan = true;
  //controls.noZoom = true;        
  
  
  
  var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  
  /*function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    
    element.addEventListener('click', fullscreen, false)        
  
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
    */
  
  //window.addEventListener('deviceorientation', setOrientationControls, true);
  
  var IMG_WIDTH = 76;
  var IMG_HEIGHT = 53;
  
  var floorTexture = THREE.ImageUtils.loadTexture('img/4FDA54DE484E0836.png');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  //floorTexture.repeat = new THREE.Vector2(50, 50);
  floorTexture.anisotropy = renderer.getMaxAnisotropy();
  var floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture
  });
  
  var geometry = new THREE.PlaneBufferGeometry(102, 102);
  var floor = new THREE.Mesh(geometry, floorMaterial);
  //floor.position.x = (IMG_WIDTH-102)/2;
  //floor.position.y = (102-IMG_HEIGHT)/2;
  //floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  
  /*for (var i=-IMG_WIDTH/2; i<IMG_WIDTH; i+=5) {
    for (var j=-IMG_HEIGHT/2; j<IMG_HEIGHT; j+=5) {
      for (var k=1; k<100; k+=2) {
        var vertex = new THREE.Vector3();
        vertex.x = i;
        vertex.y = j;
        vertex.z = k;
        ptsGeom.vertices.push( vertex );
      }
    }
  }*/
  
  var ptsGeom = new THREE.Geometry();
  
  for ( var i=0; i<5000; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = -IMG_WIDTH/2 + IMG_WIDTH*Math.random();
    vertex.y = IMG_HEIGHT*Math.random();
    vertex.z = 0.01 + 100*Math.random();
    ptsGeom.vertices.push( vertex );
  }        
  
  var ptMaterial = new THREE.PointsMaterial( { 
    size: 0.4,
    transparent : true,
    opacity : 0.5,
    color: 0xccccccc          
  } );
  var particles = new THREE.Points( ptsGeom, ptMaterial );
  scene.add( particles );
  
  clock = new THREE.Clock();
  
  animate();                
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
  update(clock.getDelta());
  render(clock.getDelta());
}

function update(dt) {
  resize();
  camera.updateProjectionMatrix();
  if (controls) controls.update(dt);
}
function render(dt) {
  effect.render(scene, camera);
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}			
