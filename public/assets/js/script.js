// **Escuchadores de eventos (Event Listeners)**
// Estos escuchadores permiten que cuando se haga clic en los botones de "Iniciar sesión" o "Registrarse",
// se ejecuten las funciones correspondientes (iniciarSesion() y register()), respectivamente.

document.getElementById('btn__iniciar-sesion').addEventListener('click', iniciarSesion);
document.getElementById('btn__registrarse').addEventListener('click', register);
// Escucha cuando se cambia el tamaño de la ventana y ejecuta la función 'anchoPagina' para ajustar el diseño.
window.addEventListener('resize', anchoPagina);

// **Declaración de variables**
// Estas variables almacenan las referencias a los elementos del DOM que se van a manipular.
let contenedor_login_register = document.querySelector('.contenedor__login-register'); // El contenedor principal de login y registro.
let formulario_login = document.querySelector('.formulario__login'); // El formulario de login.
let formulario_register = document.querySelector('.formulario__register'); // El formulario de registro.
let caja_trasera_login = document.querySelector('.caja__trasera-login'); // La caja de fondo para la sección de login.
let caja_trasera_register = document.querySelector('.caja__trasera-register'); // La caja de fondo para la sección de registro.


// **Función que ajusta el diseño al tamaño de la ventana**
function anchoPagina(){
    // Si el ancho de la ventana es mayor a 850px, ambos fondos (login y registro) se muestran.
    if(window.innerWidth > 850){
        caja_trasera_login.style.display = 'block'; // Muestra el fondo de login
        caja_trasera_register.style.display = 'block'; // Muestra el fondo de registro
    } else {
        // Si la ventana es más pequeña que 850px, ajusta la visibilidad y posición de los formularios y fondos
        caja_trasera_register.style.display = 'block'; // Muestra el fondo de registro
        caja_trasera_register.style.opacity = '1'; // Establece la opacidad del fondo de registro a visible
        caja_trasera_login.style.display = 'none'; // Oculta el fondo de login
        formulario_login.style.display = 'block'; // Muestra el formulario de login
        formulario_register.style.display = 'none'; // Oculta el formulario de registro
        contenedor_login_register.style.left = '0px'; // Mueve el contenedor a la izquierda
    }
}

// **Función para mostrar el formulario de "Iniciar sesión"**
function iniciarSesion(){
    // Si el ancho de la ventana es mayor a 850px, ajusta las posiciones y visibilidades
    if(window.innerWidth > 850){
        formulario_register.style.display = 'none'; // Oculta el formulario de registro
        contenedor_login_register.style.left = '10px'; // Mueve el contenedor hacia la derecha
        formulario_login.style.display = 'block'; // Muestra el formulario de login
        caja_trasera_register.style.opacity = '1'; // Establece la opacidad del fondo de registro a visible
        caja_trasera_login.style.opacity = '0'; // Establece la opacidad del fondo de login a invisible
    } else {
        // Si la ventana es más pequeña que 850px, ajusta la visibilidad y el contenedor
        formulario_register.style.display = 'none'; // Oculta el formulario de registro
        contenedor_login_register.style.left = '0px'; // Mueve el contenedor a la izquierda
        formulario_login.style.display = 'block'; // Muestra el formulario de login
        caja_trasera_register.style.display = 'block'; // Muestra el fondo de registro
        caja_trasera_login.style.display = 'none'; // Oculta el fondo de login
    }
}

// **Función para mostrar el formulario de "Registro"**
function register(){
    // Si el ancho de la ventana es mayor a 850px, ajusta las posiciones y visibilidades
    if(window.innerWidth > 850){
        formulario_register.style.display = 'block'; // Muestra el formulario de registro
        contenedor_login_register.style.left = '410px'; // Mueve el contenedor hacia la derecha
        formulario_login.style.display = 'none'; // Oculta el formulario de login
        caja_trasera_register.style.opacity = '0'; // Establece la opacidad del fondo de registro a invisible
        caja_trasera_login.style.opacity = '1'; // Establece la opacidad del fondo de login a visible
    } else {
        // Si la ventana es más pequeña que 850px, ajusta la visibilidad y el contenedor
        formulario_register.style.display = 'block'; // Muestra el formulario de registro
        contenedor_login_register.style.left = '0px'; // Mueve el contenedor a la izquierda
        formulario_login.style.display = 'none'; // Oculta el formulario de login
        caja_trasera_register.style.display = 'none'; // Oculta el fondo de registro
        caja_trasera_login.style.display = 'block'; // Muestra el fondo de login
        caja_trasera_login.style.opacity = '1'; // Establece la opacidad del fondo de login a visible
    }
}

// **Ejecuta la función al cargar la página para verificar el tamaño de la ventana**
anchoPagina();
