// ===========================================
// ReWear Listing Page
// ===========================================

let selectedCard = null;

// ----------------------------
// Open Swap Modal
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {

    const swapButtons = document.querySelectorAll(".btn-swap");

    swapButtons.forEach(button => {

        button.addEventListener("click", function () {

            selectedCard = this.closest(".listing-card");

            openSwapModal(selectedCard);

        });

    });

});



// ----------------------------
// Open Modal
// ----------------------------




// ----------------------------
// Close Modal
// ----------------------------




// ----------------------------
// Confirm Swap
// ----------------------------




// ----------------------------
// Close if clicked outside
// ----------------------------

window.onclick = function (e) {

    const modal = document.getElementById("swapModal");

    if (e.target === modal) {

        closeSwapModal();

    }

};



// ----------------------------
// Search
// ----------------------------

const search = document.getElementById("main-search");

if (search) {

    search.addEventListener("input", function () {

        const value = search.value.toLowerCase();

        document.querySelectorAll(".listing-card")
            .forEach(card => {

                const title = card.querySelector(".card-title")
                    .textContent.toLowerCase();

                card.style.display =
                    title.includes(value)
                        ? ""
                        : "none";

            });

    });

}
const uploadInput = document.getElementById("userItemImage");

if (uploadInput) {

    uploadInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            const preview =
                document.getElementById("userPreview");

            preview.src = e.target.result;

            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

}