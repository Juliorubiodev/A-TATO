// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');

    // Función para abrir el modal
    loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        usernameInput.focus(); // Pone el foco en el input usuario
    });

    // Función para cerrar el modal
    const hideModal = () => {
        loginModal.classList.add('hidden');
        errorMsg.classList.add('hidden'); // Limpia mensajes de error
        loginForm.reset(); // Limpia el formulario
    };

    closeModal.addEventListener('click', hideModal);

    // Cerrar modal si se hace click fuera del cuadro blanco
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideModal();
        }
    });

    // Lógica del Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();

        // Validación simple hardcoded
        // Validación simple hardcoded
        if (user === 'admin' && pass === 'admin') {
            // Éxito
            localStorage.setItem('isLoggedIn', 'true'); // Guardamos sesión
            window.location.href = 'admin.html';
        } else {
            // Error
            errorMsg.classList.remove('hidden');
            // Efecto de vibración simple en el input de contraseña
            passwordInput.classList.add('border-red-500');
            setTimeout(() => {
                passwordInput.classList.remove('border-red-500');
            }, 2000);
        }
    });
});