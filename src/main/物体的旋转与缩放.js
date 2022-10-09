import * as THREE from 'three';
// 导入轨迹控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);

// 添加相机
scene.add(camera);

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 修改物体位置
// cube.position.set(5, 0, 0);
// cube.position.x = 5;

// 物体缩放
// cube.scale.set(2, 3, 1);
// cube.scale.x = 2;

// 物体旋转
// cube.rotation.set(Math.PI / 4, 0, 0);

// 将几何体添加到场景中
scene.add(cube);

// console.log(cube)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机场景进行渲染
renderer.render(scene, camera);

// 创建轨迹控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

function render(time) {
  // cube.position.x += cube.position.x < 5 ? 0.01 : -cube.position.x;
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // cube.rotation.z += 0.01
  let t = time / 1000;
  if (cube.position.x < 5 && t) cube.position.x = t % 5 * 1;
  else cube.position.x = 0;
  // console.log(time)
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();