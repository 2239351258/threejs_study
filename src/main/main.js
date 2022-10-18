import * as THREE from 'three';
// 导入水面
import { Water } from 'three/examples/jsm/objects/Water2'
// 导入gltf载入库
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入轨迹控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
// 设置相机位置
camera.position.set(-50, 50, 100);
// 添加相机
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
  // 对数深度缓冲区
  logarithmicDepthBuffer: true
});
renderer.outputEncoding = THREE.sRGBEncoding
// 设置渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
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

// 创建一个巨大的天空球
const texture = new THREE.TextureLoader().load('./textures/sky.jpg')
const skyGeometry = new THREE.SphereGeometry(1000, 100, 100);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: texture
});
skyGeometry.scale(1, 1, -1)
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// 视频纹理
const video = document.createElement('video');
video.src = './textures/sky.mp4';
video.loop = true;

// 载入环境纹理hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync('./assets/050.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(-100, 100, 10);
scene.add(light);

// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 64);
const water = new Water(waterGeometry, {
  textureHeight: 1024,
  textureWidth: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1,
});
// 旋转水面至水平
water.rotation.x = -Math.PI / 2
scene.add(water)

// 添加小岛模型
// 实例化gltf载入库
const loader = new GLTFLoader();
// 实例化draco载入库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath('./draco/');
loader.setDRACOLoader(dracoLoader);

loader.load('./model/island2.glb', (glft) => {
  const island = glft.scene;
  island.position.y = -3;
  scene.add(island);
})






























// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

function render() {
  // 控制器跟新
  controls.update()
  // 渲染场景
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();
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
  if (video.paused) {
    video.play();
    skyMaterial.map = new THREE.VideoTexture(video);
    skyMaterial.map.needsUpdate = true
  }
})
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