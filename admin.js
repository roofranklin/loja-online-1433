document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

async function carregarProdutos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products')
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const produtos = await response.json();

        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = ''// Limpa os dados anteriores

        produtos.forEach(produto => {
            adicionarLinhaProduto(produto);
        })
    } catch (error) {
        console.error('Falha ao carregar produtos: ', error);
    }
}

function adicionarLinhaProduto(produto) {
    const tbody = document.getElementById('products-table-body');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.title}</td>
        <td>R$ ${produto.price.toFixed(2)}</td>
        <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${produto.id}">Editar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${produto.id}">Deletar</button>
        </td>
    `
    tbody.appendChild(tr);
}


// ADICIONANDO UM PRODUTO
const addProductBtn = document.getElementById('add-product-btn');
const productModalElement = document.getElementById('product-modal');
const productModal = new bootstrap.Modal(productModalElement); // Instância do Boostrap para abrir modal
const productForm = document.getElementById('product-form');
const productModalLabel = document.getElementById('product-modal-label');
const productTitleInput = document.getElementById('product-title');
const productPriceInput = document.getElementById('product-price');

// Abre a modal para adicionar novo produto
addProductBtn.addEventListener('click', () => {
    productModalLabel.textContent = 'Adicionar novo produto';
    productForm.reset(); // Limpa campos de uso anterior
    productModal.show(); 
});

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const produto = {
        title: productTitleInput.value,
        price: parseFloat(productPriceInput.value),
        description: 'Descrição Demonstrativa',
        image: 'https://i.pravatar.cc',
        category: 'eletronicos'
    }

    await adicionarProduto(produto);
});

async function adicionarProduto(produto) {
    try {
        const response = await fetch('https://fakestoreapi.com/products', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json'
           },
           body: JSON.stringify(produto)
        });
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const produtoAdicionado = await response.json();
        adicionarLinhaProduto(produtoAdicionado);

        productModal.hide(); // Fecha a modal

    } catch(error) {
        console.error('Falha ao adicionar produto: ', error);
    }
}