<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

const registerUser = async () => {
  error.value = "";

  const res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })
  });

  const data = await res.json();

  if (!res.ok) {
    error.value = data.error || "Registration failed";
    return;
  }

  // redirect naar login
  router.push("/login");
};
</script>

<template>
  <div>
    <h1>Register</h1>

    <p style="color:red" v-if="error">{{ error }}</p>

    <form @submit.prevent="registerUser">
      <input v-model="firstName" type="text" placeholder="First Name" required />
      <br />

      <input v-model="lastName" type="text" placeholder="Last Name" required />
      <br />

      <input v-model="email" type="email" placeholder="Email" required />
      <br />

      <input v-model="password" type="password" placeholder="Password" required />
      <br /><br />

      <button type="submit">Register</button>
    </form>
  </div>
</template>
