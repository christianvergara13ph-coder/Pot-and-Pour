/* =========================================================
   CART DATA
   ========================================================= */

let cart = [];


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    name,
    price,
    option,
    image
) {

    const existing = cart.find(
        item =>
            item.name === name &&
            item.option === option
    );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name,
            price,
            option,
            image,
            quantity: 1
        });

    }


    updateCart();

    showToast(
        name + " added to your order ✨"
    );

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    const totalItems =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;

    cartTotal.textContent =
        "₱" + total;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🪴
                </div>

                <p>
                    Your little basket is empty.
                </p>

                <small>
                    Add a matcha or a plant to get started!
                </small>

            </div>

        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(
            (item, index) => `

                <div class="cart-item">

                    <img
                        class="cart-item-image"
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div>

                        <h4>
                            ${item.name}
                        </h4>

                        <small>
                            ${item.option}
                        </small>

                        <div class="quantity">

                            <button
                                onclick="changeQuantity(${index}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeQuantity(${index}, 1)"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <span class="cart-price">
                        ₱${item.price * item.quantity}
                    </span>

                </div>

            `
        ).join("");

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(
    index,
    amount
) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    updateCart();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    cart = [];

    updateCart();

    showToast(
        "Order cleared 🌿"
    );

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("open");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    document
        .getElementById("cartOverlay")
        .classList.remove("open");

    document.body.style.overflow =
        "";

}


/* =========================================================
   OUTSIDE CART CLICK
   ========================================================= */

function closeCartFromOutside(event) {

    if (
        event.target.id ===
        "cartOverlay"
    ) {

        closeCart();

    }

}


/* =========================================================
   OPTION SELECTOR
   ========================================================= */

function selectOption(button) {

    const container =
        button.parentElement;

    container
        .querySelectorAll(".option")
        .forEach(
            item =>
                item.classList.remove(
                    "selected"
                )
        );


    button.classList.add(
        "selected"
    );


    const product =
        button.closest(
            ".product-card"
        );


    const addButton =
        product.querySelector(
            ".add-btn"
        );


    const productName =
        product.querySelector(
            "h3"
        ).textContent;


    const option =
        button.textContent
            .trim()
            .includes("Hot")
            ? "Hot"
            : "Iced";


    const priceText =
        product.querySelector(
            ".price"
        ).textContent;


    const price =
        parseInt(
            priceText
                .replace("₱", "")
        );


    const image =
        product.querySelector(
            "img"
        ).src;


    addButton.onclick =
        function() {

            addToCart(
                productName,
                price,
                option,
                image
            );

        };

}


/* =========================================================
   MENU FILTER
   ========================================================= */

function filterMenu(category, button) {

    document
        .querySelectorAll(".menu-tab")
        .forEach(function(tab) {

            tab.classList.remove("active");

        });


    button.classList.add("active");


    document
        .querySelectorAll("#coffeeGrid .product-card")
        .forEach(function(card) {

            const cardCategory =
                card.dataset.category;


            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

}

/* =========================================================
   CHECKOUT
   ========================================================= */

function openCheckout() {

    if (cart.length === 0) {

        showToast(
            "Your order is empty 🌱"
        );

        return;

    }


    const summary =
        document.getElementById(
            "checkoutSummary"
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    summary.innerHTML =

        cart.map(
            item => `

                <div>

                    <span>
                        ${item.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ₱${item.price * item.quantity}
                    </strong>

                </div>

            `
        ).join("") +

        `

            <div class="modal-total">

                <span>
                    Total
                </span>

                <strong>
                    ₱${total}
                </strong>

            </div>

        `;


    document
        .getElementById(
            "checkoutOverlay"
        )
        .classList.add("open");


    closeCart();

}


/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

function closeCheckout() {

    document
        .getElementById(
            "checkoutOverlay"
        )
        .classList.remove(
            "open"
        );

}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function placeOrder(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "customerName"
        ).value;


    const phone =
        document.getElementById(
            "customerPhone"
        ).value;


    const orderType =
        document.getElementById(
            "orderType"
        ).value;


    const notes =
        document.getElementById(
            "orderNotes"
        ).value;


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const orderLines =
        cart.map(
            item =>
                `- ${item.name} (${item.option}) x${item.quantity} = ₱${item.price * item.quantity}`
        ).join("\n");


    const subject =
        encodeURIComponent(
            "New Pot & Pour Order"
        );


    const body =
        encodeURIComponent(

`Hello Pot & Pour!

I'd like to place an order.

Customer:
${name}

Contact:
${phone}

Order Type:
${orderType}

Order:
${orderLines}

TOTAL:
₱${total}

Notes:
${notes || "None"}

Thank you! 🌿`

        );


    const emailURL = `mailto:fjoshherrera@gmail.com,larancevincent14@gmail.com?subject=${subject}&body=${body}`;


    window.location.href =
        emailURL;


    document.querySelector(
        ".modal"
    ).innerHTML = `

        <div class="order-success">

            <div class="success-icon">
                ✓
            </div>

            <h2 style="
                color:var(--brown);
                font-family:Georgia,serif;
                margin-bottom:10px;
            ">
                Order ready! 🌿
            </h2>

            <p style="
                color:var(--muted);
                margin-bottom:20px;
            ">
                Your order has been prepared.
                Your email app should open with
                the order details addressed to
                Pot & Pour.
            </p>

            <button
                class="btn btn-primary"
                onclick="finishOrder()"
            >
                Done
            </button>

        </div>

    `;

}


/* =========================================================
   FINISH ORDER
   ========================================================= */

function finishOrder() {

    cart = [];

    updateCart();

    closeCheckout();

    location.reload();

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

function sendMessage(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "name"
        ).value;


    const email =
        document.getElementById(
            "email"
        ).value;


    const message =
        document.getElementById(
            "message"
        ).value;


    const subject =
        encodeURIComponent(
            "Message for Pot & Pour"
        );


    const body =
        encodeURIComponent(

`Hello Pot & Pour!

My name is ${name}.

My email:
${email}

Message:
${message}`

        );


  window.location.href = `mailto:fjoshherrera@gmail.com,larancevincent14@gmail.com?subject=${subject}&body=${body}`;

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navLinks =
    document.querySelectorAll(
        "nav a"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(
            section => {

                const top =
                    section.offsetTop -
                    160;


                if (
                    window.scrollY >=
                    top
                ) {

                    current =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    "#" + current
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   INITIAL CART
   ========================================================= */

updateCart();


/* =========================================================
   STAGE 10 - HAMBURGER MENU
   ========================================================= */

function toggleMenu() {
    const header = document.querySelector("header");
    const button = document.getElementById("hamburger");

    header.classList.toggle("nav-open");

    const isOpen = header.classList.contains("nav-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
}

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");

    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }

    document.querySelectorAll("#siteNav a").forEach(function (link) {
        link.addEventListener("click", function () {
            document.querySelector("header").classList.remove("nav-open");
            if (hamburger) {
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "Open navigation menu");
            }
        });
    });
});

/* =========================================================
   STAGE 10 - ARRAY
   ========================================================= */

const featuredProducts = [
    "Matcha Latte",
    "Seasalt Matcha Latte",
    "Dirty Matcha",
    "Strawberry Matcha"
];

/* =========================================================
   STAGE 10 - LOOP
   ========================================================= */

featuredProducts.forEach(function (product) {
    console.log("Featured product:", product);
});

/* =========================================================
   STAGE 10 - CONDITION
   ========================================================= */

function checkStoreStatus(hour) {
    if (hour >= 9 && hour < 20) {
        return "Pot & Pour is open.";
    }

    return "Pot & Pour is closed.";
}

console.log(checkStoreStatus(new Date().getHours()));

/* =========================================================
   STAGE 10 - OBJECT & METHOD
   ========================================================= */

const potPour = {
    name: "Pot & Pour",
    location: "Angeles, Pampanga",
    describe: function () {
        return this.name + " is a cozy coffee and plant shop in " + this.location + ".";
    }
};

console.log(potPour.describe());
