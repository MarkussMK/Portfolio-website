/* ============================================================
   Markuss Šube — Modern Portfolio interactions
   Vanilla JS. No external dependencies.
   ============================================================ */

(function () {
    "use strict";

    /* ---------------- Preloader ---------------- */
    const preloader = document.getElementById("preloader");
    const preloaderFill = document.getElementById("preloader-fill");
    const preloaderPct = document.getElementById("preloader-pct");

    // Fast, mostly-cosmetic ramp — real load is near-instant, this just avoids a content flash.
    let progress = 0;
    let preloadDone = false;
    function finishPreload() {
        if (preloadDone) return;
        preloadDone = true;
        clearInterval(preloadTimer);
        preloaderFill.style.width = "100%";
        preloaderPct.textContent = "100%";
        preloader.classList.add("hidden");
        document.body.style.overflow = "";
        startEntranceAnimations();
    }
    const preloadTimer = setInterval(() => {
        progress += Math.random() * 32;
        if (progress >= 100) {
            progress = 100;
            setTimeout(finishPreload, 120);
        }
        preloaderFill.style.width = progress + "%";
        preloaderPct.textContent = Math.floor(progress) + "%";
    }, 70);

    document.body.style.overflow = "hidden";
    // Safety nets: iOS Safari can throttle/stall setInterval (e.g. tab backgrounded
    // during load, low-power mode), which used to leave the preloader — and the
    // hero content gated behind it — stuck forever. These force completion no
    // matter what happens to the timer above.
    window.addEventListener("load", finishPreload);
    setTimeout(finishPreload, 3000);

    function startEntranceAnimations() {
        document.querySelectorAll(".hero .reveal-up").forEach((el) => {
            el.classList.add("in-view");
        });
    }

    /* ---------------- Custom cursor ---------------- */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorRing = document.getElementById("cursor-ring");
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    if (window.matchMedia("(hover: hover)").matches) {
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + "px";
            cursorDot.style.top = mouseY + "px";
        });

        (function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = ringX + "px";
            cursorRing.style.top = ringY + "px";
            requestAnimationFrame(animateRing);
        })();

        document.querySelectorAll("a, button, .box-3d, .tag-cloud span").forEach((el) => {
            el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
            el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
        });
    }

    /* ---------------- Magnetic buttons ---------------- */
    document.querySelectorAll(".magnetic").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "";
        });
    });

    /* ---------------- Scroll progress + nav state ---------------- */
    const scrollFill = document.getElementById("scroll-progress-fill");
    const nav = document.getElementById("nav");

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollFill.style.width = pct + "%";
        nav.classList.toggle("scrolled", scrollTop > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------------- Mobile menu ---------------- */
    const navToggle = document.getElementById("nav-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("open");
        mobileMenu.classList.toggle("open");
    });
    document.querySelectorAll(".mobile-link").forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("open");
            mobileMenu.classList.remove("open");
        });
    });

    /* ---------------- Active nav link on scroll ---------------- */
    const sections = document.querySelectorAll(".section, .hero");
    const navLinks = document.querySelectorAll(".nav-link");

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.dataset.section === id);
                    });
                }
            });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => sectionObserver.observe(s));

    /* ---------------- Generic reveal-on-scroll ---------------- */
    const revealObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    // Hero elements are included too (not just below-the-fold sections) so they
    // still reveal even if the preloader's own completion path is ever delayed.
    document.querySelectorAll(".reveal-up").forEach((el) => revealObserver.observe(el));

    /* ---------------- Counter animation ---------------- */
    const counters = document.querySelectorAll(".stat-num");
    const counterObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = "true";
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.6 }
    );
    counters.forEach((c) => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(eased * target);
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }

    /* ---------------- Skill bar fill ---------------- */
    const skillFills = document.querySelectorAll(".skill-fill");
    const skillObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );
    skillFills.forEach((f) => skillObserver.observe(f));

    /* ---------------- Manual reveal fallback ----------------
       Some iOS Safari versions don't (re)fire IntersectionObserver until a
       scroll/resize actually happens (e.g. after the address bar collapses),
       leaving content stuck at opacity:0 until the user scrolls all the way
       down and back. This re-checks visibility directly as a safety net. */
    function isInViewport(el, ratio) {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) return false;
        const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        return visible / rect.height >= ratio;
    }
    function checkRevealsFallback() {
        document.querySelectorAll(".reveal-up:not(.in-view)").forEach((el) => {
            if (isInViewport(el, 0.15)) el.classList.add("in-view");
        });
        counters.forEach((c) => {
            if (!c.dataset.counted && isInViewport(c, 0.6)) {
                c.dataset.counted = "true";
                animateCounter(c);
            }
        });
        skillFills.forEach((f) => {
            if (!f.classList.contains("animate") && isInViewport(f, 0.4)) f.classList.add("animate");
        });
    }
    let fallbackTicking = false;
    function scheduleFallbackCheck() {
        if (fallbackTicking) return;
        fallbackTicking = true;
        requestAnimationFrame(() => {
            checkRevealsFallback();
            fallbackTicking = false;
        });
    }
    window.addEventListener("scroll", scheduleFallbackCheck, { passive: true });
    window.addEventListener("resize", scheduleFallbackCheck);
    window.addEventListener("orientationchange", scheduleFallbackCheck);
    window.addEventListener("load", scheduleFallbackCheck);
    scheduleFallbackCheck();

    /* ---------------- Work card tilt (legacy hook, no-op if absent) ---------------- */
    document.querySelectorAll("[data-tilt]").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(700px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* ---------------- Project case-file modals (3D box) ---------------- */
    function openProjectModal(id) {
        const modal = document.getElementById("modal-" + id);
        if (!modal) return;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function closeProjectModal(modal) {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }
    document.querySelectorAll(".box-3d").forEach((box) => {
        const open = () => openProjectModal(box.dataset.project);
        box.addEventListener("click", open);
        box.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
            }
        });
    });
    document.querySelectorAll(".project-modal-overlay").forEach((overlay) => {
        overlay.querySelector(".project-modal-close").addEventListener("click", () => closeProjectModal(overlay));
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeProjectModal(overlay);
        });
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const openModal = document.querySelector(".project-modal-overlay.open");
            if (openModal) closeProjectModal(openModal);
        }
    });

    /* ---------------- Role rotator (typewriter) ---------------- */
    const roles = [
        "automation systems.",
        "real-time data pipelines.",
        "gamified web experiences.",
        "reliable test frameworks.",
        "elegant interfaces.",
        "plc programs.",
        "reliable scripts.",
        "experimental projects."
    ];
    const roleEl = document.getElementById("role-rotator");
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeRole() {
        const current = roles[roleIndex];
        if (!deleting) {
            charIndex++;
            roleEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(typeRole, 1600);
                return;
            }
        } else {
            charIndex--;
            roleEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        setTimeout(typeRole, deleting ? 35 : 60);
    }
    setTimeout(typeRole, 900);

    /* ---------------- Name scramble effect ---------------- */
    const scrambleEl = document.getElementById("scramble-name");
    const scrambleChars = "!<>-_\\/[]{}—=+*^?#________";
    const originalName = scrambleEl.textContent;

    function scrambleText(el, text, duration = 900) {
        const steps = 14;
        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            el.textContent = text
                .split("")
                .map((ch, i) => {
                    if (ch === " ") return " ";
                    const revealPoint = (i / text.length) * steps;
                    if (frame >= revealPoint + steps / 2) return ch;
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join("");
            if (frame >= steps) {
                clearInterval(interval);
                el.textContent = text;
            }
        }, duration / steps);
    }
    setTimeout(() => scrambleText(scrambleEl, originalName), 600);
    scrambleEl.addEventListener("mouseenter", () => scrambleText(scrambleEl, originalName, 600));

    /* ---------------- Back to top ---------------- */
    document.getElementById("to-top").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------------- Contact form (demo only) ---------------- */
    const form = document.getElementById("contact-form");
    const toastHost = document.createElement("div");
    toastHost.className = "toast";
    toastHost.id = "toast";
    document.body.appendChild(toastHost);

    function showToast(message) {
        toastHost.textContent = message;
        toastHost.classList.add("show");
        setTimeout(() => toastHost.classList.remove("show"), 3200);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const label = document.getElementById("cf-submit-label");
        const original = label.textContent;
        label.textContent = "Sending…";
        setTimeout(() => {
            label.textContent = "Message ready ✓";
            showToast("Thanks! This demo form doesn't send yet — try the LinkedIn link instead.");
            setTimeout(() => {
                label.textContent = original;
                form.reset();
            }, 1800);
        }, 900);
    });

    /* ---------------- Smooth in-page nav ---------------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const targetId = anchor.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ============================================================
       Industrial circuit-board background (canvas)
       Orthogonal "PCB trace" paths with traveling signal pulses.
       ============================================================ */
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let circuits = [];
    let canvasWidth, canvasHeight;
    const pointer = { x: null, y: null };
    const GRID = 46;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resizeCanvas() {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
        generateCircuits();
    }

    function snapToGrid(value) {
        return Math.round(value / GRID) * GRID;
    }

    function generateCircuits() {
        const cols = Math.ceil(canvasWidth / GRID);
        const rows = Math.ceil(canvasHeight / GRID);
        const count = Math.min(26, Math.max(10, Math.floor((cols * rows) / 55)));
        const palette = ["255, 106, 44", "255, 182, 72", "255, 61, 61"];

        circuits = Array.from({ length: count }, () => {
            let x = snapToGrid(Math.random() * canvasWidth);
            let y = snapToGrid(Math.random() * canvasHeight);
            const points = [{ x, y }];
            const segments = 4 + Math.floor(Math.random() * 5);
            let horizontal = Math.random() > 0.5;

            for (let i = 0; i < segments; i++) {
                const dist = (1 + Math.floor(Math.random() * 5)) * GRID;
                const dir = Math.random() > 0.5 ? 1 : -1;
                if (horizontal) x += dist * dir;
                else y += dist * dir;
                x = Math.min(canvasWidth, Math.max(0, x));
                y = Math.min(canvasHeight, Math.max(0, y));
                points.push({ x, y });
                horizontal = !horizontal;
            }

            let total = 0;
            const cumulative = [0];
            for (let i = 1; i < points.length; i++) {
                total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
                cumulative.push(total);
            }

            return {
                points,
                cumulative,
                total: total || 1,
                color: palette[Math.floor(Math.random() * palette.length)],
                t: Math.random(),
                speed: 0.00016 + Math.random() * 0.00026
            };
        });
    }

    function pointAlongPath(circuit, dist) {
        const { points, cumulative } = circuit;
        for (let i = 1; i < cumulative.length; i++) {
            if (dist <= cumulative[i]) {
                const segLen = cumulative[i] - cumulative[i - 1];
                const t = segLen === 0 ? 0 : (dist - cumulative[i - 1]) / segLen;
                const a = points[i - 1], b = points[i];
                return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
            }
        }
        return points[points.length - 1];
    }

    function drawCircuits() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        circuits.forEach((circuit) => {
            const { points, color } = circuit;

            // brighten a trace when the pointer hovers near it
            let near = false;
            if (pointer.x !== null) {
                for (let i = 1; i < points.length; i++) {
                    const midX = (points[i].x + points[i - 1].x) / 2;
                    const midY = (points[i].y + points[i - 1].y) / 2;
                    if (Math.hypot(pointer.x - midX, pointer.y - midY) < 120) {
                        near = true;
                        break;
                    }
                }
            }

            // trace path
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(${color}, ${near ? 0.35 : 0.15})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // solder pads at endpoints, junction pads at turns
            points.forEach((p, i) => {
                if (i === 0 || i === points.length - 1) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${color}, 0.4)`;
                    ctx.fill();
                } else {
                    ctx.fillStyle = `rgba(${color}, 0.26)`;
                    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
                }
            });

            // traveling signal pulse
            circuit.t = (circuit.t + circuit.speed) % 1;
            const dist = circuit.t * circuit.total;
            const pos = pointAlongPath(circuit, dist);

            const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
            glow.addColorStop(0, `rgba(${color}, 0.9)`);
            glow.addColorStop(1, `rgba(${color}, 0)`);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2.1, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fill();
        });

        requestAnimationFrame(drawCircuits);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
        pointer.x = null;
        pointer.y = null;
    });

    resizeCanvas();
    if (!reduceMotion) {
        requestAnimationFrame(drawCircuits);
    }

    /* ---------------- Robotic arm: periodic wave ---------------- */
    const roboArm = document.querySelector(".robo-arm");
    if (roboArm) {
        const WAVE_DURATION = 3400;
        const WAVE_INTERVAL = 60000;
        const triggerWave = () => {
            roboArm.classList.add("waving");
            setTimeout(() => roboArm.classList.remove("waving"), WAVE_DURATION);
        };
        setInterval(triggerWave, WAVE_INTERVAL);
    }

    /* ---------------- Easter egg: click "Work" 10x in a row ---------------- */
    /* The only place this file reaches outside "no external dependencies": the
       hidden horror-office mini-game lazy-loads three.js from a CDN via dynamic
       import(), only once triggered, so it never costs anything on a normal visit.
       Skipped entirely on touch/mobile — the game needs WASD + pointer-lock, which
       don't work on a phone, so there's no reason to ever wire up or load it there. */
    (function initWorkEasterEgg() {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const triggers = document.querySelectorAll(
            '.nav-link[data-section="work"], .mobile-link[data-section="work"]'
        );
        if (!triggers.length) return;

        const NEEDED_CLICKS = 10;
        const RESET_GAP = 1600; // ms between clicks to still count as "in a row"
        let count = 0;
        let lastClick = 0;

        triggers.forEach((el) => {
            el.addEventListener("click", (e) => {
                if (document.body.classList.contains("egg-open")) return;
                const now = Date.now();
                if (now - lastClick > RESET_GAP) count = 0;
                lastClick = now;
                count++;
                if (count >= NEEDED_CLICKS) {
                    count = 0;
                    e.preventDefault();
                    startEasterEgg();
                }
            });
        });
    })();

    const EGG_LINES = [
        "you found me...",
        "why did you have to press me so many times about work?...",
        "you asked for this, just so you know.....",
        "we could have had fun but everything is about work always....",
        "thats it.... here is your work......"
    ];

    function startEasterEgg() {
        const overlay = document.getElementById("egg-overlay");
        const typewriterEl = document.getElementById("egg-typewriter");
        const textEl = document.getElementById("egg-typewriter-text");
        if (!overlay || !textEl) return;

        document.body.classList.add("egg-open");
        document.body.style.overflow = "hidden";
        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
        typewriterEl.style.display = "";
        textEl.textContent = "";

        let lineIndex = 0;
        const typeLine = () => {
            if (lineIndex >= EGG_LINES.length) {
                setTimeout(() => {
                    typewriterEl.style.display = "none";
                    launchHorrorOffice(overlay);
                }, 900);
                return;
            }
            const line = EGG_LINES[lineIndex];
            let charIndex = 0;
            textEl.textContent = "";
            const typeChar = () => {
                if (charIndex < line.length) {
                    textEl.textContent += line[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 36 + Math.random() * 34);
                } else {
                    lineIndex++;
                    setTimeout(typeLine, 1100);
                }
            };
            typeChar();
        };
        typeLine();
    }

    let eggGameRunning = false;
    let activeCleanup = null;

    const eggExitBtn = document.getElementById("egg-exit");
    if (eggExitBtn) {
        eggExitBtn.addEventListener("click", () => closeEasterEgg());
    }

    /* Procedural horror audio (no external audio assets - everything is synthesized
       via Web Audio API so the site stays dependency-free apart from three.js). */
    function eggMakeNoiseBuffer(ctx, duration) {
        const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
        const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
        return buffer;
    }
    function eggStartDrone(ctx, master) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 50;
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.05;
        osc.connect(oscGain).connect(master);
        osc.start();

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain).connect(osc.frequency);
        lfo.start();

        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = eggMakeNoiseBuffer(ctx, 4);
        noiseSrc.loop = true;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.value = 260;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.02;
        noiseSrc.connect(noiseFilter).connect(noiseGain).connect(master);
        noiseSrc.start();

        return { osc, lfo, noiseSrc };
    }
    function eggPlayFootstep(ctx, master, volume) {
        if (!ctx) return;
        const now = ctx.currentTime;
        const src = ctx.createBufferSource();
        src.buffer = eggMakeNoiseBuffer(ctx, 0.16);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 210;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        src.connect(filter).connect(gain).connect(master);
        src.start(now);
        src.stop(now + 0.25);
    }
    function eggPlayScare(ctx, master) {
        if (!ctx) return;
        const now = ctx.currentTime;
        const noise = ctx.createBufferSource();
        noise.buffer = eggMakeNoiseBuffer(ctx, 0.6);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.9, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        noise.connect(noiseGain).connect(master);
        noise.start(now);
        noise.stop(now + 0.7);

        const stab = ctx.createOscillator();
        stab.type = "sawtooth";
        stab.frequency.setValueAtTime(110, now);
        stab.frequency.exponentialRampToValueAtTime(28, now + 0.55);
        const stabGain = ctx.createGain();
        stabGain.gain.setValueAtTime(0.8, now);
        stabGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        stab.connect(stabGain).connect(master);
        stab.start(now);
        stab.stop(now + 0.7);
    }

    async function launchHorrorOffice(overlay) {
        const gameEl = document.getElementById("egg-game");
        const canvas = document.getElementById("egg-canvas");
        gameEl.classList.add("active");
        eggGameRunning = true;

        let THREE;
        try {
            THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js");
        } catch (err) {
            gameEl.innerHTML =
                '<p style="color:#fff;font-family:var(--font-mono,monospace);text-align:center;' +
                'margin-top:42vh;padding:0 24px;">(the office won\'t load without an internet connection...)</p>' +
                '<button class="egg-exit" id="egg-exit-fallback">Esc — leave</button>';
            document.getElementById("egg-exit-fallback").addEventListener("click", () => closeEasterEgg());
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020202);
        scene.fog = new THREE.FogExp2(0x000000, 0.065);

        const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1.6, 6);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        /* Tone-map so bright highlights roll off gracefully instead of hard-clipping
           to solid white, but keep exposure low so the room stays dark and moody
           rather than washed out. */
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.55;

        /* Lighting: dim ambient + a single flickering, shadow-casting point light.
           Intensities are tuned higher than old three.js conventions because r155+
           uses physically-correct (candela) light units. Shadows (not just raw
           brightness) are what make the room read as a 3D space instead of a flat
           gradient, since AmbientLight has no directionality of its own.
           Ambient is kept LOW (unlike a flat wash) so the point light's falloff
           (not ambient) is what carves the room out of near-total darkness, so
           only the pool right around the light reads clearly and everywhere else
           fades to black. */
        const ambient = new THREE.AmbientLight(0x2a2018, 1.3);
        scene.add(ambient);
        const flicker = new THREE.PointLight(0xff6a2c, 95, 16, 2);
        flicker.position.set(0, 2.6, 1.5);
        flicker.castShadow = true;
        flicker.shadow.mapSize.set(1024, 1024);
        flicker.shadow.camera.near = 0.2;
        flicker.shadow.camera.far = 18;
        flicker.shadow.bias = -0.003;
        scene.add(flicker);
        let flickerBase = 95;

        /* Room + desks: a procedural office (rows of cubicle desks, monitors)
           built entirely from primitives - no external 3D model/texture assets
           are loaded, keeping this easter egg lightweight to download. */
        let roomBound = { minX: -6, maxX: 6, minZ: -6, maxZ: 6 };
        let figureSpawn = { x: roomBound.maxX - 1, z: roomBound.maxZ - 1 };
        let initialYaw = 0;
        /* AABBs (in the same world space as camera/figure) that the player can't
           walk through - desks, cubicle partitions, cabinets, etc. Populated below
           from the procedural desks placed in the room. */
        let colliders = [];
        {
            const roomSize = 24;
            const floorMat = new THREE.MeshStandardMaterial({ color: 0x120e0b, roughness: 0.95 });
            const wallMat = new THREE.MeshStandardMaterial({ color: 0x1b1613, roughness: 0.9 });

            const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), floorMat);
            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            scene.add(floor);

            const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), floorMat);
            ceiling.position.y = 3.2;
            ceiling.rotation.x = Math.PI / 2;
            ceiling.receiveShadow = true;
            scene.add(ceiling);

            function addWall(w, h, x, y, z, ry) {
                const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
                m.position.set(x, y, z);
                m.rotation.y = ry;
                m.receiveShadow = true;
                scene.add(m);
            }
            addWall(roomSize, 3.2, 0, 1.6, -roomSize / 2, 0);
            addWall(roomSize, 3.2, 0, 1.6, roomSize / 2, Math.PI);
            addWall(roomSize, 3.2, -roomSize / 2, 1.6, 0, Math.PI / 2);
            addWall(roomSize, 3.2, roomSize / 2, 1.6, 0, -Math.PI / 2);

            const deskMat = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.8 });
            const deskGeo = new THREE.BoxGeometry(1.6, 0.06, 0.8);
            const legGeo = new THREE.BoxGeometry(0.06, 0.75, 0.06);
            for (let i = 0; i < 10; i++) {
                const x = (Math.random() - 0.5) * (roomSize - 4);
                const z = (Math.random() - 0.5) * (roomSize - 4);
                if (Math.abs(x) < 2.5 && Math.abs(z) < 2.5) continue;
                const rotY = Math.random() * Math.PI;

                const desk = new THREE.Mesh(deskGeo, deskMat);
                desk.position.set(x, 0.76, z);
                desk.rotation.y = rotY;
                desk.castShadow = true;
                desk.receiveShadow = true;
                scene.add(desk);
                /* Rotation-agnostic square collider big enough to cover the desk
                   footprint at any angle. */
                colliders.push({
                    min: { x: x - 0.9, z: z - 0.9 },
                    max: { x: x + 0.9, z: z + 0.9 },
                });

                [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].forEach(([lx, lz]) => {
                    const leg = new THREE.Mesh(legGeo, deskMat);
                    const cos = Math.cos(rotY), sin = Math.sin(rotY);
                    leg.position.set(x + lx * cos - lz * sin, 0.375, z + lx * sin + lz * cos);
                    leg.castShadow = true;
                    scene.add(leg);
                });

                const monitor = new THREE.Mesh(
                    new THREE.BoxGeometry(0.34, 0.24, 0.03),
                    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x1f3a22, emissiveIntensity: 0.5 })
                );
                monitor.position.set(x, 0.96, z);
                monitor.rotation.y = rotY;
                monitor.castShadow = true;
                scene.add(monitor);
            }

            roomBound = { minX: -roomSize / 2 + 0.6, maxX: roomSize / 2 - 0.6, minZ: -roomSize / 2 + 0.6, maxZ: roomSize / 2 - 0.6 };
            camera.position.set(0, 1.6, 6);
            figureSpawn = { x: roomBound.maxX - 1.0, z: roomBound.maxZ - 1.0 };
        }

        /* A still, watching presence in the far corner - the "statue": it only
           creeps closer while it's outside the player's view cone, and freezes
           the instant the player looks back at it. Built entirely from
           primitives (unlit pure-black material) so it reads as a flat,
           unsettling silhouette - no external model/texture assets needed. */
        let figure;
        {
            const figureMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            figure = new THREE.Group();

            const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.7, 8), figureMat);
            torso.position.y = 1.05;
            figure.add(torso);

            const shoulders = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.24), figureMat);
            shoulders.position.y = 1.38;
            figure.add(shoulders);

            const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), figureMat);
            head.position.y = 1.62;
            figure.add(head);

            const legGeoFigure = new THREE.CylinderGeometry(0.085, 0.09, 0.85, 6);
            const legL = new THREE.Mesh(legGeoFigure, figureMat);
            legL.position.set(-0.11, 0.425, 0);
            figure.add(legL);
            const legR = new THREE.Mesh(legGeoFigure, figureMat);
            legR.position.set(0.11, 0.425, 0);
            figure.add(legR);

            const armGeoFigure = new THREE.CylinderGeometry(0.06, 0.065, 0.68, 6);
            const armL = new THREE.Mesh(armGeoFigure, figureMat);
            armL.position.set(-0.32, 1.02, 0);
            armL.rotation.z = 0.1;
            figure.add(armL);
            const armR = new THREE.Mesh(armGeoFigure, figureMat);
            armR.position.set(0.32, 1.02, 0);
            armR.rotation.z = -0.1;
            figure.add(armR);

            figure.traverse((child) => {
                if (child.isMesh) child.castShadow = true;
            });
        }
        figure.position.set(figureSpawn.x, 0, figureSpawn.z);
        scene.add(figure);

        /* Push the player back out of any desk/cubicle/cabinet collider they'd
           otherwise walk into (2D, XZ-only - close enough for a walking sim where
           furniture blocks the floor regardless of exact height). */
        const PLAYER_RADIUS = 0.35;
        function resolvePlayerCollisions(pos) {
            for (const b of colliders) {
                const closestX = THREE.MathUtils.clamp(pos.x, b.min.x, b.max.x);
                const closestZ = THREE.MathUtils.clamp(pos.z, b.min.z, b.max.z);
                const dx = pos.x - closestX;
                const dz = pos.z - closestZ;
                const distSq = dx * dx + dz * dz;
                if (distSq < PLAYER_RADIUS * PLAYER_RADIUS) {
                    const dist = Math.sqrt(distSq) || 0.0001;
                    const push = (PLAYER_RADIUS - dist) / dist;
                    pos.x += dx * push;
                    pos.z += dz * push;
                }
            }
        }

        /* Ambient horror audio: low drone + random distant footsteps that quicken
           as the figure closes in, plus a jump-scare sting. */
        let audioCtx = null;
        let masterGain = null;
        let drone = null;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.55;
            masterGain.connect(audioCtx.destination);
            drone = eggStartDrone(audioCtx, masterGain);
        } catch (err) {
            audioCtx = null;
        }

        const scareFlashEl = document.getElementById("egg-scare-flash");
        if (scareFlashEl) scareFlashEl.classList.remove("active");
        let scareTriggered = false;
        let footstepTimer = 1.6 + Math.random();

        function isFigureVisible() {
            const camDir = new THREE.Vector3();
            camera.getWorldDirection(camDir);
            const flatCamDir = new THREE.Vector3(camDir.x, 0, camDir.z).normalize();
            const toFigure = new THREE.Vector3(
                figure.position.x - camera.position.x,
                0,
                figure.position.z - camera.position.z
            );
            if (toFigure.lengthSq() < 0.0001) return true;
            toFigure.normalize();
            return flatCamDir.angleTo(toFigure) < THREE.MathUtils.degToRad(28);
        }

        function triggerJumpScare() {
            if (scareTriggered) return;
            scareTriggered = true;
            eggPlayScare(audioCtx, masterGain);
            if (scareFlashEl) scareFlashEl.classList.add("active");
            flickerBase = 0;
            keys.w = keys.a = keys.s = keys.d = false;
            setTimeout(() => closeEasterEgg(), 1350);
        }

        /* Movement: WASD */
        const keys = { w: false, a: false, s: false, d: false };
        const onKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (k in keys) keys[k] = true;
            if (e.key === "Escape") closeEasterEgg();
        };
        const onKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (k in keys) keys[k] = false;
        };
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        /* Mouse-look via pointer lock. Start facing whichever direction had the
           most open space during spawn-point selection (see `initialYaw` above). */
        let yaw = initialYaw;
        let pitch = 0;
        const onMouseMove = (e) => {
            if (document.pointerLockElement !== canvas) return;
            yaw -= e.movementX * 0.0022;
            pitch -= e.movementY * 0.0022;
            pitch = Math.max(-1.2, Math.min(1.2, pitch));
        };
        document.addEventListener("mousemove", onMouseMove);
        const onCanvasClick = () => {
            if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
            if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
        };
        canvas.addEventListener("click", onCanvasClick);

        const clock = new THREE.Clock();
        let flickerT = 0;
        let rafId;

        function animate() {
            rafId = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.1);

            camera.rotation.order = "YXZ";
            camera.rotation.y = yaw;
            camera.rotation.x = pitch;

            const speed = 2.6 * dt;
            const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
            const right = new THREE.Vector3(Math.sin(yaw + Math.PI / 2), 0, Math.cos(yaw + Math.PI / 2));
            const move = new THREE.Vector3();
            if (keys.w) move.sub(forward);
            if (keys.s) move.add(forward);
            if (keys.a) move.sub(right);
            if (keys.d) move.add(right);
            if (move.lengthSq() > 0) {
                move.normalize().multiplyScalar(speed);
                camera.position.add(move);
                resolvePlayerCollisions(camera.position);
                camera.position.x = Math.max(roomBound.minX, Math.min(roomBound.maxX, camera.position.x));
                camera.position.z = Math.max(roomBound.minZ, Math.min(roomBound.maxZ, camera.position.z));
            }

            flickerT += dt;
            const noise = Math.sin(flickerT * 37) * Math.sin(flickerT * 5.2);
            flicker.intensity = flickerBase + noise * (flickerBase * 0.55) + (Math.random() < 0.035 ? -flickerBase * 0.85 : 0);

            /* Statue mechanic: creep closer while unseen, freeze while watched,
               jump-scare + lights-out once it reaches the player. */
            const distToFigure = camera.position.distanceTo(figure.position);
            if (!scareTriggered) {
                if (distToFigure <= 1.6) {
                    triggerJumpScare();
                } else {
                    if (!isFigureVisible()) {
                        const step = new THREE.Vector3(
                            camera.position.x - figure.position.x,
                            0,
                            camera.position.z - figure.position.z
                        );
                        if (step.lengthSq() > 0.0001) {
                            step.normalize().multiplyScalar(Math.min(1.5 * dt, distToFigure - 1.3));
                            figure.position.add(step);
                        }
                        figure.lookAt(camera.position.x, figure.position.y, camera.position.z);

                        footstepTimer -= dt;
                        if (footstepTimer <= 0) {
                            const proximity = THREE.MathUtils.clamp(1 - distToFigure / 15, 0, 1);
                            eggPlayFootstep(audioCtx, masterGain, 0.12 + proximity * 0.35);
                            footstepTimer = THREE.MathUtils.lerp(2.4, 0.4, proximity) + Math.random() * 0.5;
                        }
                    }
                    if (masterGain) {
                        const proximity = THREE.MathUtils.clamp(1 - distToFigure / 15, 0, 1);
                        masterGain.gain.value = 0.5 + proximity * 0.3;
                    }
                }
            }

            renderer.render(scene, camera);
        }
        animate();

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener("resize", onResize);

        function cleanup() {
            eggGameRunning = false;
            cancelAnimationFrame(rafId);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            document.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("click", onCanvasClick);
            window.removeEventListener("resize", onResize);
            if (document.pointerLockElement === canvas) document.exitPointerLock();
            renderer.dispose();
            if (scareFlashEl) scareFlashEl.classList.remove("active");
            if (audioCtx) {
                [drone && drone.osc, drone && drone.lfo, drone && drone.noiseSrc].forEach((node) => {
                    if (!node) return;
                    try { node.stop(); } catch (err) { /* already stopped */ }
                });
                audioCtx.close().catch(() => {});
            }
        }
        activeCleanup = cleanup;
    }

    function closeEasterEgg() {
        const overlay = document.getElementById("egg-overlay");
        if (activeCleanup) {
            activeCleanup();
            activeCleanup = null;
        }

        const gameEl = document.getElementById("egg-game");
        const typewriterEl = document.getElementById("egg-typewriter");
        const textEl = document.getElementById("egg-typewriter-text");
        gameEl.classList.remove("active");
        gameEl.innerHTML =
            '<canvas id="egg-canvas"></canvas>' +
            '<div class="egg-crosshair"></div>' +
            '<p class="egg-hud">WASD to move &middot; move mouse to look &middot; click to lock cursor &middot; Esc to leave</p>' +
            '<button class="egg-exit" id="egg-exit" aria-label="Leave the office">Esc — leave</button>' +
            '<div class="egg-scare-flash" id="egg-scare-flash"></div>';
        document.getElementById("egg-exit").addEventListener("click", () => closeEasterEgg());
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        typewriterEl.style.display = "";
        textEl.textContent = "";
        document.body.classList.remove("egg-open");
        document.body.style.overflow = "";
    }
})();
