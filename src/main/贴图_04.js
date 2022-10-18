import * as THREE from 'three';
// 导入轨迹控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 加载hdr环境图
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./textures/hdr/002.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture
  scene.environment = texture
})

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

const sphereGeometry = new THREE.SphereGeometry(2, 100, 100);
const material = new THREE.MeshStandardMaterial({
  // 金属材质
  metalness: 1,
  // 光滑度
  roughness: 0.1,
  // 环境贴图
  // envMap: evnMapTexture
});
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// // 给场景添加背景
// scene.background = evnMapTexture
// // 给场景所有的物体添加默认的环境贴图
// scene.environment = evnMapTexture

// 灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);  // 环境光
scene.add(light)

// 平行光(太阳光)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// 设置光源
directionalLight.position.set(0, 10, 0)
scene.add(directionalLight)
// 单张纹理图的加载
const event = {
  onLoad() {
    console.log('图片加载完成')
  },
  onProgress(url, loaded, total) {
    /*
      url:加载图片的url,
      loaded:当前加载第几张
      total:总共有多少张
    */
    console.log(url)
    console.log(loaded + '/' + total)
  },
  onError(err) {
    console.log('图片加载错误', err)
  }
}
// 设置加载管理器
const loadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
);

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