// Crear una única instancia de audio global
const audio = new Audio("music/background-music.mp3");

// Configuración global para animaciones
const animationConfig = {
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.15,
    triggerOffset: "80%"
};

// ScrollTrigger batch para mejor rendimiento
let scrollAnimations = [];

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar todas las funciones
    initWelcomeOverlay();
    initMusicControls();
    initRSVPForm();
    initSmoothScrolling();
    initScrollRevealAnimations();
    initParallaxEffects();
    // Animación especial para cards de detalles
    initDetailsCardsAnimation();


    // Configurar audio global
    setupAudioSettings();

    console.info("✨ Invitación digital cargada correctamente");
});

// =====================================
// CONFIGURACIÓN DE AUDIO
// =====================================
function setupAudioSettings() {
    audio.loop = true;
    audio.volume = 0.3; // Volumen suave por defecto

    // Fade in del audio cuando se reproduce
    audio.addEventListener('play', () => {
        gsap.fromTo(audio, { volume: 0 }, {
            duration: 2,
            volume: 0.3,
            ease: "power2.out"
        });
    });

    audio.onerror = () => {
        console.warn("⚠️ Archivo de música no encontrado. Agrega background-music.mp3 en la carpeta music/");
    };
}

// =====================================
// CONTROLES DE MÚSICA MEJORADOS
// =====================================
function initMusicControls() {
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");

    if (!musicToggle || !musicIcon) {
        console.error("⚠️ El botón de música o el ícono no existen en el DOM.");
        return;
    }

    // Animación inicial del botón
    gsap.set(musicToggle, { scale: 0.9, opacity: 0.9 });

    musicToggle.addEventListener("click", toggleMusic);

    // Hover effect mejorado
    musicToggle.addEventListener("mouseenter", () => {
        gsap.to(musicToggle, {
            duration: 0.3,
            scale: 1.1,
            rotation: 5,
            ease: "back.out(1.7)"
        });
    });

    musicToggle.addEventListener("mouseleave", () => {
        gsap.to(musicToggle, {
            duration: 0.3,
            scale: 1,
            rotation: 0,
            ease: "power2.out"
        });
    });
}

function toggleMusic() {
    const musicIcon = document.getElementById("musicIcon");
    const musicToggle = document.getElementById("musicToggle");

    // Animación de click
    gsap.to(musicToggle, {
        duration: 0.1,
        scale: 0.95,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });

    if (audio.paused) {
        audio.play().catch(error => {
            console.warn("⚠️ Bloqueo de autoplay del navegador: ", error);
        });

        // Cambiar ícono con animación suave
        gsap.to(musicIcon, {
            duration: 0.3,
            opacity: 0,
            scale: 0.8,
            rotation: 180,
            ease: "power2.inOut",
            onComplete: () => {
                musicIcon.src = "img/music-play.png";
                gsap.to(musicIcon, {
                    duration: 0.4,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    ease: "back.out(1.7)"
                });
            }
        });
    } else {
        // Fade out suave del audio
        gsap.to(audio, {
            duration: 1,
            volume: 0,
            ease: "power2.out",
            onComplete: () => {
                audio.pause();
                audio.volume = 0.3; // Resetear volumen
            }
        });

        gsap.to(musicIcon, {
            duration: 0.3,
            opacity: 0,
            scale: 0.8,
            rotation: -180,
            ease: "power2.inOut",
            onComplete: () => {
                musicIcon.src = "img/music-pause.png";
                gsap.to(musicIcon, {
                    duration: 0.4,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    ease: "back.out(1.7)"
                });
            }
        });
    }
}

// =====================================
// OVERLAY DE BIENVENIDA MEJORADO
// =====================================
function initWelcomeOverlay() {
    const overlay = document.getElementById("welcomeOverlay");
    const enterBtn = document.getElementById("enterBtn");
    const musicControls = document.querySelector(".music-controls");
    const overlayIcon = document.querySelector(".overlay-icon");
    const overlayTitle = document.querySelector(".overlay-content h1");

    if (!overlay || !enterBtn || !musicControls) {
        console.error("⚠️ Elemento faltante en el DOM. Verifica los IDs en el HTML.");
        return;
    }

    // Configuración inicial
    gsap.set(musicControls, { opacity: 0, scale: 0.8 });
    gsap.set(enterBtn, { y: 20, opacity: 0 });

    // Animación de entrada del overlay
    gsap.timeline()
        .from(overlayIcon, {
            duration: 1.2,
            scale: 0,
            rotation: 360,
            ease: "back.out(1.7)"
        })
        .from(overlayTitle, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.6")
        .to(enterBtn, {
            duration: 0.6,
            y: 0,
            opacity: 1,
            ease: "back.out(1.7)"
        }, "-=0.3");

    // Hover effect para el botón
    enterBtn.addEventListener("mouseenter", () => {
        gsap.to(enterBtn, {
            duration: 0.3,
            scale: 1.08,
            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.4)",
            ease: "power2.out"
        });
    });

    enterBtn.addEventListener("mouseleave", () => {
        gsap.to(enterBtn, {
            duration: 0.3,
            scale: 1,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            ease: "power2.out"
        });
    });

    enterBtn.addEventListener("click", () => {
        // Animación de salida del overlay
        const tl = gsap.timeline();

        tl.to(enterBtn, {
            duration: 0.3,
            scale: 0.95,
            ease: "power2.inOut"
        })
            .to(overlay, {
                duration: 1.2,
                opacity: 0,
                scale: 1.1,
                filter: "blur(10px)",
                ease: "power2.inOut"
            }, "-=0.1")
            .call(() => {
                overlay.style.display = "none";

                // Mostrar controles de música
                gsap.to(musicControls, {
                    duration: 0.8,
                    opacity: 1,
                    scale: 1,
                    ease: "back.out(1.7)"
                });

                musicControls.style.pointerEvents = "auto";

                // Iniciar música después de la interacción del usuario
                setTimeout(() => {
                    if (audio.paused) {
                        audio.play().catch(error => {
                            console.warn("⚠️ Bloqueo de autoplay del navegador: ", error);
                        });
                    }
                }, 800);

                // Trigger para las animaciones de scroll
                ScrollTrigger.refresh();
            });
    });
}

// =====================================
// SCROLL REVEAL ANIMATIONS
// =====================================
function initScrollRevealAnimations() {
    // Registrar plugin de ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animación para secciones principales
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        gsap.set(section, { opacity: 0, y: 50 });

        scrollAnimations.push(
            gsap.to(section, {
                opacity: 1,
                y: 0,
                duration: animationConfig.duration,
                ease: animationConfig.ease,
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse",
                    onEnter: () => animateSection(section),
                }
            })
        );
    });

    // Animación especial para cards de detalles
    initDetailsCardsAnimation();

    // Animación para títulos principales
    initTitleAnimations();

    // Animación para el formulario RSVP
    initFormAnimation();

    console.info("✨ Animaciones de scroll inicializadas");
}

function animateSection(section) {
    const elements = section.querySelectorAll('h1, h2, h3, p, blockquote, .welcome-quote');

    if (elements.length > 0) {
        gsap.fromTo(elements,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }
}

function initDetailsCardsAnimation() {
    const detailsCards = document.querySelectorAll('.detail-card');

    if (detailsCards.length > 0) {
        gsap.set(detailsCards, { opacity: 0, y: 60, scale: 0.9 });

        ScrollTrigger.batch(detailsCards, {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1.2)",
                    overwrite: true
                });
            },
            onLeave: (elements) => {
                gsap.to(elements, {
                    opacity: 0.3,
                    scale: 0.95,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            },
            onEnterBack: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            },
            start: "top 90%",
            end: "bottom 10%"
        });

        // Hover effects para cards
        detailsCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.05,
                    y: -10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
}

function initTitleAnimations() {
    const titles = document.querySelectorAll('.welcome-title, .details-title, .message-title, .rsvp-title');

    titles.forEach(title => {
        gsap.set(title, { opacity: 0, scale: 0.8, y: 30 });

        scrollAnimations.push(
            gsap.to(title, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            })
        );
    });
}

function initFormAnimation() {
    const form = document.getElementById('rsvpForm');
    const formInputs = form?.querySelectorAll('input, select, textarea, button');

    if (form && formInputs.length > 0) {
        gsap.set(formInputs, { opacity: 0, x: 30 });

        ScrollTrigger.create({
            trigger: form,
            start: "top 85%",
            onEnter: () => {
                gsap.to(formInputs, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }
        });
    }
}

// =====================================
// EFECTOS PARALLAX SUTILES
// =====================================
function initParallaxEffects() {
    // Parallax suave para el fondo
    gsap.to('body', {
        backgroundPosition: '50% 100%',
        ease: "none",
        scrollTrigger: {
            trigger: 'body',
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // Parallax para quotes y elementos decorativos
    const quotes = document.querySelectorAll('blockquote, .welcome-quote');
    quotes.forEach(quote => {
        gsap.to(quote, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: quote,
                start: "top bottom",
                end: "bottom top",
                scrub: 2
            }
        });
    });
}

// =====================================
// FORMULARIO RSVP MEJORADO
// =====================================
function initRSVPForm() {
    const rsvpForm = document.getElementById("rsvpForm");
    const formSuccess = document.getElementById("formSuccess");

    if (!rsvpForm || !formSuccess) {
        console.warn("⚠️ Formulario RSVP no encontrado");
        return;
    }

    // Validación en tiempo real
    const inputs = rsvpForm.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('focus', clearInputError);
    });

    // El event listener para el submit se maneja en el código separado más abajo
}

function validateInput(event) {
    const input = event.target;
    const isValid = input.checkValidity();

    if (!isValid) {
        gsap.to(input, {
            borderColor: '#e74c3c',
            duration: 0.3,
            ease: "power2.out"
        });

        // Shake animation
        gsap.to(input, {
            x: 5,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: "power2.inOut"
        });
    } else {
        gsap.to(input, {
            borderColor: '#27ae60',
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

function clearInputError(event) {
    const input = event.target;
    gsap.to(input, {
        borderColor: '#5a6c7d',
        duration: 0.3,
        ease: "power2.out"
    });
}

// =====================================
// SMOOTH SCROLLING MEJORADO
// =====================================
function initSmoothScrolling() {
    // Registrar ScrollTo plugin
    gsap.registerPlugin(ScrollToPlugin);

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: {
                        y: target,
                        offsetY: 50 // Offset para mejor visualización
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });
}

// =====================================
// FUNCIÓN PARA ABRIR MAPA
// =====================================
function openMap() {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Catedral Santa María, Ciudad")}`;
    window.open(mapUrl, "_blank");

    // Analytics track (opcional)
    console.info("🗺️ Mapa abierto");
}

// =====================================
// MANEJO MEJORADO DEL FORMULARIO RSVP
// =====================================
document.getElementById("rsvpForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío tradicional

    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    const rsvpSection = document.getElementById("rsvp");

    // Deshabilitar el botón durante el envío
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    fetch(this.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    })
        .then(response => {
            if (response.ok) {
                const form = document.getElementById("rsvpForm");
                const successMessage = document.getElementById("formSuccess");

                // SOLUCIÓN CLAVE: Animar la transición completa de la sección
                const tl = gsap.timeline();

                // 1. Animar la salida del formulario
                tl.to(form, {
                    duration: 0.6,
                    opacity: 0,
                    scale: 0.95,
                    y: -20,
                    ease: "power2.inOut"
                })
                    // 2. Cambiar el contenido
                    .call(() => {
                        form.style.display = "none";
                        successMessage.classList.remove("hidden");
                        successMessage.style.display = "block";
                    })
                    // 3. Animar la entrada del mensaje de éxito
                    .fromTo(successMessage,
                        {
                            opacity: 0,
                            scale: 0.8,
                            y: 20
                        },
                        {
                            duration: 0.8,
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            ease: "back.out(1.7)"
                        }
                    )
                    // 4. Ajustar la altura de la sección suavemente
                    .to(rsvpSection, {
                        duration: 0.4,
                        minHeight: "auto",
                        ease: "power2.out"
                    }, "-=0.4");

                // Restaurar después de 8 segundos con mejor UX
                setTimeout(() => {
                    const restoreTl = gsap.timeline();

                    // 1. Animar salida del mensaje
                    restoreTl.to(successMessage, {
                        duration: 0.5,
                        opacity: 0,
                        scale: 0.9,
                        y: -10,
                        ease: "power2.in"
                    })
                        // 2. Cambiar contenido
                        .call(() => {
                            successMessage.style.display = "none";
                            successMessage.classList.add("hidden");

                            // Limpiar y restaurar el formulario
                            form.reset();
                            form.style.display = "block";

                            // Rehabilitar el botón
                            submitButton.disabled = false;
                            submitButton.textContent = "Enviar Confirmación";
                        })
                        // 3. Animar entrada del formulario restaurado
                        .fromTo(form,
                            {
                                opacity: 0,
                                scale: 0.95,
                                y: 20
                            },
                            {
                                duration: 0.6,
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                ease: "power2.out"
                            }
                        );

                }, 8000); // 8 segundos para mejor lectura

            } else {
                // Manejar errores
                response.json().then(data => {
                    if (data.errors) {
                        alert("Error: " + data.errors.map(error => error.message).join(", "));
                    } else {
                        alert("Hubo un error al enviar. Inténtalo nuevamente.");
                    }
                }).catch(() => {
                    alert("Hubo un error al enviar. Inténtalo nuevamente.");
                });

                // Rehabilitar el botón en caso de error
                submitButton.disabled = false;
                submitButton.textContent = "Enviar Confirmación";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error de conexión. Verifica tu internet e inténtalo nuevamente.");

            // Rehabilitar el botón en caso de error
            submitButton.disabled = false;
            submitButton.textContent = "Enviar Confirmación";
        });
});

// Animación personalizada para sección de cierre
const closing = document.querySelector('#closing');
if (closing) {
  const closingHeading = closing.querySelector('h3');
  const closingQuote = closing.querySelector('blockquote');

  gsap.set([closingHeading, closingQuote], { opacity: 0, y: 40 });

  ScrollTrigger.create({
    trigger: closing,
    start: "top 85%",
    onEnter: () => {
      gsap.to(closingHeading, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)"
      });

      gsap.to(closingQuote, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out"
      });
    }
  });
}


// =====================================
// LIMPIEZA DE MEMORY LEAKS
// =====================================
window.addEventListener('beforeunload', () => {
    // Limpiar animaciones de scroll
    scrollAnimations.forEach(animation => {
        if (animation && animation.kill) {
            animation.kill();
        }
    });

    // Limpiar ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Pausar audio
    if (audio && !audio.paused) {
        audio.pause();
    }

    console.info("🧹 Limpieza de memoria completada");
});

// =====================================
// UTILIDADES ADICIONALES
// =====================================

// Función para reiniciar animaciones (útil para desarrollo)
function resetAnimations() {
    ScrollTrigger.refresh();
    console.info("🔄 Animaciones reiniciadas");
}

// Función para debugging de performance
function logPerformance() {
    console.info("📊 ScrollTriggers activos:", ScrollTrigger.getAll().length);
    console.info("📊 Animaciones GSAP activas:", gsap.globalTimeline.getChildren().length);
}

// Hacer funciones disponibles globalmente para debugging
window.resetAnimations = resetAnimations;
window.logPerformance = logPerformance;