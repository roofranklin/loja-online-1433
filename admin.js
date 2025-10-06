document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

const tbody = document.getElementById('products-table-body');

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

tbody.addEventListener('click', async (event) => {
    const target = event.target;

    if(target.classList.contains('edit-btn')) {
        const id = target.dataset.id;
        await abrirModalEdicao(id);
    }

    if(target.classList.contains('delete-btn')) {
        const id = target.dataset.id;
        const confirmacao = confirm('Tem certeza que deseja deletar esse produto?');
        if(confirmacao){
            await deletarProduto(id);
            target.closest('tr').remove();
        }
    }
})

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const produtoAtualizado = {
        title: productTitleInput.value,
        price: parseFloat(productPriceInput.value),
        description: 'Descrição Demonstrativa',
        image: 'https://i.pravatar.cc',
        category: 'eletronicos'
    }

    const id = productForm.dataset.editingId;

    if(id) {
        await atualizarProduto(id, produtoAtualizado);
    } else {
        await adicionarProduto(produto);
    }
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

function adicionarLinhaProduto(produto) {
    const tr = document.createElement('tr');
    tr.dataset.productId = produto.id; 

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

async function abrirModalEdicao(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const produto = await response.json();

        productModalLabel.textContent = 'Editar Produto';
        productTitleInput.value = produto.title;
        productPriceInput.value = produto.price;
        productForm.dataset.editingId = id; // Armazena o ID no formulário

        productModal.show();

    } catch(error) {
        console.error(`Falha ao buscar o produto ID: ${id}`, error);
    }
}

async function atualizarProduto(id, dados) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`,{
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(dados)
        });
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const produtoRetornado = await response.json();

        const tr = tbody.querySelector(`tr[data-product-id='${id}']`);
        if(tr) {
            tr.querySelector('.product-title').textContent = produtoRetornado.title;
            tr.querySelector('.product-price').textContent = `R$ ${produtoRetornado.price.toFixed(2)}`;
        }

        productModal.hide();
        delete productForm.dataset.editingId; // Limpa o ID dessa edição
    } catch(error) {

    }
}

async function deletarProduto(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: 'DELETE'
        });
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        console.log(`Produto ${id} removido com sucesso!`);
    } catch (error) {
        console.error(`Falha ao deletar o produto ${id}`);
    }
}
