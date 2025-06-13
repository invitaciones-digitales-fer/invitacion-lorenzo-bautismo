// Crear una única instancia de audio global
const audio = new Audio("music/background-music.mp3");

document.addEventListener("DOMContentLoaded", () => {
    initWelcomeOverlay();
    initMusicControls();
    initRSVPForm();
    initSmoothScrolling();
});

function initMusicControls() {
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");

    if (!musicToggle || !musicIcon) {
        console.error("⚠️ El botón de música o el ícono no existen en el DOM.");
        return;
    }

    musicToggle.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            gsap.to(musicIcon, { duration: 0.5, opacity: 0, scale: 0.8, ease: "power2.inOut", onComplete: () => {
                musicIcon.src = "img/music-play.png"; // Ángel volando
                gsap.to(musicIcon, { duration: 0.5, opacity: 1, scale: 1, ease: "power2.out" });
            }});
        } else {
            audio.pause();
            gsap.to(musicIcon, { duration: 0.5, opacity: 0, scale: 0.8, ease: "power2.inOut", onComplete: () => {
                musicIcon.src = "img/music-pause.png"; // Ángel dormido
                gsap.to(musicIcon, { duration: 0.5, opacity: 1, scale: 1, ease: "power2.out" });
            }});
        }
    });

    audio.onerror = () => console.warn("⚠️ Archivo de música no encontrado. Agrega background-music.mp3.");
}

function initWelcomeOverlay() {
    const overlay = document.getElementById("welcomeOverlay");
    const enterBtn = document.getElementById("enterBtn");
    const musicControls = document.querySelector(".music-controls");

    if (!overlay || !enterBtn || !musicControls) {
        console.error("⚠️ Elemento faltante en el DOM. Verifica los IDs en el HTML.");
        return;
    }

    musicControls.style.opacity = "0";
    musicControls.style.pointerEvents = "none";

    enterBtn.addEventListener("click", () => {
        gsap.to(overlay, {
            duration: 1, opacity: 0, scale: 1.1, ease: "power2.inOut",
            onComplete() {
                overlay.style.display = "none";
                gsap.to(musicControls, { duration: 0.5, opacity: 1, ease: "power2.out" });
                musicControls.style.pointerEvents = "auto";

                // Usar la instancia de audio global, sin duplicarla
                setTimeout(() => {
                    if (audio.paused) {
                        audio.play().catch(error => console.warn("⚠️ Bloqueo de autoplay: ", error));
                    }
                }, 500);
            }
        });
    });
}

// Funciones extra para la página
function initRSVPForm() {
    const rsvpForm = document.getElementById("rsvpForm");
    const formSuccess = document.getElementById("formSuccess");

    if (!rsvpForm || !formSuccess) return;

    rsvpForm.addEventListener("submit", (event) => {
        event.preventDefault();

        gsap.to(rsvpForm, {
            duration: 0.5, opacity: 0, ease: "power2.inOut",
            onComplete() {
                rsvpForm.style.display = "none";
                formSuccess.style.display = "block";
                gsap.from(formSuccess, { duration: 0.8, opacity: 0, scale: 0.8, ease: "back.out(1.7)" });
            }
        });
    });
}

function openMap() {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Catedral Santa María, Ciudad")}`;
    window.open(mapUrl, "_blank");
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            gsap.to(window, { duration: 1, scrollTo: link.getAttribute("href"), ease: "power2.inOut" });
        });
    });
}
