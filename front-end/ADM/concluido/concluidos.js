document.addEventListener('DOMContentLoaded', () => {
    const gridPedidos = document.querySelector('.orders-grid');
    const contadorBadge = document.querySelector('.counter-badge span');

    // Busca os pedidos concluídos que foram salvos no localStorage
    const pedidosConcluidos = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];

    // Atualiza o contador da aba de concluídos
    if (contadorBadge) {
        contadorBadge.innerText = `${pedidosConcluidos.length} Pedidos finalizados`;
    }

    // Se não houver nenhum pedido concluído, pode exibir uma mensagem opcional
    if (pedidosConcluidos.length === 0) {
        gridPedidos.innerHTML = '<p style="color: #a1a1aa; grid-column: 1/-1; text-align: center;">Nenhum pedido concluído ainda.</p>';
        return;
    }

    // Renderiza cada pedido salvo na tela de concluídos
    pedidosConcluidos.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'order-card'; // Você pode criar uma classe .concluido no CSS se quiser mudar a cor de fundo dele
        
        let obsHTML = pedido.obs ? `<div class="order-obs">${pedido.obs}</div>` : '';

        card.innerHTML = `
            <div class="order-header">
                <span class="order-id">#${pedido.id}</span>
                <span class="order-time"><i class="fa-solid fa-circle-check" style="color: #f08400;"></i> Concluído às ${pedido.hora}</span>
            </div>
            <div class="order-body">
                <h3>${pedido.cliente}</h3>
                <p class="user-info">${pedido.info}</p>
                <hr>
                <ul class="items-list">
                    ${pedido.itens}
                </ul>
                ${obsHTML}
            </div>
            <div class="order-footer">
                <div class="total-price">${pedido.total}</div>
                <span style="color: #f17d00; font-weight: bold; font-size: 14px;"> Finalizado</span>
            </div>
        `;

        gridPedidos.appendChild(card);
    });
});