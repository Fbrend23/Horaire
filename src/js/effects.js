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
  