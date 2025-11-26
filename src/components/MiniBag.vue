<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const props = defineProps({
  color: String,
  title: String,
  flavor: String,
  image: String,
  font: String,
});

const container = ref(null);
let scene, camera, renderer, bagModel;
let textureCanvas, ctx, texture;

// ---------------- TEXTURE CREATION ----------------
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
  ctx.fillStyle = props.color || "#ffcc00";
  ctx.fillRect(0, 0, 1024, 1024);

const logo = new Image();
logo.src = "/logo-nobg.png";
logo.onload = () => {
    const W = textureCanvas.width;
    const H = textureCanvas.height;
    ctx.drawImage(
        logo,
        W * 0.14,   // 14% from width → nicely centered
        H * 0.05,   // 5% from top
        W * 0.20,   // 20% width
        H * 0.18    // 18% height
    );
    texture.needsUpdate = true;
};

  // TITLE
  if (props.title) {
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(props.title, 232, 300);
  }

  // FLAVORS
  if (props.flavor) {
    ctx.font = "20px Arial";
    ctx.fillText(props.flavor, 232, 400);
  }

  // IMAGE
  if (props.image) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 262, 420, 500, 500);
      texture.needsUpdate = true;
    };
    img.src = props.image;
  }

  texture.needsUpdate = true;
}

// ---------------- SCENE SETUP ----------------
onMounted(() => {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    35,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.25, 1.5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  const light = new THREE.DirectionalLight(0xffffff, 1.4);
  light.position.set(2, 2, 3);
  scene.add(light);

  // Texture
  createTexture();
  redrawTexture();

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 0.3,
    roughness: 0.55,
  });

  // LOAD MODEL (same GLB)
  const loader = new GLTFLoader();
  loader.load("/blank-bag.glb", (gltf) => {
    bagModel = gltf.scene;

    bagModel.scale.set(0.8, 0.8, 0.8);
    bagModel.position.y = 0.1;

    bagModel.traverse((child) => {
      if (child.isMesh) child.material = mat;
    });

    scene.add(bagModel);
    animate();
  });

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

// ---------------- ANIMATION ----------------
function animate() {
  requestAnimationFrame(animate);

  if (bagModel) {
    bagModel.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

// ---------------- REACTIVE UPDATES ----------------
watch(
  () => [props.color, props.title, props.flavor, props.image],
  () => redrawTexture()
);
</script>

<template>
  <div
    ref="container"
    style="width: 100%; height: 260px; margin-bottom: 15px; overflow: hidden;"
  ></div>
</template>
