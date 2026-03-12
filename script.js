// Garantimos que o código só rode após o HTML carregar e isolamos as variáveis
document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     NAVBAR SCROLL
  ============================================= */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => { 
      navbar.classList.toggle('scrolled', window.scrollY > 40); 
    });
  }

  /* =============================================
     MOBILE MENU
  ============================================= */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { 
      mobileMenu.classList.toggle('open'); 
    });
    
    // Mantemos a função global para os links do HTML (onclick="closeMobile()") funcionarem
    window.closeMobile = function() { 
      mobileMenu.classList.remove('open'); 
    };
  }

  /* =============================================
     STATUS DE FUNCIONAMENTO (ABERTO/FECHADO)
  ============================================= */
  function atualizarStatusFuncionamento() {
    const badge = document.getElementById('statusBadge');
    if (!badge) return;

    const agora = new Date();
    const diaSemana = agora.getDay();
    const hora = agora.getHours();

    let estaAberto = false;

    if (diaSemana === 0) {
      if (hora >= 10 && hora < 15) estaAberto = true;
    } else if (diaSemana === 2) {
      if (hora >= 17 && hora < 23) estaAberto = true;
    } else if (diaSemana >= 3 && diaSemana <= 6) {
      if (hora >= 10 && hora < 23) estaAberto = true;
    }

    if (estaAberto) {
      badge.innerHTML = '🟢 AGORA: ABERTO';
      badge.className = 'status-open';
    } else {
      badge.innerHTML = '🔴 AGORA: FECHADO';
      badge.className = 'status-closed';
    }
  }

  atualizarStatusFuncionamento();
  setInterval(atualizarStatusFuncionamento, 60000);
});