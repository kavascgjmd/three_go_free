import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'


const scene = new THREE.Scene();
const camera  = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1,1000);
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
const rendererscreen = {
  x : innerWidth,
  y : innerHeight
}

renderer.setSize(rendererscreen.x, rendererscreen.y);
renderer.setPixelRatio(devicePixelRatio);
new OrbitControls(camera, renderer.domElement)
camera.position.z = 5;
let gui_container = document.getElementById('gui_container')
const gui = new dat.GUI({autoPlace : false , width : 100});
gui.domElement.id = 'gui';
gui_container.appendChild(gui.domElement);
const world = {
  plane : 
  {
    w : 20,
    h : 20,
    ws : 25,
    hs : 25
  }
}

gui.add(world.plane, 'w', 1 , 50).onChange(
  generatePlane
)

gui.add(world.plane , 'h' , 1 , 50).onChange(
  generatePlane
)

gui.add(world.plane, 'ws', 1 , 50 ).onChange(
  generatePlane
)

gui.add(world.plane, 'hs', 1, 50).onChange(
  generatePlane
)
function generatePlane(){
  planemesh.geometry.dispose();
  planemesh.geometry = new THREE.PlaneGeometry(world.plane.w , world.plane.h, world.plane.ws , world.plane.hs)
  let {array} = planemesh.geometry.attributes.position;

for(let i = 0; i<array.length; i+=3){
   array[i+2] += Math.random();
}
const colors = [];
for(let i = 0 ; i<planemesh.geometry.attributes.position.count ; i++){
  colors.push(1,0,0);
}
planemesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array (colors) , 3));
planemesh.geometry.attributes.position.originalposition = array;
}

const raycaster = new THREE.Raycaster();

const planegeometry = new THREE.PlaneGeometry(20,20,25,25);
const material = new THREE.MeshPhongMaterial({vertexColors : true,side:THREE.DoubleSide , flatShading : THREE.FlatShading });
const planemesh = new THREE.Mesh(planegeometry, material);




let {array} = planemesh.geometry.attributes.position;
planemesh.geometry.attributes.position.originalposition = array;

for(let i = 0; i<array.length; i+=3){
     array[i+2] += Math.random()
}
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0,0,1);
scene.add(light);

const lowlight = new THREE.DirectionalLight(0xffffff, 1 );
light.position.set(0,0,-1);
scene.add(lowlight);
scene.add(planemesh);

const colors = [];
for(let i = 0 ; i<planemesh.geometry.attributes.position.count ; i++){
  colors.push(1,0,0);
}
planemesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array (colors) , 3))

const mouse = {
  x : undefined,
  y : undefined
}

renderer.domElement.addEventListener('mousemove',function(e){
  mouse.x = (e.x/rendererscreen.x)*2 - 1;
  mouse.y = 1 - (e.y/rendererscreen.y)*2;
  
})
let  factor = 0;
function animate(){
  requestAnimationFrame(animate);
  factor += 0.1;
  let {array, originalposition} = planemesh.geometry.attributes.position;
  for(let i = 0; i<array.length ; i += 3){
    array[i] = originalposition[i]+Math.cos(factor+Math.random()*5)*0.005;
    array[i+1] = originalposition[i+1]+Math.sin(factor+Math.random()*5)*0.005;
  
  }
  planemesh.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene,camera);
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObject(planemesh);
  if(intersects.length){

    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a , 0);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.a , 0);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.a , 0);

    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b , 0);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b , 0);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.b , 0);
    
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c , 0);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.c , 0);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c , 0);

    intersects[0].object.geometry.attributes.color.needsUpdate= true;
    let initalcolor = {
      r : 1,
      g : 0, 
      b : 0
    }
    let hovercolor = {
      r : 1,
      g : 1,
      b : 1,
    }
    
    gsap.to(hovercolor, {
      r : initalcolor.r,
      g : initalcolor.g,
      b: initalcolor.b,
      duration : 1,
      onUpdate : ()=>{
        intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a , hovercolor.r);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.a , hovercolor.g);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.a , hovercolor.b);

    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b , hovercolor.r);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b , hovercolor.g);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.b , hovercolor.b);
    
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c , hovercolor.r);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.c , hovercolor.g);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c , hovercolor.b);

    
    intersects[0].object.geometry.attributes.color.needsUpdate= true;
      }
    })
  }


}
 
animate();


