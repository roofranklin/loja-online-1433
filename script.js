const catalogoProduto = document.querySelector('#catalogo');
const formProduto = document.getElementById('form-produto');
const inputTitulo = document.getElementById('input-titulo');
const inputPreco = document.getElementById('input-preco');
const destaqueProduto = document.getElementById('destaque');

let listaDeProdutos = [];

function criarCardProduto(produto) {
    const card = document.createElement('article');
    card.className = 'card-produto col-sm-12 col-md-6 col-lg-3';
    
    const imagem = document.createElement('img');
    imagem.src = produto.image || 'https://picsum.photos/200/300';
    imagem.alt = produto.title;

    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;

    const preco = document.createElement('p');
    preco.textContent = `R$ ${Number(produto.price).toFixed(2)}`;

    const botaoDetalhes = document.createElement('button');
    botaoDetalhes.classList.add('btn', 'btn-info', 'mt-4');
    botaoDetalhes.textContent = 'Exibir detalhes';
    botaoDetalhes.addEventListener('click', () => {
        buscarDetalhesDoProduto(produto.id);
    });

    card.appendChild(imagem);
    card.appendChild(titulo);
    card.appendChild(preco);
    card.appendChild(botaoDetalhes);

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

// function buscarProdutosDaApi() {
//     fetch('https://fakestoreapi.com/products')
//     .then(response => response.json())
//     .then(produtos => {
//         listaDeProdutos = produtos;
//         renderizarProdutos();
//         salvarProdutosNoStorage();

//         const primeiroProdutoId = produtos[0].id;

//         // CÓDIGO FICANDO ANINHADO
//         fetch(`https://fakestoreapi.com/products/${primeiroProdutoId}`)
//         .then(response => response.json())
//         .then(destaqueProduto => {
//             console.log("Produto em Destaque: ", destaqueProduto);
//         });
//     })
//     .catch(erro => console.error('Erro ao buscar os produtos:', erro));
// }

// CÓDIGO DE BUSCA DA API REFATORADO
async function carregarProdutos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const produtos = await response.json();
        listaDeProdutos = produtos;

        // Limpa os containers antes de renderizar
        destaqueProduto.innerHTML = '';
        catalogoProduto.innerHTML = '';

        if(produtos.length > 0){

            const primeiroProdutoId = produtos[0].id;
            const responseDestaque = await fetch(`https://fakestoreapi.com/products/${primeiroProdutoId}`);
            if(!response.ok){
                throw new Error(`Erro HTTP ao buscar destaque: ${responseDestaque.status}`);
            }
            const produtoDestaque = await responseDestaque.json();

            const cardDestaque = criarCardProduto(produtoDestaque);
            destaqueProduto.appendChild(cardDestaque);
        }

        renderizarProdutos();
        salvarProdutosNoStorage();
    }
    catch (erro) {
        console.error("Ocorreu um erro na busca de produtos: ", erro);
        catalogoProduto.innerHTML = '<p class="error">Não foi possível carregar os produtos!</p>'
    }
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

async function buscarDetalhesDoProduto(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const produto = await response.json();
        console.log("Detalhes do produto: ", produto);
    }
    catch(erro) {
        console.error("Ocorreu um erro na busca dos detalhes do produto:", erro);
    }
}


window.onload = function() {
    const produtosSalvos = localStorage.getItem('produtos');
    if (produtosSalvos) {
        listaDeProdutos = JSON.parse(produtosSalvos);

        // Renderiza o primeiro produto a partir do storage
        if(listaDeProdutos.length > 0) {
            destaqueProduto.innerHTML = '';
            const cardDestaque = criarCardProduto(listaDeProdutos[0]);
            destaqueProduto.appendChild(cardDestaque);
        }

        // Renderiza o restante do catálogo
        renderizarProdutos();
    } else {
        carregarProdutos(); // Só busca se tiver vazio
    }
}
