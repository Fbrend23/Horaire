export function triggerConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
  
    // Générer 100 paillettes
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
  
      // Position aléatoire
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random()}s`;
      confetti.style.backgroundColor = randomColor();
  
      confettiContainer.appendChild(confetti);
    }
  
    document.body.appendChild(confettiContainer);
  
    // Nettoyage après animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 3000);
  }
  
  function randomColor() {
    const colors = ["#ff0", "#f0f", "#0ff", "#f88", "#8f8", "#88f"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  export function launchFireworks() {
    var duration = 10 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
    
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
    
      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}


let raveInterval = null;
export function startRave() {
    if (raveInterval) return; // évite de lancer plusieurs fois
    
    
  const image = document.getElementById("linkGif");
  image.classList.remove("hidden");


  raveInterval = setInterval(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Clignotement
    document.querySelectorAll("*").forEach((el) => {
      el.style.color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    });
  }, 150);
}

export function stopRave() {
  clearInterval(raveInterval);
  raveInterval = null;
  const image = document.getElementById("linkGif");
  image.classList.add("hidden");
  document.body.classList.remove("rave-mode");
  document.body.style.backgroundColor = ""; // reset

  document.querySelectorAll("*").forEach((el) => {
    el.style.color = ""; // reset couleur texte
  });
}