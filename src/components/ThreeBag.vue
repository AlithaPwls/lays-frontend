<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const props = defineProps({
  color: { type: String, default: "#ffcc00" }, // zak-kleur
  title: { type: String, default: "" }, // titel op zak
  flavor: { type: String, default: "" }, // smaken
  image: { type: String, default: null }, // afbeelding op zak
  background: { type: String, default: "#ffffff" }, // canvas achtergrond
});

const container = ref(null);
let scene, camera, renderer, controls, bagModel;
let textureCanvas, ctx, texture;

// -------------------------------------------------------
// DYNAMIC TEXTURE
// -------------------------------------------------------
function createTexture() {
  textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 1024;
  ctx = textureCanvas.getContext("2d");

  texture = new THREE.CanvasTexture(textureCanvas);
  texture.flipY = true;
  return texture;
}



function redrawTexture() {
  // Zak achtergrondkleur
  ctx.fillStyle = props.color;
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  // ——————————————
  // TITEL (kleiner + mooi gecentreerd)
  // ——————————————
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (props.title) {
    ctx.font = "bold 60px Arial";   // kleinere titel
    ctx.fillText(props.title, 250, 100); // perfect op de bovenbuik
  }

  // ——————————————
  // SMAAK
  // ——————————————
  if (props.flavor) {
    ctx.font = "20px Arial"; // kleiner
    ctx.fillText(props.flavor, 250, 360);
  }

  // ——————————————
  // AFBEELDING
  // ——————————————
  if (props.image) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // nodig voor externe afbeeldingen

    img.onload = () => {
      ctx.drawImage(
        img,
        262,
        420,
        500,
        500
      );
      texture.needsUpdate = true;
    };

    img.src = props.image;
  }

  texture.needsUpdate = true;
}


// -------------------------------------------------------
// SCENE INITIALISATIE
// -------------------------------------------------------
onMounted(() => {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(props.background);

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.3, 1.8);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
  light1.position.set(2, 2, 3);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
  light2.position.set(-2, 1, 1);
  scene.add(light2);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1.3;
  controls.maxDistance = 3;
  controls.enablePan = false;

  // Texture
  createTexture();
  redrawTexture();

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 0.3,
    roughness: 0.55,
  });

  // -------------------------------------------------------
  // LOAD GLB MODEL
  // -------------------------------------------------------
  const loader = new GLTFLoader();
  loader.load("/blank-bag.glb", (gltf) => {
    bagModel = gltf.scene;

    bagModel.scale.set(1.3, 1.3, 1.3);
    bagModel.position.y = -0.25;

    bagModel.traverse((child) => {
      if (child.isMesh) {
        child.material = mat;
      }
    });

    scene.add(bagModel);
    animate();
  });

  // Resize fix
  window.addEventListener("resize", () => {
    camera.aspect =
      container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      container.value.clientWidth,
      container.value.clientHeight
    );
  });
});

// -------------------------------------------------------
// ANIMATIE
// -------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  if (bagModel) {
    bagModel.rotation.y += 0.002;
  }

  controls.update();
  renderer.render(scene, camera);
}

// -------------------------------------------------------
// REACTIEVE UPDATES
// -------------------------------------------------------
watch(
  () => [props.color, props.title, props.flavor, props.image],
  () => redrawTexture(),
  { deep: true }
);

watch(
  () => props.background,
  (bg) => {
    scene.background = new THREE.Color(bg);
  }
);
</script>

<template>
  <div
    ref="container"
    style="width: 100%; height: 500px; border-radius: 12px; overflow: hidden"
  ></div>
</template>
