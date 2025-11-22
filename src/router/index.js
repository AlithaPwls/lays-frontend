import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import ConfiguratorView from "../views/ConfiguratorView.vue";
import AllDesignsView from "../views/AllDesignsView.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/register", name: "register", component: RegisterView },
    { path: "/login", name: "login", component: LoginView },
    { path: "/configurator", name: "configurator", component: ConfiguratorView },
    { path: "/designs", name: "alldesigns", component: AllDesignsView },
    

    // leeg — configurator komt later
    {
      path: "/configurator",
      component: { template: "<div>Configurator komt hier</div>" }
    }
  ]
});

export default router;


