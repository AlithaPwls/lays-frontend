<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

const loginUser = async () => {
  error.value = "";

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    })
  });

  const data = await res.json();

  if (!res.ok) {
    error.value = data.error || "Login failed";
    return;
  }

  // token opslaan
  localStorage.setItem("token", data.token);

  // ga naar configurator
  router.push("/configurator");
};
</script>

<template>
  <div>
    <h1>Login</h1>

    <p style="color:red" v-if="error">{{ error }}</p>

    <form @submit.prevent="loginUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <br />

      <input v-model="password" type="password" placeholder="Password" required />
      <br /><br />

      <button type="submit">Login</button>
    </form>
  </div>
</template>
