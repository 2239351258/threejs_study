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
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -2, 0)
plane.rotation.x = -Math.PI / 2;
// 接受阴影
plane.receiveShadow = true
scene.add(plane)

// 灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);  // 环境光
scene.add(light)

// 创造一个小球，将点光源附着在球上
const lightBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 100, 100),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
lightBall.position.set(-3, 3, -3)
const greenPointLight = new THREE.PointLight(0x00ff00, 3)
greenPointLight.castShadow = true
greenPointLight.shadow.radius = 20
greenPointLight.shadow.mapSize.set(2048, 2048)
lightBall.add(greenPointLight)
scene.add(lightBall)
// 设置点光源
const pointLight = new THREE.PointLight(0xff0000, 3)
// 设置光源
pointLight.position.set(3, 3, 3)
// 设置光照投射阴影
pointLight.castShadow = true
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(2048, 2048)
scene.add(pointLight)

const gui = new dat.GUI()
gui.add(pointLight.position, 'x').min(-10).max(10)
gui.add(pointLight, 'intensity').min(0).max(10).step(0.1)
// gui.add(pointLight, 'angle').min(0).max(Math.PI / 2).step(0.1)
gui.add(pointLight, 'distance').min(0).max(50).step(0.1)
// gui.add(pointLight, 'penumbra').min(0).max(1).step(0.01)
gui.add(pointLight, 'decay').min(0).max(5).step(0.01)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的影音贴图
renderer.shadowMap.enabled = true
// 是否使用物理上正确的光照模式。 默认是false
renderer.physicallyCorrectLights = true
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
// 添加光源辅助器
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)
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
  let time = clock.getElapsedTime();
  lightBall.position.set(Math.sin(time) * 3, 3 * Math.abs(Math.sin(time)), Math.cos(time) * 3)
  pointLight.position.set(-Math.sin(time) * 3, 3 * Math.abs(Math.sin(time)), -Math.cos(time) * 3)
  controls.update()
  pointLightHelper.update()
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