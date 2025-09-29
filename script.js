const catalogoProduto = document.querySelector('#catalogo');
const formProduto = document.getElementById('form-produto');
const inputTitulo = document.getElementById('input-titulo');
const inputPreco = document.getElementById('input-preco');

let listaDeProdutos = [];

function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'card-produto';
    
    const imagem = document.createElement('img');
    imagem.src = produto.image || 'https://picsum.photos/200/300';
    imagem.alt = produto.title;

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;

    const preco = document.createElement('p');
    preco.textContent = `R$ ${Number(produto.price).toFixed(2)}`;

    card.appendChild(imagem);
    card.appendChild(titulo);
    card.appendChild(preco);

    return card;
}

function renderizarProdutos() {
    catalogoProduto.innerHTML = '' //Limpa o catálogo visual
    listaDeProdutos.forEach(produto => {
        const card = criarCardProduto(produto);
        catalogoProduto.appendChild(card);
    }) 
}

function salvarProdutosNoStorage() {
    localStorage.setItem('produtos', JSON.stringify(listaDeProdutos));
}

function buscarProdutosDaApi() {
    fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(produtos => {
        listaDeProdutos = produtos;
        renderizarProdutos();
        salvarProdutosNoStorage();
    })
    .catch(erro => console.error('Erro ao buscar os produtos:', erro));
}

formProduto.addEventListener('submit', function(event){
    event.preventDefault();
    const tituloDigitado = inputTitulo.value.trim();
    const precoDigitado = inputPreco.value;

    if(tituloDigitado && precoDigitado){
        const novoProduto = {
            id: Date.now(),
            title: tituloDigitado,
            price: precoDigitado,
            image: ''
        };
        listaDeProdutos.push(novoProduto);
        renderizarProdutos();
        salvarProdutosNoStorage();
        inputTitulo.value = '';
        inputPreco.value = '';
    }
})


window.onload = function() {
    const produtosSalvos = localStorage.getItem('produtos');
    if (produtosSalvos) {
        listaDeProdutos = JSON.parse(produtosSalvos);
        renderizarProdutos();
    } else {
        buscarProdutosDaApi(); // Só busca se tiver vazio
    }
}
