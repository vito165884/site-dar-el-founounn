const counters = document.querySelectorAll(".counter");

const startCounting = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let count = 0;

    const update = () => {
      const increment = target / 100;

      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        setTimeout(update, 20);
      } else {
        counter.innerText = target;
      }
    };

    update();
  });
};


// 🔥 déclenchement au scroll
let started = false;

window.addEventListener("scroll", () => {
  const section = document.querySelector(".stats");

  if (!started && section.getBoundingClientRect().top < window.innerHeight) {
    startCounting();
    started = true;
  }
});