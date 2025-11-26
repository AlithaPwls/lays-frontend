<script setup>
import { ref, onMounted } from "vue";
import MiniBag from "../components/MiniBag.vue";

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

        <!-- ⭐ 3D MINI BAG PREVIEW -->
        <MiniBag
          :color="d.backgroundColor"
          :title="d.title"
          :flavor="d.flavors.join(', ')"
          :image="d.smallImageUrl"
          :font="d.titleFont"
        />

        <p><strong>Gemaakt door:</strong> {{ d.firstName }} {{ d.lastName }}</p>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card p {
  margin-top: 10px;
}
</style>
