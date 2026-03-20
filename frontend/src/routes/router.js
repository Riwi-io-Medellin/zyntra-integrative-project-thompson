import { Home } from "../pages/Home/Home.js";
import { Login, loginEvents, overlayEvents, record } from "../pages/Login/Login.js";
import { Stores, initStores } from "../pages/Stores/Stores.js";

export const routes = {
  "/home"         : Home,
  "/login"        : Login,
  "/searchProduct": Stores
};

const protectedRoutes = [];

document.body.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href"));
  }
});

function navigate(route) {
  window.history.pushState({}, "", route);
  router();
}

window.navigateTo = navigate;

export function router() {
  const path = window.location.pathname;
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  console.log("Router debug - User:", user); // Debug

  // Ruta protegida sin sesión → redirigir al login
  if (protectedRoutes.includes(path) && !user) {
    window.history.replaceState({}, "", "/login");
    document.getElementById("app").innerHTML = Login();
    updateNavbar();
    loginEvents();
    overlayEvents();
    record();
    return;
  }

  const view = routes[path] || routes["/home"];
  document.getElementById("app").innerHTML = view();

  updateNavbar();

  if (path === "/login") {
    loginEvents();
    overlayEvents();
    record();
  }

  if (path === "/searchProduct") {
    initStores();
  }
}

function updateNavbar() {
  console.log("updateNavbar debug - localStorage user:", localStorage.getItem("user")); // Debug
  const btn = document.getElementById("nav-login-btn");
  if (!btn) return;

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  console.log("updateNavbar debug - parsed user:", user); // Debug

  if (user && user.username) {
    const inicial = user.username.charAt(0).toUpperCase();
    btn.outerHTML = `
      <div class="nav-user" id="nav-login-btn">
        <div class="nav-chip">
          <div class="nav-avatar">${inicial}</div>
          <span class="nav-username">${user.username}</span>
        </div>
        <button class="nav-logout" id="logout-btn">Salir</button>
      </div>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user");
      navigate("/login");
    });
  } else {
    btn.outerHTML = `
      <a href="/login" class="nav-login" id="nav-login-btn" data-link>Login</a>
    `;
  }
}



window.addEventListener("popstate", router);
router();