// JavaScript para la página 404
// Con defer, el script ya se ejecuta después del DOM

// Animación de aparición gradual de elementos
const elementos = document.querySelectorAll('.error-container > *');
elementos.forEach((elemento, index) => {
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        elemento.style.transition = 'all 0.6s ease-out';
        elemento.style.opacity = '1';
        elemento.style.transform = 'translateY(0)';
    }, index * 200);
});

// Efecto de hover en la imagen de camping
const imagenCamping = document.querySelector('.imagen-camping');

if (imagenCamping) {
    imagenCamping.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
        this.style.transition = 'all 0.3s ease';
    });

    imagenCamping.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });

    // Efecto de click en la imagen
    imagenCamping.addEventListener('click', function() {
        this.style.animation = 'none';
        this.style.transform = 'scale(1.2) rotate(360deg)';
        
        setTimeout(() => {
            this.style.animation = 'flotar 3s ease-in-out infinite';
            this.style.transform = 'scale(1) rotate(0deg)';
        }, 600);
    });
}

// Efecto de click en el número 404
const errorNumero = document.querySelector('.error-numero');
if (errorNumero) {
    errorNumero.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'balanceo 2s ease-in-out infinite';
        }, 100);
        
        // Cambiar colores temporalmente
        this.style.color = '#ff6b6b';
        setTimeout(() => {
            this.style.color = 'var(--verde-principal)';
        }, 1000);
    });
}

// Agregar efecto de partículas (estrellas) de fondo
crearEstrellas();

// Mensaje motivacional aleatorio
const mensajes = [
    "¡No te rindas! Los mejores campings te están esperando.",
    "Cada aventura comienza con un primer paso... ¡o click!",
    "El camping perfecto está a solo un clic de distancia.",
    "¿Perdido? ¡Perfecto! Así es como se descubren los mejores lugares.",
    "Error 404: Camping no encontrado. ¡Pero hay muchos más!"
];

const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];

// Crear elemento para el mensaje motivacional
const mensajeMotivacional = document.createElement('div');
mensajeMotivacional.className = 'mensaje-motivacional';
mensajeMotivacional.innerHTML = `<p><strong>💡 Consejo:</strong> ${mensajeAleatorio}</p>`;
mensajeMotivacional.style.cssText = `
    background: linear-gradient(135deg, #4CAF50, #2e7d32);
    color: white;
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    animation: aparecer 1s ease-out 1.5s both;
`;

const accionesDiv = document.querySelector('.acciones-404');
if (accionesDiv) {
    accionesDiv.parentNode.insertBefore(mensajeMotivacional, accionesDiv.nextSibling);
}

// Función para crear estrellas de fondo
function crearEstrellas() {
    const contenedor = document.querySelector('.contenedor-404');
    if (!contenedor) return;

    for (let i = 0; i < 20; i++) {
        const estrella = document.createElement('div');
        estrella.innerHTML = '✨';
        estrella.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: parpadeo ${Math.random() * 3 + 2}s ease-in-out infinite;
            pointer-events: none;
            z-index: -1;
        `;
        contenedor.appendChild(estrella);
    }
}

// Agregar estilos CSS adicionales dinámicamente
const estilosAdicionales = `
    @keyframes parpadeo {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    .contenedor-404 {
        position: relative;
        overflow: hidden;
    }
    
    .mensaje-motivacional {
        transform: translateY(20px);
        opacity: 0;
    }
`;

const style = document.createElement('style');
style.textContent = estilosAdicionales;
document.head.appendChild(style);