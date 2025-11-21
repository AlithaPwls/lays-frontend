<template>
  <div class="page">

    <!-- Rechterkolom met kleuren -->
    <div class="right">
      <h3>Kies een kleur</h3>

      <div class="colors">
        <div
          v-for="c in colorOptions"
          :key="c"
          class="color-circle"
          :style="{ backgroundColor: c }"
          @click="selectedColor = c"
        ></div>
      </div>
    </div>

    <div class="options">
  <h3>Kies smaken</h3>

  <div class="flavors">
    <label v-for="f in flavorOptions" :key="f">
      <input 
        type="checkbox" 
        :value="f"
        v-model="selectedFlavors"
      />
      {{ f }}
    </label>
  </div>
</div>


    <!-- Linker preview van de zak -->
    <div class="left">
      <h1>Ontwerp je Lays Zak</h1>

      <div class="bag-preview" :style="{ backgroundColor: selectedColor }">
        <p class="bag-label">Zak kleur: {{ selectedColor }}</p>
      </div>
    </div>
  
  </div>

  <p class="bag-label">
  Smaken: {{ selectedFlavors.join(", ") || "geen" }}
</p>

</template>

<script>
export default {
  data() {
    return {
      selectedColor: "yellow",
      colorOptions: ["yellow", "red", "green", "blue", "purple", "orange"],
      flavorOptions: ["Paprika", "Cheese", "Salt", "Bolognese", "Pickles"],
      selectedFlavors: [],

    };
  }
};
</script>

<style>
.page {
  display: flex;
  height: 100vh;
  background: #111;
  color: white;
  font-family: Arial;
}

/* LEFT side */
.left {
  flex: 2;
  padding: 40px;
}

.bag-preview {
  width: 300px;
  height: 420px;
  border-radius: 20px;
  margin-top: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  box-shadow: 0 0 20px rgba(255,255,255,0.1);
}

.bag-label {
  font-size: 20px;
}

/* RIGHT side (color picker) */
.right {
  flex: 1;
  padding: 40px;
  border-left: 1px solid #333;
}

.colors {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid white;
  transition: transform 0.2s;
}

.color-circle:hover {
  transform: scale(1.15);
}

.options {
  margin-top: 40px;
  color: white;
}

.flavors {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flavors label {
  font-size: 18px;
  cursor: pointer;
}

input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

</style>
