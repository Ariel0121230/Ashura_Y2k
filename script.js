// ==========================================
// CONTROL DE MÚSICA DE FONDO
// ==========================================
const musicaFondo = document.getElementById('musica-fondo');
const btnMusica = document.getElementById('btn-musica');
const iconoMusica = document.getElementById('icono-musica');

if (musicaFondo) {
  musicaFondo.volume = 0.35;
}

function actualizarBotonMusica(sonando) {
  if (!btnMusica || !iconoMusica) return;
  if (sonando) {
    btnMusica.classList.add('sonando');
    iconoMusica.classList.remove('fa-volume-xmark');
    iconoMusica.classList.add('fa-music');
  } else {
    btnMusica.classList.remove('sonando');
    iconoMusica.classList.remove('fa-music');
    iconoMusica.classList.add('fa-volume-xmark');
  }
}

function iniciarMusica() {
  if (!musicaFondo) return;
  musicaFondo.play()
    .then(() => actualizarBotonMusica(true))
    .catch(() => actualizarBotonMusica(false));
}

function pausarMusica() {
  if (!musicaFondo) return;
  musicaFondo.pause();
  actualizarBotonMusica(false);
}

if (btnMusica && musicaFondo) {
  btnMusica.addEventListener('click', () => {
    if (musicaFondo.paused) {
      iniciarMusica();
    } else {
      pausarMusica();
    }
  });
}

// ==========================================
// SISTEMA DE INICIO DE SESIÓN, REGISTRO Y OPCIONES DE PERFIL
// ==========================================
const pantallaAuth = document.getElementById('pantalla-auth');
const contenidoTienda = document.getElementById('contenido-tienda');
const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const authMensaje = document.getElementById('auth-mensaje');
const nombreUsuarioNav = document.getElementById('nombre-usuario-nav');
const emailUsuarioNav = document.getElementById('email-usuario-nav');

// Controles del icono de perfil y menú desplegable
const perfilUsuarioWrapper = document.getElementById('perfil-usuario-wrapper');
const btnIconoUsuario = document.getElementById('btn-icono-usuario');
const dropdownPerfil = document.getElementById('dropdown-perfil');

// Opciones dentro del desplegable (Mi perfil, Dirección, Cerrar sesión)
const btnAbrirPerfil = document.getElementById('btn-abrir-perfil');
const btnAbrirDireccion = document.getElementById('btn-abrir-direccion');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Modales y formularios de Perfil y Dirección
const modalMiPerfil = document.getElementById('modal-mi-perfil');
const modalDireccion = document.getElementById('modal-direccion');
const formMiPerfil = document.getElementById('form-mi-perfil');
const formDireccion = document.getElementById('form-direccion');

let usuarioActual = null;

// Botones para mostrar/ocultar contraseña
const botonesVerPass = document.querySelectorAll('.btn-ver-pass');
botonesVerPass.forEach(boton => {
  boton.addEventListener('click', () => {
    const inputId = boton.getAttribute('data-target');
    const inputPass = document.getElementById(inputId);
    const icono = boton.querySelector('i');
    if (!inputPass) return;

    if (inputPass.type === 'password') {
      inputPass.type = 'text';
      icono.classList.remove('fa-eye');
      icono.classList.add('fa-eye-slash');
    } else {
      inputPass.type = 'password';
      icono.classList.remove('fa-eye-slash');
      icono.classList.add('fa-eye');
    }
  });
});

// Abrir / cerrar menú desplegable del icono de usuario
if (btnIconoUsuario && dropdownPerfil) {
  btnIconoUsuario.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownPerfil.classList.toggle('abierto');
    btnIconoUsuario.classList.toggle('activo');
  });

  // Cerrar dropdown si se hace clic fuera
  document.addEventListener('click', (e) => {
    if (perfilUsuarioWrapper && !perfilUsuarioWrapper.contains(e.target)) {
      dropdownPerfil.classList.remove('abierto');
      btnIconoUsuario.classList.remove('activo');
    }
  });
}

// Cerrar modales de Mi Perfil / Dirección con la X o haciendo clic fuera
document.querySelectorAll('.cerrar-modal-usuario').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-close');
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('abierto');
  });
});

document.querySelectorAll('.modal-usuario-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('abierto');
    }
  });
});

// Guardar cambios de usuario en almacenamiento
function guardarCambiosUsuario(usuarioActualizado) {
  usuarioActual = usuarioActualizado;
  const usuarios = JSON.parse(localStorage.getItem('usuarios_y2k')) || [];
  const index = usuarios.findIndex(u => u.email === usuarioActualizado.email);
  if (index !== -1) {
    usuarios[index] = usuarioActualizado;
    localStorage.setItem('usuarios_y2k', JSON.stringify(usuarios));
  }
  if (localStorage.getItem('sesion_activa_y2k')) {
    localStorage.setItem('sesion_activa_y2k', JSON.stringify(usuarioActualizado));
  }
  if (sessionStorage.getItem('sesion_activa_y2k')) {
    sessionStorage.setItem('sesion_activa_y2k', JSON.stringify(usuarioActualizado));
  }
  if (nombreUsuarioNav) nombreUsuarioNav.textContent = usuarioActualizado.nombre;
}

// Abrir modal Mi Perfil
if (btnAbrirPerfil && modalMiPerfil) {
  btnAbrirPerfil.addEventListener('click', () => {
    dropdownPerfil.classList.remove('abierto');
    btnIconoUsuario.classList.remove('activo');
    if (usuarioActual) {
      document.getElementById('perfil-nombre').value = usuarioActual.nombre || '';
      document.getElementById('perfil-email').value = usuarioActual.email || '';
      document.getElementById('perfil-telefono').value = usuarioActual.telefono || '';
    }
    const msgPerfil = document.getElementById('msg-perfil');
    if (msgPerfil) {
      msgPerfil.textContent = '';
      msgPerfil.className = 'auth-mensaje';
    }
    modalMiPerfil.classList.add('abierto');
  });
}

// Guardar formulario Mi Perfil
if (formMiPerfil) {
  formMiPerfil.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!usuarioActual) return;
    usuarioActual.nombre = document.getElementById('perfil-nombre').value.trim();
    usuarioActual.telefono = document.getElementById('perfil-telefono').value.trim();
    guardarCambiosUsuario(usuarioActual);

    const msgPerfil = document.getElementById('msg-perfil');
    msgPerfil.textContent = '¡Perfil actualizado correctamente!';
    msgPerfil.className = 'auth-mensaje exito';
    setTimeout(() => {
      modalMiPerfil.classList.remove('abierto');
    }, 900);
  });
}

// Abrir modal Dirección
if (btnAbrirDireccion && modalDireccion) {
  btnAbrirDireccion.addEventListener('click', () => {
    dropdownPerfil.classList.remove('abierto');
    btnIconoUsuario.classList.remove('activo');
    if (usuarioActual && usuarioActual.direccion) {
      document.getElementById('dir-ciudad').value = usuarioActual.direccion.ciudad || '';
      document.getElementById('dir-calle').value = usuarioActual.direccion.calle || '';
      document.getElementById('dir-referencia').value = usuarioActual.direccion.referencia || '';
    } else {
      formDireccion.reset();
    }
    const msgDir = document.getElementById('msg-direccion');
    if (msgDir) {
      msgDir.textContent = '';
      msgDir.className = 'auth-mensaje';
    }
    modalDireccion.classList.add('abierto');
  });
}

// Guardar formulario Dirección
if (formDireccion) {
  formDireccion.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!usuarioActual) return;
    usuarioActual.direccion = {
      ciudad: document.getElementById('dir-ciudad').value.trim(),
      calle: document.getElementById('dir-calle').value.trim(),
      referencia: document.getElementById('dir-referencia').value.trim()
    };
    guardarCambiosUsuario(usuarioActual);

    const msgDir = document.getElementById('msg-direccion');
    msgDir.textContent = '¡Dirección guardada correctamente!';
    msgDir.className = 'auth-mensaje exito';
    setTimeout(() => {
      modalDireccion.classList.remove('abierto');
    }, 900);
  });
}

function mostrarMensajeAuth(texto, tipo) {
  authMensaje.textContent = texto;
  authMensaje.className = `auth-mensaje ${tipo}`;
}

function limpiarMensajeAuth() {
  authMensaje.textContent = '';
  authMensaje.className = 'auth-mensaje';
}

function abrirTienda(usuario) {
  usuarioActual = usuario;
  pantallaAuth.style.display = 'none';
  contenidoTienda.classList.remove('tienda-oculta');
  if (nombreUsuarioNav && usuario && usuario.nombre) {
    nombreUsuarioNav.textContent = usuario.nombre;
  }
  if (emailUsuarioNav && usuario && usuario.email) {
    emailUsuarioNav.textContent = usuario.email;
  }
  if (dropdownPerfil) dropdownPerfil.classList.remove('abierto');
  if (btnIconoUsuario) btnIconoUsuario.classList.remove('activo');
  window.scrollTo(0, 0);
  iniciarMusica();
}

function cerrarTienda() {
  pausarMusica();
  usuarioActual = null;
  localStorage.removeItem('sesion_activa_y2k');
  sessionStorage.removeItem('sesion_activa_y2k');
  if (dropdownPerfil) dropdownPerfil.classList.remove('abierto');
  if (btnIconoUsuario) btnIconoUsuario.classList.remove('activo');
  contenidoTienda.classList.add('tienda-oculta');
  pantallaAuth.style.display = 'flex';
  formLogin.reset();
  formRegistro.reset();
  limpiarMensajeAuth();
}

// Cambiar entre pestaña de Login y Registro
if (tabLogin && tabRegistro) {
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('activo');
    tabRegistro.classList.remove('activo');
    formLogin.classList.add('activo');
    formRegistro.classList.remove('activo');
    limpiarMensajeAuth();
  });

  tabRegistro.addEventListener('click', () => {
    tabRegistro.classList.add('activo');
    tabLogin.classList.remove('activo');
    formRegistro.classList.add('activo');
    formLogin.classList.remove('activo');
    limpiarMensajeAuth();
  });
}

// Registrar nuevo usuario
if (formRegistro) {
  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios_y2k')) || [];
    const existe = usuarios.some(u => u.email === email);

    if (existe) {
      mostrarMensajeAuth('Este correo ya está registrado. Inicia sesión.', 'error');
      return;
    }

    const nuevoUsuario = { nombre, email, pass };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_y2k', JSON.stringify(usuarios));
    localStorage.setItem('sesion_activa_y2k', JSON.stringify(nuevoUsuario));

    mostrarMensajeAuth('¡Cuenta creada! Abriendo tienda...', 'exito');
    setTimeout(() => {
      abrirTienda(nuevoUsuario);
    }, 600);
  });
}

// Iniciar sesión con usuario existente
if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;
    const recordar = document.getElementById('recordar-sesion')?.checked;

    const usuarios = JSON.parse(localStorage.getItem('usuarios_y2k')) || [];
    const usuarioValido = usuarios.find(u => u.email === email && u.pass === pass);

    if (!usuarioValido) {
      mostrarMensajeAuth('Correo o contraseña incorrectos.', 'error');
      return;
    }

    if (recordar) {
      localStorage.setItem('sesion_activa_y2k', JSON.stringify(usuarioValido));
    } else {
      sessionStorage.setItem('sesion_activa_y2k', JSON.stringify(usuarioValido));
    }

    mostrarMensajeAuth('¡Bienvenido de nuevo!', 'exito');
    setTimeout(() => {
      abrirTienda(usuarioValido);
    }, 500);
  });
}

// Botón de cerrar sesión dentro del menú desplegable
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarTienda();
  });
}

// Comprobar si ya había sesión iniciada al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const sesionGuardada = JSON.parse(localStorage.getItem('sesion_activa_y2k')) ||
                         JSON.parse(sessionStorage.getItem('sesion_activa_y2k'));
  if (sesionGuardada) {
    abrirTienda(sesionGuardada);
    document.addEventListener('click', () => {
      if (musicaFondo && musicaFondo.paused && !contenidoTienda.classList.contains('tienda-oculta')) {
        iniciarMusica();
      }
    }, { once: true });
  }
});

// ==========================================
// MENÚ DE HAMBURGUESA INTERACTIVO
// ==========================================
const toggleMenu = document.getElementById('toggle-menu');
const menuNavegacion = document.getElementById('menu-navegacion');
const iconoMenu = document.getElementById('icono-menu');
const enlacesMenu = document.querySelectorAll('.enlace-menu:not(#btn-icono-usuario)');

if (toggleMenu && menuNavegacion && iconoMenu) {
  toggleMenu.addEventListener('click', () => {
    menuNavegacion.classList.toggle('activo');

    if (menuNavegacion.classList.contains('activo')) {
      iconoMenu.classList.remove('fa-bars');
      iconoMenu.classList.add('fa-xmark');
    } else {
      iconoMenu.classList.remove('fa-xmark');
      iconoMenu.classList.add('fa-bars');
    }
  });

  enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', () => {
      menuNavegacion.classList.remove('activo');
      iconoMenu.classList.remove('fa-xmark');
      iconoMenu.classList.add('fa-bars');
    });
  });
}

// ==========================================
// BOTÓN WHATSAPP FLOTANTE
// ==========================================
const whatsapp = document.querySelector('#ws-flotante');

function evaluarScroll() {
  if (!whatsapp) return;
  if (window.scrollY > 200) { 
    whatsapp.classList.add('visible');
  } else {
    whatsapp.classList.remove('visible'); 
  }
}

window.addEventListener('scroll', evaluarScroll);
document.addEventListener('DOMContentLoaded', evaluarScroll);

// ==========================================
// EFECTO DE TEXTO MECANOGRAFIADO HERO
// ==========================================
const palabrasY2K = [
  "Ropa Y2K.",
  "Estilo de los 2000.",
  "Prendas Únicas."
];

let indicePalabra = 0;
let indiceCaracter = 0;
let estaBorrando = false;

const elementoTexto = document.getElementById("texto-mecanografiado");

const velocidadEscribir = 100;
const velocidadBorrar = 50;
const pausaEntrePalabras = 1800;

function efectoMecanografiado() {
  if (!elementoTexto) return;

  const palabraActual = palabrasY2K[indicePalabra];

  if (estaBorrando) {
    elementoTexto.textContent = palabraActual.substring(0, indiceCaracter - 1);
    indiceCaracter--;
  } else {
    elementoTexto.textContent = palabraActual.substring(0, indiceCaracter + 1);
    indiceCaracter++;
  }

  if (!estaBorrando && indiceCaracter === palabraActual.length) {
    estaBorrando = true;
    setTimeout(efectoMecanografiado, pausaEntrePalabras);
    return;
  } else if (estaBorrando && indiceCaracter === 0) {
    estaBorrando = false;
    indicePalabra = (indicePalabra + 1) % palabrasY2K.length;
  }

  const velocidadActual = estaBorrando ? velocidadBorrar : velocidadEscribir;
  setTimeout(efectoMecanografiado, velocidadActual);
}

document.addEventListener("DOMContentLoaded", efectoMecanografiado);

// ==========================================
// CONTROL DE MODO OSCURO / CLARO EN MENÚ
// ==========================================
const botonTema = document.getElementById('btn-tema');

function actualizarBotonTema(esClaro) {
  if (!botonTema) return;
  if (esClaro) {
    botonTema.innerHTML = '<i class="fa-solid fa-sun"></i> Modo Oscuro';
  } else {
    botonTema.innerHTML = '<i class="fa-solid fa-moon"></i> Modo Claro';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const temaGuardado = localStorage.getItem('tema_pagina');
  if (temaGuardado === 'claro') {
    document.body.classList.add('modo-claro');
    actualizarBotonTema(true);
  }
});

if (botonTema) {
  botonTema.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('modo-claro');
    const esModoClaro = document.body.classList.contains('modo-claro');
    
    actualizarBotonTema(esModoClaro);
    localStorage.setItem('tema_pagina', esModoClaro ? 'claro' : 'oscuro');
  });
}

// ==========================================
// INTERACCIÓN COPIAR NOMBRE DE MARCA EN FOOTER
// ==========================================
const textoCopy = document.getElementById('texto-copy');

if (textoCopy) {
  textoCopy.addEventListener('click', () => {
    navigator.clipboard.writeText("Wtf_ashuraY2k");
    const contenidoOriginal = textoCopy.innerHTML;
    textoCopy.innerHTML = '¡Copiado! <span class="marca-brillo">Wtf_ashuraY2k</span>';
    setTimeout(() => {
      textoCopy.innerHTML = contenidoOriginal;
    }, 2000);
  });
}