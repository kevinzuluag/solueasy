const container = document.querySelector('.container');
const registerButton = document.querySelector('.register-button');
const loginButton = document.querySelector('.login-button');

// Alternar entre login y registro
registerButton.addEventListener('click', () => {
    container.classList.add('active');
});
loginButton.addEventListener('click', () => {
    container.classList.remove('active');
});

// Validación de formularios
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-box.login form');
    const registerForm = document.querySelector('.form-box.register form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = loginForm.querySelector('input[name="email"]');
            const password = loginForm.querySelector('input[name="password"]');

            if (!email.value || !password.value) {
                alert("Completa todos los campos para iniciar sesión.");
                return;
            }

            if (!email.value.includes('@')) {
                alert("Correo inválido.");
                return;
            }

            alert("Inicio de sesión exitoso (modo demo).");
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = registerForm.querySelector('input[name="email"]');
            const password = registerForm.querySelector('input[name="password"]');
            const confirmPassword = registerForm.querySelector('input[name="confirm-password"]');

            if (!email.value || !password.value || !confirmPassword.value) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            if (!email.value.includes('@')) {
                alert("Correo inválido.");
                return;
            }

            if (password.value !== confirmPassword.value) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            alert("¡Registro exitoso! (modo demo)");
            container.classList.remove('active'); // Volver al login
        });
    }

    // Mostrar / ocultar contraseña (después de cargar el DOM)
    const passwordToggles = document.querySelectorAll('.toggle-password');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                toggle.classList.remove('bx-show');
                toggle.classList.add('bx-hide');
            } else {
                input.type = 'password';
                toggle.classList.remove('bx-hide');
                toggle.classList.add('bx-show');
            }
        });
    });
});

// Función para simular login social
function socialLogin(platform) {
    alert(`Simulando inicio de sesión con ${platform}.`);
}
