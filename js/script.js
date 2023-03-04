// Array of products
let products = [
    {
        product_name: "Gold Coin",
        product_price: "112.55",
        product_image: "img/laptop.jpg",
        added_to_cart: true,
        id: 1,
    },
    {
        product_name: "Silver Coin",
        product_price: "50.25",
        product_image: "img/monitor.jpg",
        added_to_cart: false,
        id: 2,
    },
    {
        product_name: "Platinum Coin",
        product_price: "225.80",
        product_image: "img/monitor2.jpg",
        added_to_cart: false,
        id: 3,
    },
    {
        product_name: "Diamond Ring",
        product_price: "999.99",
        product_image: "img/monitor3.jpg",
        added_to_cart: false,
        id: 4,
    },
    {
        product_name: "Emerald Earrings",
        product_price: "199.99",
        product_image: "img/monitor4.jpg",
        added_to_cart: false,
        id: 5,
    },
    {
        product_name: "Sapphire Necklace",
        product_price: "349.99",
        product_image: "img/monitor5.jpg",
        added_to_cart: false,
        id: 6,
    },
];
let cart = [];



// Check if products array is in localStorage and use it instead of default array
if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
} else {
    localStorage.setItem("products", JSON.stringify(products));
}

// Get the product cards container element
const productCardsContainer = document.getElementById("product-cards-container");

// function add to cart

function addToCart(product, cart, cartIconIndicator, addToCartButton, removeFromCartButton, alreadyInCart) {
    // Add the product to the cart array
    cart.push(product);
    // Update the cart icon
    cartIconIndicator.textContent = cart.length;
    // Update the added_to_cart property of the product to true
    product.added_to_cart = true;
    // Update the alreadyInCart variable for the product
    alreadyInCart = true;
    // Hide the Add to Cart button and show the Remove from Cart button
    addToCartButton.style.display = "none";
    removeFromCartButton.style.display = "block";
    // Update the styles for the corresponding main page button
    const mainPageButton = document.querySelector(`button.add-to-cart[data-id="${product.id}"]`);
    if (mainPageButton) {
        mainPageButton.style.display = "none";
        mainPageButton.nextElementSibling.style.display = "block";
    }
    // Render the cart items
    renderCartItems();
    localStorage.setItem("products", JSON.stringify(products));
}


// Function to remove product from cart
function removeFromCart(id) {
    // Find the index of the product in the cart array
    const index = cart.findIndex(p => p.id === parseInt(id));
    // Remove the product from the cart array
    cart.splice(index, 1);
    // Update the cart icon
    cartIconIndicator.textContent = cart.length;
    // Find the add to cart button with the same id and show it
    const addToCartButton = document.querySelector(`.add-to-cart[data-id="${id}"]`);
    addToCartButton.style.display = "block";
    // Find the remove from cart button with the same id and hide it
    const removeFromCartButton = document.querySelector(`.remove-from-cart[data-id="${id}"]`);
    removeFromCartButton.style.display = "none";
    // Find the product in the products array and set its added_to_cart property to false
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
        product.added_to_cart = false;
    }
    renderCartItems();
    localStorage.setItem("products", JSON.stringify(products));

}

// Loop through the products array and create a product card for each product
products.forEach((product, index) => {
    // Check if the product has already been added to cart
    const alreadyInCart = product.added_to_cart;

    // Create the product card element
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Create the product image element
    const productImage = document.createElement("img");
    productImage.src = product.product_image;
    productImage.alt = product.product_name;
    productCard.appendChild(productImage);

    // Create the product name element
    const productName = document.createElement("h2");
    productName.textContent = product.product_name;
    productCard.appendChild(productName);

    // Create the product price element
    const productPrice = document.createElement("p");
    productPrice.textContent = "$" + product.product_price;
    productCard.appendChild(productPrice);

    // create actions container
    const productActions = document.createElement("div");
    productActions.classList.add('product-actions')

    // Create the add to cart button element
    const addToCartButton = document.createElement("button");
    addToCartButton.setAttribute("data-id", product.id);
    addToCartButton.classList.add("add-to-cart");
    addToCartButton.textContent = "Add to Cart";
    addToCartButton.style.display = alreadyInCart ? "none" : "block";
    addToCartButton.addEventListener("click", () => {
        const product = products.find(p => p.id === parseInt(addToCartButton.getAttribute("data-id")));
        // Call the addToCart function with the necessary arguments
        addToCart(product, cart, cartIconIndicator, addToCartButton, removeFromCartButton);
    });
    productActions.appendChild(addToCartButton);


    // Create the remove from cart button element
    const removeFromCartButton = document.createElement("button");
    removeFromCartButton.setAttribute("data-id", product.id);
    removeFromCartButton.classList.add("remove-from-cart");
    removeFromCartButton.textContent = "Remove from Cart";
    removeFromCartButton.style.display = alreadyInCart ? "block" : "none";
    removeFromCartButton.addEventListener("click", () => {
        removeFromCart(product.id);
    });
    productActions.appendChild(removeFromCartButton);


    // Create the quick view button element
    const viewButton = document.createElement("button");
    viewButton.classList.add("view");
    viewButton.textContent = "Quick View";
    viewButton.addEventListener("click", (e) => {
        // Show the quick view modal
        viewModal.style.display = "block";

        // Check if the product is already in the cart
        const productInCart = cart.find(p => p.id === product.id);

        // Update the quick view modal content
        viewModalDetails.innerHTML = ` 
        <img src="${product.product_image}" alt="Gold Coin" id="view-modal-image">
        <h3>${product.product_name}</h3>
        <p>$${product.product_price}</p>
        <button class="add-to-cart" style="display: ${productInCart ? 'none' : 'block'}">
          Add to Cart
        </button>
        <button class="remove-from-cart" style="display: ${productInCart ? 'block' : 'none'}">
          Remove from Cart
        </button>
      `;

        // Add event listeners to the Add to Cart and Remove from Cart buttons
        const addToCartButton = viewModalDetails.querySelector('.add-to-cart');
        addToCartButton.addEventListener("click", () => {
            addToCart(product, cart, cartIconIndicator, addToCartButton, removeFromCartButton);
        });

        const removeFromCartButton = viewModalDetails.querySelector('.remove-from-cart');
        removeFromCartButton.addEventListener('click', () => {
            removeFromCart(product.id);
            addToCartButton.style.display = 'block';
            removeFromCartButton.style.display = 'none';
        });

        document.body.style.overflow = "hidden";
    });

    productActions.appendChild(viewButton);


    productCard.appendChild(productActions);
    // Append the product card to the product cards container
    productCardsContainer.appendChild(productCard);

    if (alreadyInCart) {
        cart.push(product);
    }
});



// Get the cart items div
const cartItemsDiv = document.querySelector('#cart-dropdown ');
// Function to render cart items
function renderCartItems() {
    // Clear the cart items div first
    cartItemsDiv.innerHTML = '';

    // Loop through the cart items and create the HTML for each item
    if (cart.length > 0) {
        for (let item of cart) {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');

            const img = document.createElement('img');
            img.src = item.product_image;
            img.alt = item.product_name;
            cartItemDiv.appendChild(img);

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('cart-item-details');

            const name = document.createElement('h3');
            name.innerText = item.product_name;
            detailsDiv.appendChild(name);

            const price = document.createElement('p');
            price.innerText = `$${item.product_price}`;
            detailsDiv.appendChild(price);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-from-cart');
            removeBtn.innerText = 'Remove from Cart';
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            detailsDiv.appendChild(removeBtn);

            cartItemDiv.appendChild(detailsDiv);

            cartItemsDiv.appendChild(cartItemDiv);
        }
    }
    else {
        cartItemsDiv.innerHTML = `<h3 class="text-center">Your cart is empty </h3>`;
    }

}

// Call the function initially to show the empty cart
renderCartItems();

// Get the quick view modal element and its content elements
const viewModal = document.getElementById("view-modal");
const viewModalDetails = document.querySelector("#view-modal .product-details");
const viewModalCloseButton = document.getElementById("view-modal-close-button");
const viewModalImage = document.getElementById("view-modal-image");
const viewModalName = document.getElementById("view-modal-name");
const viewModalPrice = document.getElementById("view-modal-price");
const viewModalAddToCartButton = document.querySelector("#view-modal .add-to-cart");
const viewModalRemoveFromCartButton = document.querySelector("#view-modal .remove-from-cart");

// Get the cart icon element and add a click event listener to show the cart icon dropdown
const cartIcon = document.getElementById("cart-icon");
const cartIconDropdown = document.getElementById("cart-dropdown");
const cartIconIndicator = document.getElementById("cart-icon-indicator");
cartIcon.addEventListener("click", () => {
    cartIconDropdown.classList.toggle("show");
});

// Update the cart icon indicator with the number of added to cart products
cartIconIndicator.textContent = getAddedToCartCount();



// Add a click event listener to the quick view modal close button to hide the modal
const viewModalOverlay = document.getElementById("view-modal-overlay");

function hideViewModal() {
    viewModal.style.display = "none";
    document.body.style.overflow = "visible";

}

viewModalOverlay.addEventListener("click", hideViewModal);
viewModalCloseButton.addEventListener("click", hideViewModal);




// Update the cart icon indicator with the number of added to cart products
cartIconIndicator.textContent = getAddedToCartCount();





function getAddedToCartCount() {
    let count = 0;
    products.forEach((product) => {
        if (product.added_to_cart) {
            count++;
        }
    });
    return count;
}




let toggleMenu = document.querySelector('#toggle-nav ')
let header = document.querySelector('header');

toggleMenu.addEventListener('click',()=>{
    header.classList.toggle('navshow')
})