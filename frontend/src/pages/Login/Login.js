import './Login.css'
import { loginUser, registerUser } from '../../services/authApi.js';
 
export function Login() {
    return `
    <div class="container-center">
 
        <div class="container" id="container">
 
            <div class="form-container sign-up-container">
                <form id="form-register" novalidate>
                    <h1>Crear Cuenta</h1>
 
                    <div class="social-container">
                        <a href="#" class="social" aria-label="Registrarse con Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social" aria-label="Registrarse con Google">
                            <i class="fab fa-google"></i>
                        </a>
                    </div>
 
                    <span class="small-info">o usa tu correo para registrarte</span>
 
                    <input id="name"            type="text"     placeholder="Nombre completo"       autocomplete="name"             required />
                    <input id="email"           type="email"    placeholder="Correo Electrónico"    autocomplete="email"            required />
                    <input id="number"          type="tel"      placeholder="Celular"               autocomplete="tel"              required />
                    <input id="password"        type="password" placeholder="Contraseña"            autocomplete="new-password"     required />
                    <input id="confirmPassword" type="password" placeholder="Confirmar Contraseña"  autocomplete="new-password"     required />
 
                    <button id="register" type="submit" class="btn-primary">
                        Registrarse
                    </button>
                </form>
            </div>
 
            <div class="form-container sign-in-container">
                <form id="form-login" novalidate>
                    <h1>Iniciar Sesión</h1>
 
                    <div class="social-container">
                        <a href="#" class="social" aria-label="Iniciar sesión con Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social" aria-label="Iniciar sesión con Google">
                            <i class="fab fa-google"></i>
                        </a>
                    </div>
 
                    <span class="small-info">usa tu cuenta</span>
 
                    <input id="email-login"    type="email"    placeholder="Correo Electrónico" autocomplete="email"            required />
                    <input id="password-login" type="password" placeholder="Contraseña"         autocomplete="current-password" required />
 
                    <a href="#" class="forgot">¿Olvidaste tu contraseña?</a>
 
                    <button type="submit" class="btn-primary">Entrar</button>
                </form>
            </div>
 
            <div class="overlay-container">
                <div class="overlay">
 
                    <div class="overlay-panel overlay-left">
                        <h1>¡Bienvenido!</h1>
                        <p>Para seguir descubriendo ofertas en Medellín, inicia sesión con tus datos.</p>
                        <br>
                        <p>Te mantendremos al tanto de las ofertas y de tus productos favoritos en descuento, por medio de tu número celular 📲</p>
                        <br>
                        <button class="btn-outline-white" id="signIn">Ya tengo cuenta</button>
                    </div>
 
                    <div class="overlay-panel overlay-right">
                        <h1>¿Nuevo aquí?</h1>
                        <p>Regístrate y empieza a usar nuestro bot Scrapy para encontrar los mejores precios.</p>
                        <br>
                        <button class="btn-outline-white" id="signUp">Crear cuenta</button>
                    </div>
 
                </div>
            </div>
 
        </div>
    </div>`;
}
 

export function overlayEvents() {
    const container = document.getElementById("container");
    const signUpBtn = document.getElementById("signUp");
    const signInBtn = document.getElementById("signIn");
 
    if (!container || !signUpBtn || !signInBtn) return;
 
    signUpBtn.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });
 
    signInBtn.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });
}

export function loginEvents() {
    const email    = document.getElementById("email-login");
    const password = document.getElementById("password-login");
    const form     = document.getElementById("form-login");
 
    if (!email || !password || !form) return;
 
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
 
        if (!email.value || !password.value) {
            alert("Por favor completa todos los campos.");
            return;
        }
 
        try {
            const data = await loginUser(email.value, password.value);
 
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.token) localStorage.setItem("token", data.token);
 
            console.log("Bienvenido:", data.user.username);
            navigateTo("/home");
 
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert(error.message || "Error de conexión. Intenta de nuevo.");
        }
    });
}
 

let user = {
    username : "",
    email : "",
    phone: "",
    password  : ""
};
 
export function record() {
    const nameUser        = document.getElementById("name");
    const email           = document.getElementById("email");
    const password        = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const number          = document.getElementById("number");
    const form            = document.getElementById("form-register");
 
    if (!nameUser || !email || !password || !confirmPassword || !number || !form) return;
 
    nameUser.addEventListener("input", (e) => { user.username    = e.target.value; });
    email.addEventListener("input",    (e) => { user.email    = e.target.value; });
    password.addEventListener("input", (e) => { user.password = e.target.value; });
    number.addEventListener("input",   (e) => { user.phone   = e.target.value; });
 
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("¡El formulario intentó enviarse!", user);

 
        const passwordEl = document.getElementById("password");
        const confirmPasswordEl = document.getElementById("confirmPassword");
        if (passwordEl.value !== confirmPasswordEl.value) {
            alert("Las contraseñas no coinciden.");
            return;
        }
 
        if (!user.username || !user.email || !user.password || !user.phone) {
            alert("Por favor completa todos los campos.");
            return;
        }
 
        try {
            const data = await registerUser(user.username, user.email, user.phone, user.password);
            console.log(data.message);
 
            form.reset();
            user = { username: "", email: "", password: "", phone: "" };
 
            
            document.getElementById("container").classList.remove("right-panel-active");
 
        } catch (error) {
            console.error("Error al enviar:", error);
            alert(error.message || "Error de conexión. Intenta de nuevo.");
        }
    });
}
