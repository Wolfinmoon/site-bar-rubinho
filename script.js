// =============================================
// INICIALIZAÇÃO (Roda quando o site carrega)
// =============================================
document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navbar Scroll ----- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => { 
      navbar.classList.toggle('scrolled', window.scrollY > 40); 
    });
  }

  /* ----- Menu Mobile ----- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { 
      mobileMenu.classList.toggle('open'); 
    });
    
    // Deixa o fecharMobile acessível para o HTML
    window.closeMobile = function() { 
      mobileMenu.classList.remove('open'); 
    };
  }

  /* ----- Status do Horário ----- */
  function atualizarStatusFuncionamento() {
    const badge = document.getElementById('statusBadge');
    if (!badge) return;

    const agora = new Date();
    const diaSemana = agora.getDay();
    const hora = agora.getHours();
    let estaAberto = false;

    if (diaSemana === 0) { // Dom
      if (hora >= 10 && hora < 15) estaAberto = true;
    } else if (diaSemana === 2) { // Ter
      if (hora >= 17 && hora < 23) estaAberto = true;
    } else if (diaSemana >= 3 && diaSemana <= 6) { // Qua a Sáb
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
  
  // Inicializa o carrinho ao carregar a página
  atualizarCarrinho();
});


// =============================================
// LÓGICA DO CARRINHO E MODAL (Livres no escopo)
// =============================================
let carrinho = [];

function abrirModal() {
  const modal = document.getElementById('menuModal');
  if (modal) modal.classList.add('active');
}

function fecharModal() {
  const modal = document.getElementById('menuModal');
  if (modal) modal.classList.remove('active');
}

function adicionarAoCarrinho(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
  }
  atualizarCarrinho();
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1); // Remove do carrinho se a qtd chegar a zero
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotalValue');
  const btnFinalizar = document.getElementById('btnFinalizar');
  
  if (!container || !totalEl || !btnFinalizar) return; // Proteção extra

  container.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#999; margin-top: 10px;">Seu carrinho está vazio.</p>';
    totalEl.innerText = 'R$ 0,00';
    btnFinalizar.disabled = true;
    return;
  }

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;
    const precoFormatado = (item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    container.innerHTML += `
      <div class="cart-item">
        <span>${item.nome}</span>
        <div class="cart-item-controls">
          <button class="cart-btn" onclick="alterarQuantidade(${index}, -1)">-</button>
          <span>${item.quantidade}</span>
          <button class="cart-btn" onclick="alterarQuantidade(${index}, 1)">+</button>
          <strong style="margin-left:8px;">${precoFormatado}</strong>
        </div>
      </div>
    `;
  });

  totalEl.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  btnFinalizar.disabled = false;
}

function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) return;

  const numeroWhatsApp = "5534999999999"; // Coloque o número do bar aqui depois
  
  let mensagem = "*Novo Pedido - Site*\n\n";
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    mensagem += `${item.quantidade}x ${item.nome} - ${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
  });

  mensagem += `\n*Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`;
  mensagem += "\n\nPor favor, me informe o tempo de entrega e a chave PIX!";

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}