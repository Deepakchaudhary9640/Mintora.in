// Paste the shared checkout/payment URL here.
const CHECKOUT_URL = "";

document.querySelectorAll("[data-checkout-link]").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        if (!CHECKOUT_URL.trim()) {
            window.alert("Add your checkout URL to CHECKOUT_URL in script.js.");
            return;
        }

        const checkoutUrl = new URL(CHECKOUT_URL);
        if (checkoutUrl.protocol !== "https:" && checkoutUrl.protocol !== "http:") {
            window.alert("CHECKOUT_URL must start with http:// or https://.");
            return;
        }

        window.location.assign(checkoutUrl.href);
    });
});

const slider = document.querySelector("[data-slider]");

if (slider) {
    const track = slider.querySelector("[data-slider-track]");
    const slides = Array.from(track.querySelectorAll(".slider-slide"));
    const dotsContainer = slider.querySelector("[data-slider-dots]");
    const previousButton = slider.querySelector("[data-slider-prev]");
    const nextButton = slider.querySelector("[data-slider-next]");
    const status = slider.querySelector("[data-slider-status]");
    const autoplayDelay = 4000;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let scrollFrame = 0;
    let autoplayInterval;

    const dots = slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.className = "slider-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Show photo ${index + 1}`);
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.append(dot);
        return dot;
    });

    function updateControls(index) {
        activeIndex = index;
        dots.forEach((dot, dotIndex) => {
            dot.setAttribute("aria-current", String(dotIndex === activeIndex));
        });
        previousButton.disabled = slides.length < 2;
        nextButton.disabled = slides.length < 2;
        status.textContent = `Photo ${activeIndex + 1} of ${slides.length}`;
    }

    function startAutoplay() {
        window.clearInterval(autoplayInterval);
        if (document.hidden || slides.length < 2) return;
        autoplayInterval = window.setInterval(goToNextSlide, autoplayDelay);
    }

    function goToSlide(index) {
        const nextIndex = (index + slides.length) % slides.length;
        track.scrollTo({
            left: slides[nextIndex].offsetLeft,
            behavior: reducedMotion.matches ? "instant" : "smooth"
        });
        updateControls(nextIndex);
    }

    function goToNextSlide() {
        const isWrappingToFirst = activeIndex === slides.length - 1;
        const nextIndex = isWrappingToFirst ? 0 : activeIndex + 1;

        track.scrollTo({
            left: slides[nextIndex].offsetLeft,
            behavior: isWrappingToFirst || reducedMotion.matches ? "instant" : "smooth"
        });
        updateControls(nextIndex);
    }

    previousButton.addEventListener("click", () => goToSlide(activeIndex - 1));
    nextButton.addEventListener("click", goToNextSlide);

    track.addEventListener("scroll", () => {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = requestAnimationFrame(() => {
            const index = slides.reduce((closestIndex, slide, slideIndex) => {
                const currentDistance = Math.abs(slide.offsetLeft - track.scrollLeft);
                const closestDistance = Math.abs(slides[closestIndex].offsetLeft - track.scrollLeft);
                return currentDistance < closestDistance ? slideIndex : closestIndex;
            }, 0);
            updateControls(index);
        });
    }, { passive: true });

    document.addEventListener("visibilitychange", startAutoplay);

    updateControls(0);
    startAutoplay();
}

const countdown = document.querySelector("[data-countdown]");

if (countdown) {
    const hoursElement = countdown.querySelector("[data-countdown-hours]");
    const minutesElement = countdown.querySelector("[data-countdown-minutes]");
    const secondsElement = countdown.querySelector("[data-countdown-seconds]");
    const durationSeconds = 10 * 60;
    const deadline = Date.now() + durationSeconds * 1000;

    function updateCountdown() {
        const remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

        if (remainingSeconds === 0) {
            countdown.setAttribute("aria-label", "Offer countdown ended");
            window.clearInterval(countdownInterval);
        }
    }

    updateCountdown();
    const countdownInterval = window.setInterval(updateCountdown, 1000);
}