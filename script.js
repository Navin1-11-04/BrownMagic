const spinner = document.querySelector('.spinner-wrapper');

window.addEventListener('load', () => {
    if (spinner) {
        spinner.style.opacity = '0';

        setTimeout(() => {
            spinner.style.display = 'none';
        }, 2000);
    }
});

let listProductHtml = document.querySelector('.beverages');
let listSnacksHtml = document.querySelector('.snacks');
let listProducts = [];
let listCartHTML = document.querySelector('.cart-list');
let iconCartSpan = document.querySelector('.icon-cart .btn span');
let carts = [];

const addDataToHTML = (products, targetHtmlElement) => {
    targetHtmlElement.innerHTML = '';
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('b1');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="..">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalprice">$${product.price}</div>
                <button class="tocart">Add to Cart</button>
            `;
            targetHtmlElement.appendChild(newProduct);
        });
    }
};

const addSnacksToHTML = (products, targetHtmlElement) => {
    targetHtmlElement.innerHTML = '';
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('s1');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="..">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalprice">$${product.price}</div>
                <button class="tocart">Add to Cart</button>
            `;
            targetHtmlElement.appendChild(newProduct);
        });
    }
};

listProductHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('tocart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

listSnacksHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('tocart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

const addToCart = (product_id) => {
    let positionThisProduct = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionThisProduct < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProduct].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (carts.length > 0) {
        carts.forEach((cart) => {
            totalQuantity += cart.quantity;

            let newCart = document.createElement('div');
            newCart.classList.add('cart-item-inner');
            newCart.dataset.id = cart.product_id;

            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];

            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="...">
                </div>
                <div class="name"><h6>${info.name}</h6></div>
                <div class="totalprice"><h6>$${info.price * cart.quantity}</h6></div>
                <div class="quantity"><h6>
                    <span class="minus">-</span>
                    <span class="quantity-value">${cart.quantity}</span>
                    <span class="plus">+</span></h6>
                </div>`;

            listCartHTML.appendChild(newCart);
        });
    }

    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.closest('.cart-item-inner').dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(product_id, type);
        let quantityElement = positionClick.closest('.quantity').querySelector('.quantity-value');
        if (quantityElement && carts.find((cart) => cart.product_id == product_id)) {
            quantityElement.innerText = carts.find((cart) => cart.product_id == product_id).quantity;
        }
    }
});

const changeQuantity = (product_id, type) => {
    let positionIteminCart = carts.findIndex((value) => value.product_id == product_id);

    if (positionIteminCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionIteminCart].quantity += 1;
                break;

            default:
                let valueChange = carts[positionIteminCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionIteminCart].quantity = valueChange;
                } else {
                    carts.splice(positionIteminCart, 1);
                }
                break;
        }

        addCartToMemory();
        addCartToHTML();
    }
};

const initApp = () => {
    Promise.all([
        fetch('beverages.json').then(response => response.json()),
        fetch('snacks.json').then(response => response.json())
    ])
    .then(([beveragesData, snacksData]) => {
        const beverages = beveragesData;
        const snacks = snacksData;

        listProducts = [...beverages, ...snacks];
        addDataToHTML(beverages, listProductHtml);
        addSnacksToHTML(snacks, listSnacksHtml);

        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    .catch(error => console.error('Error fetching data:', error));
};
initApp();
