/* ============================================================
   ReWear - common.js
   Shared UI Logic
   Author: ChatGPT
============================================================ */

/* ============================
   Backend Configuration
============================ */

const API_BASE = "https://rewear-1-i4pl.onrender.com/api";


/* ============================
   Authentication Helpers
============================ */

function getToken() {
    return localStorage.getItem("rewear_token");
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("rewear_user") || "null");
}

function isLoggedIn() {
    return !!getToken();
}

function authHeaders() {

    const token = getToken();

    return {

        "Content-Type": "application/json",

        ...(token && {
            Authorization: `Bearer ${token}`
        })

    };

}


/* ============================
   Login Modal
============================ */

function openModal() {

    const modal = document.getElementById("loginModal");

    if (!modal) return;

    modal.style.display = "flex";

}


function closeModal() {

    const modal = document.getElementById("loginModal");

    if (!modal) return;

    modal.style.display = "none";

}


/* ============================
   Register Modal
============================ */

function openRegister() {

    closeModal();

    const modal = document.getElementById("registerModal");

    if (!modal) return;

    modal.style.display = "flex";

}


function closeRegister() {

    const modal = document.getElementById("registerModal");

    if (!modal) return;

    modal.style.display = "none";

}


/* ============================
   Logout
============================ */

function logoutUser() {

    localStorage.removeItem("rewear_token");

    localStorage.removeItem("rewear_user");

    localStorage.removeItem("rewear_current_user");

    location.reload();

}


/* ============================
   Navbar Login State
============================ */

function updateNavbar() {

    const loginBtn = document.querySelector(".login-btn");

    const registerBtn = document.querySelector(".register-btn");

    const user = getCurrentUser();

    if (!loginBtn || !registerBtn) return;


    if (isLoggedIn() && user) {

        loginBtn.textContent = user.name;

        loginBtn.onclick = null;

        registerBtn.textContent = "Logout";

        registerBtn.onclick = logoutUser;

    }

    else {

        loginBtn.textContent = "Login";

        loginBtn.onclick = openModal;

        registerBtn.textContent = "Register";

        registerBtn.onclick = openRegister;

    }

}


/* ============================
   Close Modals When Clicking Outside
============================ */

window.addEventListener("click", function(event){

    const loginModal = document.getElementById("loginModal");

    const registerModal = document.getElementById("registerModal");

    const swapModal = document.getElementById("swapModal");


    if(event.target === loginModal){

        closeModal();

    }


    if(event.target === registerModal){

        closeRegister();

    }


    if(event.target === swapModal){

        closeSwapModal();

    }

});



/* ============================
   Initial Page Load
============================ */

document.addEventListener("DOMContentLoaded", () => {

    updateNavbar();

});
/* ============================================================
   PART 2 - UI Effects, Mobile Menu, Search & Helpers
============================================================ */


/* ============================
   Smooth Scrolling
============================ */

document.addEventListener("DOMContentLoaded", () => {

    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const targetID = this.getAttribute("href");

            if (targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        });

    });

});


/* ============================
   Reveal Animation
============================ */

function revealElements() {

    const reveals = document.querySelectorAll(".reveal");

    const windowHeight = window.innerHeight;

    reveals.forEach(element => {

        const elementTop = element.getBoundingClientRect().top;

        const revealPoint = 120;

        if (elementTop < windowHeight - revealPoint) {

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealElements);

document.addEventListener("DOMContentLoaded", revealElements);


/* ============================
   Mobile Navigation
============================ */

function initMobileMenu() {

    const menuBtn = document.getElementById("mobile-menu-btn");

    const navLinks = document.getElementById("nav-links");

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (icon) {

            icon.classList.toggle("fa-bars");

            icon.classList.toggle("fa-times");

        }

    });

}

document.addEventListener("DOMContentLoaded", initMobileMenu);


/* ============================
   Search Function
============================ */

function initSearch() {

    const searchInput = document.querySelector(".search-input");

    if (!searchInput) return;

    const cards = document.querySelectorAll(".item-card");

    if (!cards.length) return;

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value.toLowerCase().trim();

        cards.forEach(card => {

            const text = card.textContent.toLowerCase();

            card.style.display =

                text.includes(keyword)

                    ? ""

                    : "none";

        });

    });

}

document.addEventListener("DOMContentLoaded", initSearch);


/* ============================
   Category Detection
============================ */

function getCategoryForItem(title = "", pageTitle = "") {

    title = title.toLowerCase();

    pageTitle = pageTitle.toLowerCase();


    if (pageTitle.includes("women"))

        return "Women's Wear";

    if (pageTitle.includes("men"))

        return "Men's Wear";

    if (pageTitle.includes("kid"))

        return "Kids Wear";

    if (pageTitle.includes("shoe"))

        return "Footwear";

    if (pageTitle.includes("access"))

        return "Accessories";

    if (pageTitle.includes("jacket"))

        return "Winter Wear";


    if (title.includes("dress"))

        return "Women's Wear";

    if (title.includes("shirt"))

        return "Men's Wear";

    if (title.includes("jeans"))

        return "Men's Wear";

    if (title.includes("hoodie"))

        return "Winter Wear";

    if (title.includes("jacket"))

        return "Winter Wear";

    if (title.includes("shoe"))

        return "Footwear";

    if (title.includes("sneaker"))

        return "Footwear";

    if (title.includes("bag"))

        return "Accessories";

    if (title.includes("backpack"))

        return "Accessories";


    return "General";

}


/* ============================
   Utility Functions
============================ */

function goHome() {

    window.location.href = "index.html";

}

function goToLogin() {

    closeRegister();

    openModal();

}

function showMessage(element, message, type = "success") {

    if (!element) return;

    element.style.display = "block";

    element.textContent = message;

    element.style.padding = "12px";

    element.style.marginTop = "15px";

    element.style.borderRadius = "8px";

    element.style.textAlign = "center";

    element.style.fontWeight = "600";

    if (type === "success") {

        element.style.background = "#28a745";

        element.style.color = "#fff";

    }

    else if (type === "error") {

        element.style.background = "#dc3545";

        element.style.color = "#fff";

    }

    else {

        element.style.background = "#ffc107";

        element.style.color = "#000";

    }

}

function hideMessage(element) {

    if (!element) return;

    element.style.display = "none";

    element.textContent = "";

}


/* ============================
   Global ESC Key Support
============================ */

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeModal();

        closeRegister();

        closeSwapModal();

    }

});
/* ============================================================
   PART 3 - SWAP MODAL MANAGEMENT
============================================================ */


/* ============================
   Current Selected Item
============================ */

let currentSwapItem = null;


/* ============================
   Open Swap Modal
============================ */

function openSwapModal(itemData) {

    // User must be logged in
    if (!isLoggedIn()) {

        openModal();
        return;

    }

    currentSwapItem = itemData;

    const modal = document.getElementById("swapModal");

    if (!modal) return;

    /* ----------------------------
       Fill Item Information
    ---------------------------- */

    const itemImage = modal.querySelector(".target-item-img");
    const itemName = modal.querySelector(".target-item-name");
    const itemValue = modal.querySelector(".target-item-value");

    if (itemImage) {

        itemImage.src = itemData.image || "";

    }

    if (itemName) {

        itemName.textContent = itemData.name || "Item";

    }

    if (itemValue) {

        itemValue.textContent = itemData.value || "";

    }


    /* ----------------------------
       Remove Previous Messages
    ---------------------------- */

    const oldMessage = modal.querySelector(".swap-message-container");

    if (oldMessage) {

        oldMessage.remove();

    }


    /* ----------------------------
       Create Message Box
    ---------------------------- */

    const messageContainer = document.createElement("div");

    messageContainer.className = "swap-message-container";

    messageContainer.style.marginTop = "20px";

    messageContainer.innerHTML = `

        <label style="
            display:block;
            margin-bottom:8px;
            font-weight:600;
            color:#555;
        ">
            Message to Owner (Optional)
        </label>

        <textarea
            id="swap-request-message"
            rows="4"
            placeholder="Hi! I would love to swap this item with one of my listings."
            style="
                width:100%;
                padding:12px;
                border-radius:8px;
                border:1px solid #ddd;
                resize:vertical;
                font-family:Montserrat,sans-serif;
                font-size:14px;
                outline:none;
                box-sizing:border-box;
            "
        ></textarea>

    `;


    const comparison = modal.querySelector(".swap-comparison");

    comparison.after(messageContainer);


    /* ----------------------------
       Reset Button
    ---------------------------- */

    const confirmBtn = modal.querySelector(".confirm-swap-btn");

    if (confirmBtn) {

        confirmBtn.disabled = false;

        confirmBtn.innerHTML = "Confirm Swap Request";

    }


    /* ----------------------------
       Show Modal
    ---------------------------- */

    modal.style.display = "flex";

}


/* ============================
   Close Swap Modal
============================ */

function closeSwapModal() {

    const modal = document.getElementById("swapModal");

    if (!modal) return;

    modal.style.display = "none";

}


/* ============================
   Reset Swap Modal
============================ */

function resetSwapModal() {

    const modal = document.getElementById("swapModal");

    if (!modal) return;

    const image = modal.querySelector(".target-item-img");

    const name = modal.querySelector(".target-item-name");

    const value = modal.querySelector(".target-item-value");

    if (image) image.src = "";

    if (name) name.textContent = "";

    if (value) value.textContent = "";

    const textarea = document.getElementById("swap-request-message");

    if (textarea) {

        textarea.value = "";

    }

    const btn = modal.querySelector(".confirm-swap-btn");

    if (btn) {

        btn.disabled = false;

        btn.innerHTML = "Confirm Swap Request";

    }

}


/* ============================
   Swap Item Getter
============================ */

function getCurrentSwapItem() {

    return currentSwapItem;

}
/* ============================================================
   PART 4 - SWAP BUTTON EVENT HANDLING
============================================================ */


/* ============================
   Extract Item Details
============================ */

function extractItemData(card) {

    if (!card) return null;

    const pageTitle =
        document.querySelector(".banner-title")?.textContent ||
        document.querySelector("h1")?.textContent ||
        "";

    const title =
        card.querySelector(".category-name")?.textContent?.trim() ||
        card.querySelector(".card-title")?.textContent?.trim() ||
        card.querySelector("h5")?.textContent?.trim() ||
        "Unknown Item";

    const image =
        card.querySelector("img")?.src || "";

    let owner =
        card.querySelector(".user-name")?.textContent?.trim() ||
        card.querySelector(".user-info span")?.textContent?.trim() ||
        "ReWear Member";

    let value =
        card.querySelector(".value")?.textContent?.trim() ||
        card.querySelector(".card-value")?.textContent?.trim() ||
        card.querySelector(".price")?.textContent?.trim() ||
        "Value Not Available";

    let size = "";
    let condition = "";

    const paragraphs = card.querySelectorAll("p");

    paragraphs.forEach(p => {

        const text = p.textContent.trim();

        if (text.toLowerCase().includes("size")) {

            size = text.replace(/size[-: ]*/i, "").trim();

        }

        if (
            text.toLowerCase().includes("quality") ||
            text.toLowerCase().includes("condition")
        ) {

            condition = text
                .replace(/quality[-: ]*/i, "")
                .replace(/condition[-: ]*/i, "")
                .trim();

        }

    });

    if (size === "") {

        size = "M";

    }

    if (condition === "") {

        condition = "Like New";

    }

    const category = getCategoryForItem(title, pageTitle);

    return {

        name: title,

        image: image,

        owner: owner,

        value: value,

        size: size,

        condition: condition,

        category: category

    };

}


/* ============================
   Card Selector List
============================ */

const CARD_SELECTOR = `

.category-card,
.listing-card,
.item-card,
.container2,
.container3,
.container4,
.container5,
.container6,
.container7,
.container9,
.container10,
.container11,
.container12,
.container13,
.container14

`;


/* ============================
   Swap Button Click
============================ */

document.addEventListener("click", function (e) {

    const swapBtn = e.target.closest(".btn-swap");

    if (!swapBtn) return;

    const card = swapBtn.closest(CARD_SELECTOR);

    if (!card) return;

    const itemData = extractItemData(card);

    if (!itemData) return;

    openSwapModal(itemData);

});


/* ============================
   Direct Swap Support
============================ */

function swapItem(card) {

    const itemData = extractItemData(card);

    if (!itemData) return;

    openSwapModal(itemData);

}


/* ============================
   Debug Helper
============================ */

function printCurrentSwapItem() {

    console.log(currentSwapItem);

}
/* ============================================================
   PART 5 - CONFIRM SWAP REQUEST (BACKEND)
============================================================ */

async function confirmSwapRequest() {
    console.log("confirmSwapRequest() started");
alert("confirmSwapRequest() started");

    const btn = document.querySelector(".confirm-swap-btn");

    const modalBody = document.querySelector(".swap-modal-body");

    if (!btn || !modalBody) return;

    /* ----------------------------
       User must be logged in
    -----------------------------*/

    if (!isLoggedIn()) {

        closeSwapModal();

        openModal();

        return;

    }

    /* ----------------------------
       Selected Item
    -----------------------------*/

    const item = getCurrentSwapItem();

    if (!item) {

        showSwapError("No item selected.");

        return;

    }

    /* ----------------------------
       User Message
    -----------------------------*/

    const textarea = document.getElementById("swap-request-message");

    const message = textarea
        ? textarea.value.trim()
        : "";

    /* ----------------------------
       Loading Button
    -----------------------------*/

    btn.disabled = true;

    btn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Sending Request...
    `;

    try {

        /* --------------------------------
           Find Listing ID
        ---------------------------------*/
        console.log("STEP 2 - Searching listing");
        const listingResponse = await fetch(

            `${API_BASE}/listings?search=${encodeURIComponent(item.name)}`,

            {
                headers: authHeaders()
            }

        );

        if (!listingResponse.ok) {

            throw new Error("Unable to fetch listing.");

        }

        const listings = await listingResponse.json();
        console.log("STEP 3 - Listings received", listings);
        console.log("Listings returned:", listings);

        if (!Array.isArray(listings) || listings.length === 0) {

            showSwapError("Listing not found.");

            btn.disabled = false;

            btn.innerHTML = "Confirm Swap Request";

            return;

        }

        /* --------------------------------
           Best Matching Listing
        ---------------------------------*/

        let selectedListing = listings.find(listing => {

            return listing.title.toLowerCase() === item.name.toLowerCase();

        });

        if (!selectedListing) {

            selectedListing = listings[0];

        }

        /* --------------------------------
           Send Swap Request
        ---------------------------------*/
        console.log("STEP 4 - Sending swap request");
        const swapResponse = await fetch(

            `${API_BASE}/swaps`,

            {

                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify({

                    listingId: selectedListing._id,

                    message: message || "No message"

                })

            }

        );

        const swapResult = await swapResponse.json();
        console.log("STEP 5 - Swap response", swapResult);

        /* --------------------------------
           Duplicate Request
        ---------------------------------*/

        if (swapResponse.status === 409) {

            showSwapError(

                "You have already requested this item."

            );

            btn.disabled = false;

            btn.innerHTML = "Confirm Swap Request";

            return;

        }

        /* --------------------------------
           Other Errors
        ---------------------------------*/

        if (!swapResponse.ok) {

            showSwapError(

                swapResult.message ||

                "Swap request failed."

            );

            btn.disabled = false;

            btn.innerHTML = "Confirm Swap Request";

            return;

        }

        /* --------------------------------
           Success
        ---------------------------------*/

        showSwapSuccess();

    }

    catch (error) {

        console.error(error);

        showSwapError(

            "Cannot connect to backend server."

        );

        btn.disabled = false;

        btn.innerHTML = "Confirm Swap Request";

    }

}
/* ============================================================
   PART 6 - SWAP SUCCESS, ERROR & FINAL INITIALIZATION
============================================================ */


/* ============================
   Swap Success Screen
============================ */

function showSwapSuccess() {

    const body = document.querySelector(".swap-modal-body");

    if (!body) return;

    body.innerHTML = `

        <div class="swap-success-state" style="text-align:center;padding:40px;">

            <div style="
                font-size:70px;
                color:#22c55e;
                margin-bottom:20px;
            ">
                ✓
            </div>

            <h2 style="
                color:#6f2c91;
                margin-bottom:15px;
            ">
                Swap Request Sent!
            </h2>

            <p style="
                color:#666;
                margin-bottom:30px;
                line-height:1.6;
            ">
                Your swap request has been sent successfully.
                The owner will receive your request shortly.
            </p>

            <button
                class="login-submit"
                onclick="window.location.href='your_listings.html'"
            >
                View Your Listings
            </button>

        </div>

    `;

}


/* ============================
   Swap Error Message
============================ */

function showSwapError(message) {

    const body = document.querySelector(".swap-modal-body");

    if (!body) return;

    let errorBox = body.querySelector(".swap-error-box");

    if (!errorBox) {

        errorBox = document.createElement("div");

        errorBox.className = "swap-error-box";

        errorBox.style.cssText = `
            background:#f8d7da;
            color:#842029;
            border:1px solid #f5c2c7;
            padding:14px;
            border-radius:8px;
            margin-top:20px;
            text-align:center;
            font-size:14px;
            font-weight:500;
        `;

        body.appendChild(errorBox);

    }

    errorBox.textContent = message;

}


/* ============================
   Reset Swap Modal
============================ */

function resetSwapModalContent() {

    const body = document.querySelector(".swap-modal-body");

    if (!body) return;

    location.reload();

}


/* ============================
   Close Swap Modal
============================ */



/* ============================
   Reopen Default Modal Layout
============================ */

document.addEventListener("click", function(e){

    const modal = document.getElementById("swapModal");

    if(e.target === modal){

        closeSwapModal();

        resetSwapModalContent();

    }

});


/* ============================
   Reveal Animation Startup
============================ */

document.addEventListener("DOMContentLoaded", function(){

    revealElements();

});


/* ============================
   Navbar Startup
============================ */



/* ============================
   Console Message
============================ */

console.log(

"%c ReWear Common.js Loaded Successfully",

"color:#6f2c91;font-size:14px;font-weight:bold;"

);