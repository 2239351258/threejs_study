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

// 灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);  // 环境光
scene.add(light)
// 平行光(太阳光)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// 设置光源
directionalLight.position.set(0, 10, 0)
scene.add(directionalLight)
// 导入纹理
const textureLoader = new THREE.TextureLoader()
const doorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAplhaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAoTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
// 置换贴图
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
// 粗糙度贴图
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
// 金属贴图
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
// 法线贴图
const normalTexture = textureLoader.load('./textures/door/normal.jpg')
// 设置纹理属性
// 偏移
// Texture.offset.x = 0.5
// Texture.offset.y = 0.5
// Texture.offset.z = 0.5
// Texture.offset.set(0.5, 0.5, 0.5)
// 设置旋转原点(中心)
// Texture.center.set(0.5, 0.5)
// 顺旋转（默认以左下角为原点）
// Texture.rotation = Math.PI / 2
// 纹理重复
// Texture.repeat.set(2, 2)
// 纹理重复模式
// Texture.wrapS = THREE.MirroredRepeatWrapping;   //镜像
// Texture.wrapT = THREE.RepeatWrapping;

// 纹理显示设置
// minFilter->一个纹素覆盖大于一个像素时（图大于物体），贴图的采样方式
// magFilter->一个纹素覆盖小于一个像素时（物体大于图），贴图的采样方式
// csdnTexture.minFilter = THREE.NearestFilter
// csdnTexture.magFilter = THREE.NearestFilter
// csdnTexture.minFilter = THREE.LinearFilter
// csdnTexture.magFilter = THREE.LinearFilter


// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3, 100, 100, 100);
// 创建材质
const Material = new THREE.MeshStandardMaterial({
  // 添加纹理
  map: doorTexture,
  // 灰度纹理用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
  alphaMap: doorAplhaTexture,
  // 环境贴图
  aoMap: doorAoTexture,
  // 环境贴图暗度
  aoMapIntensity: 1,
  // 置换贴图
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  // 粗糙度贴图
  roughnessMap: roughnessTexture,
  roughness: 1,
  // 金属度贴图
  metalnessMap: metalnessTexture,
  metalness: 1,
  // 法线贴图
  normalMap: normalTexture,
  // 两面都渲染，默认渲染前面
  side: THREE.DoubleSide,
  //材质是否透明
  // transparent: true
})
// 连接几何体和材质
const cube = new THREE.Mesh(cubeGeometry, Material)

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const plane = new THREE.Mesh(planeGeometry, Material)
plane.position.set(0, 0, 4)
scene.add(plane)
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))
// 添加物体
scene.add(cube)
cube.rotation.x = Math.PI / 4
cube.rotation.y = Math.PI / 4
cube.rotation.z = Math.PI / 4
const animatel = gsap.to(cube.rotation, {
  y: 2 * Math.PI,
  duration: 5,
  repeat: -1,
  ease: "power1.inOut"
})
const params = {
  fn: () => {
    if (animatel.isActive()) {
      animatel.pause()
    }
    else {
      animatel.resume()
    }
  }
}
const gui = new dat.GUI();
// 设置文件夹
let folder = gui.addFolder('设置物体')
folder.add(params, 'fn').name('动画暂停/恢复')
folder.add(cube.rotation, 'x').min(0).max(2 * Math.PI).step(0.01)
folder.add(cube.rotation, 'y').min(0).max(2 * Math.PI).step(0.01)
folder.add(cube.rotation, 'z').min(0).max(2 * Math.PI).step(0.01)

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