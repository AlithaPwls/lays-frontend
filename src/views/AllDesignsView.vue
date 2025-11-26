<script setup>
import { ref, onMounted } from "vue";

const designs = ref([]);
const loading = ref(true);
const error = ref("");

const fetchDesigns = async () => {
  try {
    const res = await fetch("http://localhost:3000/designs");
    const data = await res.json();

    if (!res.ok) {
      error.value = data.error || "Kon designs niet ophalen.";
      return;
    }

    designs.value = data;
  } catch (err) {
    error.value = "Fout met server: " + err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDesigns();
});
</script>

<template>
  <div style="padding: 30px; color: white;">

    <h1>Alle Designs</h1>

    <p v-if="loading">Designs laden...</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <div class="grid">
      <div class="card" v-for="d in designs" :key="d._id">

        <div 
          class="preview"
          :style="{
            backgroundColor: d.backgroundColor,
            backgroundImage: d.smallImageUrl ? `url(${d.smallImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        >
          <div class="overlay"></div>

          <p class="title" :style="{ fontFamily: d.titleFont }">
            {{ d.title }}
          </p>

          <p class="flavors">
            {{ d.flavors.join(', ') }}
          </p>
        </div>


        <p><strong>Gemaakt door user:</strong> {{ d.userId }}</p>
        <p><strong>Aangemaakt op:</strong> {{ new Date(d.createdAt).toLocaleString() }}</p>

      </div>
    </div>

  </div>
</template>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 20px;
}

.card {
  background: #222;
  padding: 15px;
  border-radius: 12px;
  width: 260px;
  color: white;
}

.preview {
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  padding: 15px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.preview .overlay {
  position: absolute;
  inset: 0;
  background-image: url('/bag-shape.png'); /* SVG of PNG van zakvorm */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  opacity: 0.9;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 5px black;
  z-index: 3;
}

.flavors {
  font-size: 14px;
  color: white;
  text-shadow: 0 0 4px black;
  z-index: 3;
}

</style>


