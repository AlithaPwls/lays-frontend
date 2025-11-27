
<template>
      <router-link to="/designs" class="nav-link">See all designs</router-link>

  <div class="page">

  
    <!-- LINKERKANT – 3D PREVIEW -->
    <div class="left">
      <h1>Ontwerp je Lays Zak</h1>
      <ThreeBag 
        :color="selectedColor"
        :title="bagName"
        :flavor="selectedFlavors.join(', ')"   
        :image="bagImage"
        :font="selectedFont"
      />

    </div>

    <!-- RECHTERKANT – OPTIES -->
    <div class="right">

      <!-- KLEUREN -->
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


      <!-- NAAM OP ZAK -->
      <div class="options">
        <h3>Naam op zak</h3>
        <input
          v-model="bagName"
          placeholder="Typ je zak naam..."
          class="text-input"
        />
      </div>

      
      <!-- SMAKEN -->
      <div class="options">
        <h3>Kies smaken</h3>

        <div class="flavors">
          <label v-for="f in flavorOptions" :key="f">
            <input type="checkbox" :value="f" v-model="selectedFlavors" />
            {{ f }}
          </label>
        </div>
      </div>



      <!-- FONT -->
      <div class="options">
        <h3>Font</h3>
        <select v-model="selectedFont" class="text-input">
          <option v-for="f in fontOptions" :key="f">{{ f }}</option>
        </select>
      </div>

      <!-- ZAK ACHTERGROND -->
      <div class="options">
        <h3>Kies zak achtergrond</h3>

        <div class="bag-images">
          <img
            v-for="img in bagImages"
            :key="img"
            :src="img"
            class="bag-option"
            @click="bagImage = img"
          />
        </div>
      </div>

      <!-- OPSLAAN -->
      <button class="save-btn" @click="saveDesign">
        Design Opslaan
      </button>

      <!-- RESET -->
      <button class="reset-btn" @click="resetDesign">
        Reset
      </button>

    </div>

  </div>
</template>

  
<script>
import ThreeBag from "../components/ThreeBag.vue";

export default {
  components: {
    ThreeBag
  },

  data() {
    return {
      selectedColor: "yellow",
      colorOptions: ["yellow", "red", "green", "blue", "purple", "orange"],

      flavorOptions: ["Paprika", "Cheese", "Salt", "Bolognese", "Pickles"],
      selectedFlavors: [],

      bagName: "",
      fontOptions: ["Arial", "Comic Sans", "Courier", "Times New Roman"],
      selectedFont: "Arial",

      bagImage: "",
      bagImages: [
        "https://media.istockphoto.com/id/1389947415/vector/retro-sunburst-background-with-striped-sun-rays-vector-illustration.jpg?s=612x612&w=0&k=20&c=j97uZfeHBe-o6MB132Eja02p7kC3-ymUJvzJjQOQlMo=",
        "https://i.pinimg.com/1200x/e1/c6/04/e1c6048de0067024fc6a72e160edd3b1.jpg",
        "https://png.pngtree.com/thumb_back/fh260/background/20250704/pngtree-girly-pink-elegant-background-image_17459275.webp"
      ]
    };
  },

  methods: {
    async saveDesign() {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Je bent niet ingelogd!");
        return;
      }

      const payload = {
        backgroundColor: this.selectedColor,
        bagColor: this.selectedColor,
        title: this.bagName,
        titleFont: this.selectedFont,
        flavors: this.selectedFlavors,
        smallImageUrl: this.bagImage
      };

      try {
        const res = await fetch("http://localhost:3000/designs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          alert("Fout: " + data.error);
          return;
        }

        alert("Design opgeslagen!");
        console.log("OPGESLAGEN:", data);

      } catch (err) {
        console.error("API error:", err);
        alert("Fout bij opslaan!");
      }
    },

    resetDesign() {
      if (!confirm("Weet je zeker dat je alles wil resetten?")) return;

      this.selectedColor = "yellow";
      this.selectedFlavors = [];
      this.bagName = "";
      this.selectedFont = "Arial";
      this.bagImage = "";
    }
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
  
  /* LEFT – PREVIEW */
  .left {
    flex: 2;
    width: 600px;
    padding: 40px;
    background-image: url('{{ bagImage }}');
  }

  
  
  .bag-preview {
    width: 320px;
    height: 450px;
    border-radius: 20px;
    margin-top: 30px;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    padding: 20px;
    background-color: var(--bag-background-color, #fff); /* Default background color */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
  }

  .bag-title {
    font-size: 28px;
    font-weight: bold;
    color: var(--bag-title-color, #000); /* Default title color */
  }

  .bag-flavors {
    font-size: 16px;
    color: var(--bag-flavors-color, #333); /* Default flavors color */
  }
  
  /* RIGHT – OPTIONS */
  .right {
    flex: 1;
    padding: 40px;
    border-left: 1px solid #333;
  }
  
  /* Colors */
  .colors {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
  }
  
  .color-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid white;
    transition: 0.2s;
  }
  .color-circle:hover {
    transform: scale(1.1);
  }
  
  /* Options blocks */
  .options {
    margin-bottom: 30px;
  }
  
  .flavors {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .text-input {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: none;
    margin-top: 5px;
  }
  
  /* Bag images */
  .bag-images {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }
  
  .bag-option {
    width: 80px;
    height: 120px;
    object-fit: cover;
    border: 2px solid white;
    cursor: pointer;
    transition: 0.2s;
  }
  .bag-option:hover {
    transform: scale(1.1);
  }
  
  /* Save button */
  .save-btn {
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    border: none;
    background: #ffcc00;
    color: #111;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
  }
  .save-btn:hover {
    background: #ffd633;
  }

  .reset-btn {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  background: #444;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}

.reset-btn:hover {
  background: #666;
}
  </style>
  