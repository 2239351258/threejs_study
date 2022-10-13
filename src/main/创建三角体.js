import * as THREE from 'three';
// 导入轨迹控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'


// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);

// 添加相机
scene.add(camera);

// 创建几何体
for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    positionArray[j] = Math.random() * 10 - 5
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
  // 根据几何体和材质创建物体
  const mesh = new THREE.Mesh(geometry, material)
  // 将几何体添加到场景中
  scene.add(mesh);
}

const gui = new dat.GUI();
// 设置文件夹
let folder = gui.addFolder('设置物体')

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
// 设置控制器阻尼感，必须在动画循环里调用update()
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

// 双击实现全屏/推出全屏
window.addEventListener('dblclick', () => {
  const fullScreenElement = document.fullscreenElement
  if (fullScreenElement) {
    // 推出全屏
    document.exitFullscreen();
  }
  else {
    // 进入全屏
    renderer.domElement.requestFullscreen()
  }
})

function render() {
  controls.update()
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener('resize', () => {
  console.log('画面变化')
  // 跟新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})