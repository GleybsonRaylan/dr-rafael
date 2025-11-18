// Loading Screen
window.addEventListener("load", function () {
  const loadingScreen = document.querySelector(".loading-screen");
  const loadingProgress = document.querySelector(".loading-progress");

  // Simular progresso do loading
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      // Animação de conclusão
      setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }, 300);
    }
    loadingProgress.style.width = progress + "%";
  }, 200);
});

// Menu Hamburguer
const hamburger = document.querySelector(".hamburger");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navList.classList.toggle("active");
  document.body.classList.toggle("menu-open");
});

// Fechar menu ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navList.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
});

// Header scroll effect
const header = document.querySelector(".header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");

    // Hide header on scroll down
    if (window.scrollY > lastScrollY) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }
  } else {
    header.classList.remove("scrolled");
    header.style.transform = "translateY(0)";
  }

  lastScrollY = window.scrollY;

  // Scroll to top button
  const scrollTop = document.querySelector(".scroll-top");
  if (window.scrollY > 500) {
    scrollTop.classList.add("visible");
  } else {
    scrollTop.classList.remove("visible");
  }
});

// Scroll to top functionality
document.querySelector(".scroll-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Animação de revelação ao scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observar elementos para animação
document
  .querySelectorAll(
    ".servico-card, .detail-card, .galeria-item, .video-card, .depoimento-card"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Carousel de Depoimentos
class DepoimentosCarousel {
  constructor() {
    this.track = document.querySelector(".carousel-track");
    this.slides = document.querySelectorAll(".depoimento-slide");
    this.dots = document.querySelectorAll(".dot");
    this.prevBtn = document.querySelector(".galeria-prev");
    this.nextBtn = document.querySelector(".galeria-next");
    this.currentSlide = 0;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    // Event listeners
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Auto play
    this.startAutoPlay();

    // Pause on hover
    this.track?.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.track?.addEventListener("mouseleave", () => this.startAutoPlay());

    // Touch/swipe support
    this.addTouchSupport();
  }

  updateCarousel() {
    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    // Update active states
    this.slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlide);
    });

    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  }

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateCarousel();
  }

  prev() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.next(), 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  addTouchSupport() {
    if (!this.track) return;

    let startX = 0;
    let currentX = 0;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.track.addEventListener("touchmove", (e) => {
      currentX = e.touches[0].clientX;
    });

    this.track.addEventListener("touchend", () => {
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        // Minimum swipe distance
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }
}

class ImageComparison {
  constructor(container) {
    this.container = container;
    this.slider = container.querySelector(".comparison-slider");
    this.beforeImg = container.querySelector(".comparison-before");
    this.isDragging = false;

    this.init();
  }

  init() {
    this.container.addEventListener("mousedown", (e) => this.startDrag(e));
    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", () => this.stopDrag());

    this.container.addEventListener("touchstart", (e) =>
      this.startDrag(e.touches[0])
    );
    document.addEventListener("touchmove", (e) => this.drag(e.touches[0]));
    document.addEventListener("touchend", () => this.stopDrag());

    this.container.addEventListener("click", (e) => {
      if (!this.isDragging) {
        this.setPosition(e.clientX);
      }
    });
  }

  startDrag(e) {
    this.isDragging = true;
    this.container.style.cursor = "grabbing";
    this.setPosition(e.clientX);
  }

  drag(e) {
    if (!this.isDragging) return;
    this.setPosition(e.clientX);
  }

  stopDrag() {
    this.isDragging = false;
    this.container.style.cursor = "col-resize";
  }

  setPosition(x) {
    const rect = this.container.getBoundingClientRect();
    const position = ((x - rect.left) / rect.width) * 100;
    const clampedPosition = Math.max(0, Math.min(100, position));

    this.beforeImg.style.clipPath = `polygon(0 0, ${clampedPosition}% 0, ${clampedPosition}% 100%, 0 100%)`;
    this.slider.style.left = `${clampedPosition}%`;
  }
}

// Initialize image comparisons
document.querySelectorAll(".image-comparison").forEach((comparison) => {
  new ImageComparison(comparison);
});

// Formulário de Contato
const formContato = document.getElementById("form-contato");

if (formContato) {
  formContato.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const tratamento = document.getElementById("tratamento").value;
    const mensagem = document.getElementById("mensagem").value;

    // Validação
    if (!nome || !telefone || !tratamento) {
      showNotification(
        "Por favor, preencha todos os campos obrigatórios.",
        "error"
      );
      return;
    }

    // Formatar mensagem para WhatsApp
    const texto = `🦷 *Consulta - Dr. Rafael Ferreira*

*Nome:* ${nome}
*Telefone:* ${telefone}
*Tratamento de interesse:* ${tratamento}
${mensagem ? `*Mensagem:* ${mensagem}` : ""}

_*Estou interessado(a) em agendar uma consulta!*_`;

    // Codificar mensagem para URL
    const textoCodificado = encodeURIComponent(texto);

    // Redirecionar para WhatsApp
    window.open(
      `https://wa.me/5581999680343?text=${textoCodificado}`,
      "_blank"
    );

    // Feedback visual
    showNotification("Redirecionando para o WhatsApp...", "success");

    // Reset form
    setTimeout(() => {
      formContato.reset();
    }, 1000);
  });
}

// Máscara para telefone
const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    e.target.value = value;
  });
}

// Sistema de Notificações
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

  // Estilos da notificação
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        width: 90vw;
    `;

  document.body.appendChild(notification);

  // Animação de entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remover após 5 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  };
  return icons[type] || "info-circle";
}

function getNotificationColor(type) {
  const colors = {
    success: "linear-gradient(135deg, #10B981, #059669)",
    error: "linear-gradient(135deg, #EF4444, #DC2626)",
    warning: "linear-gradient(135deg, #F59E0B, #D97706)",
    info: "linear-gradient(135deg, #3B82F6, #2563EB)",
  };
  return colors[type] || colors.info;
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Efeitos de hover nas imagens
document.querySelectorAll(".hero-photo, .sobre-photo").forEach((img) => {
  img.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05)";
  });

  img.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
});

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar carousel de depoimentos
  new DepoimentosCarousel();

  // Adicionar classe de animação aos elementos iniciais
  setTimeout(() => {
    document.querySelectorAll(".detail-card").forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("animate-in");
      }, index * 200);
    });
  }, 500);

  // Contador animado para estatísticas
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumbers();
        statsObserver.disconnect();
      }
    });
  });

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  function animateNumbers() {
    statNumbers.forEach((stat) => {
      const targetText = stat.textContent;
      const isPlus = targetText.includes("+");
      const target = parseInt(targetText.replace("+", "")) || 0;
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + (isPlus ? "+" : "");
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + (isPlus ? "+" : "");
        }
      }, 30);
    });
  }
});

// Prevenir comportamento padrão de formulário
document.addEventListener("submit", function (e) {
  if (e.target.tagName === "FORM") {
    e.preventDefault();
  }
});

// Otimização de performance
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    // Recarregar funcionalidades que dependem do tamanho da tela
  }, 250);
});

// CORREÇÃO: Prevenir qualquer scroll horizontal
window.addEventListener("scroll", function () {
  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY);
  }
});

// CORREÇÃO: Garantir que imagens não causem overflow
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("load", function () {
    if (this.naturalWidth > window.innerWidth) {
      this.style.maxWidth = "100%";
      this.style.height = "auto";
    }
  });
});
// Sistema de Comparação de Imagens - COMPLETAMENTE REFEITO
class ImageComparisonSlider {
  constructor(container) {
    this.container = container;
    this.slider = container.querySelector(".comparison-slider");
    this.afterImage = container.querySelector(".comparison-after");
    this.isDragging = false;

    this.init();
  }

  init() {
    // Event listeners para desktop
    this.slider.addEventListener("mousedown", (e) => this.startDrag(e));
    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", () => this.stopDrag());

    // Event listeners para mobile
    this.slider.addEventListener("touchstart", (e) =>
      this.startDrag(e.touches[0])
    );
    document.addEventListener("touchmove", (e) => this.drag(e.touches[0]));
    document.addEventListener("touchend", () => this.stopDrag());

    // Clique para definir posição
    this.container.addEventListener("click", (e) => {
      if (!this.isDragging) {
        this.setPosition(e.clientX || e.touches[0].clientX);
      }
    });

    // Posição inicial
    this.setPositionToCenter();
  }

  startDrag(e) {
    this.isDragging = true;
    this.container.style.cursor = "grabbing";
    this.slider.style.cursor = "grabbing";
    this.setPosition(e.clientX);
  }

  drag(e) {
    if (!this.isDragging) return;
    this.setPosition(e.clientX);
  }

  stopDrag() {
    this.isDragging = false;
    this.container.style.cursor = "col-resize";
    this.slider.style.cursor = "grab";
  }

  setPosition(x) {
    const rect = this.container.getBoundingClientRect();
    const position = ((x - rect.left) / rect.width) * 100;
    const clampedPosition = Math.max(5, Math.min(95, position));

    this.afterImage.style.width = `${clampedPosition}%`;
    this.slider.style.left = `${clampedPosition}%`;
  }

  setPositionToCenter() {
    this.afterImage.style.width = "50%";
    this.slider.style.left = "50%";
  }
}

// Sistema de Carrossel para Galeria
class GaleriaCarousel {
  constructor() {
    this.galeria = document.querySelector(".galeria");
    this.items = document.querySelectorAll(".galeria-item");
    this.prevBtn = document.querySelector(".galeria-prev");
    this.nextBtn = document.querySelector(".galeria-next");
    this.indicators = document.querySelectorAll(".galeria-indicator");
    this.currentIndex = 0;
    this.itemsPerView = this.getItemsPerView();

    this.init();
  }

  init() {
    // Event listeners
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    // Redimensionamento
    window.addEventListener("resize", () => this.handleResize());

    // Inicializar
    this.updateCarousel();
  }

  getItemsPerView() {
    const width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 992) return 2;
    return 3;
  }

  handleResize() {
    this.itemsPerView = this.getItemsPerView();
    this.updateCarousel();
  }

  updateCarousel() {
    // Em telas grandes, mostrar todos os itens
    if (window.innerWidth >= 992) {
      this.items.forEach((item) => (item.style.display = "block"));
      return;
    }

    // Em telas menores, implementar carrossel
    this.items.forEach((item, index) => {
      if (
        index >= this.currentIndex &&
        index < this.currentIndex + this.itemsPerView
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    // Atualizar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle(
        "active",
        index === Math.floor(this.currentIndex / this.itemsPerView)
      );
    });
  }

  next() {
    const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
    this.currentIndex = Math.min(
      this.currentIndex + this.itemsPerView,
      maxIndex
    );
    this.updateCarousel();
  }

  prev() {
    this.currentIndex = Math.max(0, this.currentIndex - this.itemsPerView);
    this.updateCarousel();
  }

  goToSlide(slideIndex) {
    this.currentIndex = slideIndex * this.itemsPerView;
    this.updateCarousel();
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar sliders de comparação
  document.querySelectorAll(".comparison-container").forEach((container) => {
    new ImageComparisonSlider(container);
  });

  // Inicializar carrossel da galeria (apenas em mobile/tablet)
  if (window.innerWidth < 992) {
    new GaleriaCarousel();
  }

  // Re-inicializar carrossel ao redimensionar
  window.addEventListener("resize", function () {
    if (
      window.innerWidth < 992 &&
      !document.querySelector(".galeria").dataset.carouselInitialized
    ) {
      new GaleriaCarousel();
      document.querySelector(".galeria").dataset.carouselInitialized = true;
    }
  });
});

// Efeito de hover suave nas imagens
document.querySelectorAll(".image-comparison").forEach((comparison) => {
  comparison.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.transition = "transform 0.3s ease";
  });

  comparison.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
});
