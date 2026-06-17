document.addEventListener('DOMContentLoaded', () => {
    const botoesConcluir = document.querySelectorAll('.btn-concluir');
    const contadorNumero = document.getElementById('qtd-pendentes');

    // Função interna para atualizar o número de forma dinâmica
    const atualizarContador = () => {
        if (contadorNumero) {
            const pedidosRestantes = document.querySelectorAll('.order-card').length;
            contadorNumero.innerText = pedidosRestantes;
        }
    };

    // Atualiza o valor assim que a página carrega (caso algum card já tenha sido removido)
    atualizarContador();

    botoesConcluir.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const cardPedido = e.target.closest('.order-card');
            const idPedido = cardPedido.getAttribute('data-id');
            
            // Captura os dados do card para enviar para a outra página
            const nomeCliente = cardPedido.querySelector('.order-body h3').innerText;
            const infoCliente = cardPedido.querySelector('.user-info').innerHTML;
            const itensLista = cardPedido.querySelector('.items-list').innerHTML;
            const precoTotal = cardPedido.querySelector('.total-price').innerText;
            
            const obsDiv = cardPedido.querySelector('.order-obs');
            const observacao = obsDiv ? obsDiv.innerHTML : null;

            const pedidoConcluido = {
                id: idPedido,
                cliente: nomeCliente,
                info: infoCliente,
                itens: itensLista,
                total: precoTotal,
                obs: observacao,
                hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };

            // Salva no localStorage
            let concluidos = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];
            concluidos.push(pedidoConcluido);
            localStorage.setItem('pedidosConcluidos', JSON.stringify(concluidos));

            // Efeito visual de sumir
            cardPedido.style.transition = 'all 0.3s ease';
            cardPedido.style.opacity = '0';
            cardPedido.style.transform = 'scale(0.9)';
            
            // Remove do HTML e recalcula o contador instantaneamente
            setTimeout(() => {
                cardPedido.remove();
                atualizarContador();
            }, 300);
        });
    });
});