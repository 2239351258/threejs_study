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
const cubeGeometry = new THREE.BoxGeometry();

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([-1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
-1.0, 1.0, 1.0,
-1.0, -1.0, 1.0
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const mesh = new THREE.Mesh(geometry, material)

// 将几何体添加到场景中
scene.add(cube);
scene.add(mesh);

const gui = new dat.GUI();
// 修改物体位置
gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('移动X轴').onChange((val) => {
  console.log(`值被修改为：${val}`)
}).onFinishChange((val) => {
  console.log(`完成修改后的值：${val}`)
})
// 修改物体颜色
const params = {
  color: '#ffff00',
  fn: () => {
    if (animatel.isActive()) {
      animatel.pause()
    }
    else {
      animatel.resume()
    }
  }
}
gui.addColor(params, "color").onChange((val) => {
  console.log(`颜色修改为：${val}`)
  cube.material.color.set(val)
})
// 物体显示
gui.add(cube, 'visible').name('是否显示')
// 设置按钮点击触发事件
gui.add(params, 'fn').name('动画暂停/恢复')
// 设置文件夹
let folder = gui.addFolder('设置物体')
folder.add(cube.material, 'wireframe')

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

// 设置动画
let animatel = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "power1.inOut",
  repeat: 1,  //重复次数（-1为一直重复）
  yoyo: true,  //往返运动
  onComplete: () => { console.log('动画结束') },
  onStart: () => { console.log('动画开始') }
})
gsap.to(cube.rotation, {
  x: 2 * Math.PI,
  duration: 5,
  repeat: -1,
  ease: "power1.inOut"
})

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