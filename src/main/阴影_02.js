import * as THREE from 'three';
// 导入轨迹控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'
// 灯光与阴影
// 1.材质要满足能够对光照有反应
// 2.设置渲染器开启阴影计算 renderer.shadowMap.enabled = true
// 3.设置光照投射阴影 directionalLight.castShadow = true
// 4.设置物体投射阴影 sphere.castShadow = true
// 5.设置物体接受阴影 plane.receiveShadow = true

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);

// 添加相机
scene.add(camera);

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader()
const evnMapTexture = cubeTextureLoader.load([
  './textures/environmentMaps/1/px.jpg',
  './textures/environmentMaps/1/nx.jpg',
  './textures/environmentMaps/1/py.jpg',
  './textures/environmentMaps/1/ny.jpg',
  './textures/environmentMaps/1/pz.jpg',
  './textures/environmentMaps/1/nz.jpg',
])
// 创建球
const sphereGeometry = new THREE.SphereGeometry(2, 100, 100);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true
scene.add(sphere);

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -2, 0)
plane.rotation.x = -Math.PI / 2;
// 接受阴影
plane.receiveShadow = true
scene.add(plane)

// 灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);  // 环境光
scene.add(light)

// 平行光(太阳光)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// 设置光源
directionalLight.position.set(5, 5, 5)
// 设置光照投射阴影
directionalLight.castShadow = true
// 设置阴影贴图模糊度
directionalLight.shadow.radius = 20
// 设置阴影贴图的分辨率
directionalLight.shadow.mapSize.set(2048, 2048)

// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = 5
directionalLight.shadow.camera.right = -5

scene.add(directionalLight)
const gui = new dat.GUI();
gui.add(directionalLight.shadow.camera, 'near').min(-10).max(10).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'far').min(-10).max(100).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'top').min(-10).max(10).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'bottom').min(-10).max(10).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'left').min(-10).max(10).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'right').min(-10).max(10).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix()
})

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的影音贴图
renderer.shadowMap.enabled = true

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
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)
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