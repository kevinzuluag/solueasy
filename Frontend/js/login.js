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

// Validación + conexión al backend
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-box.login form');
    const registerForm = document.querySelector('.form-box.register form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            if (!email || !password) {
                alert("Completa todos los campos para iniciar sesión.");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || 'Error al iniciar sesión');
                } else {
                    alert(data.message);
                    // Aquí podrías redirigir a la pantalla de usuario
                }
            } catch (error) {
                alert('Error de conexión con el servidor.');
                console.error(error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = registerForm.querySelector('input[name="email"]').value;
            const password = registerForm.querySelector('input[name="password"]').value;
            const confirmPassword = registerForm.querySelector('input[name="confirm-password"]').value;

            if (!email || !password || !confirmPassword) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || 'Error al registrar.');
                } else {
                    alert(data.message);
                    document.querySelector('.container').classList.remove('active');
                }
            } catch (error) {
                alert('Error de conexión con el servidor.');
                console.error(error);
            }
        });
    }

    // Mostrar/ocultar contraseña
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
