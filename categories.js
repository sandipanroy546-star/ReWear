/* ==========================================================
   ReWear - Category Pages JavaScript
   PART 1
   Dynamic Swap Request Modal
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeSwapModal();

});


/*==========================================================
    CREATE MODAL
==========================================================*/

function initializeSwapModal() {

    if (document.getElementById("dynamicSwapModal")) return;

    const modal = document.createElement("div");

    modal.id = "dynamicSwapModal";

    modal.className = "swap-modal";

    modal.innerHTML = `

<div class="swap-modal-content">

<span class="close" id="closeSwap">&times;</span>

<div class="swap-modal-header">

<h2>Swap Request</h2>

</div>

<div class="swap-modal-body">

<div class="selected-item">

<img id="selectedItemImage"
src=""
alt="Selected Item">

<h3 id="selectedItemName"></h3>

<p id="selectedItemValue"></p>

</div>

<hr>

<form id="swapForm">

<div class="upload-box">

<label>Upload Your Item</label>

<input
type="file"
id="swapImage"
accept="image/*">

<img
id="previewImage"
style="
display:none;
width:170px;
margin-top:15px;
border-radius:12px;
">

</div>

<div class="field">

<label>Item Title</label>

<input
type="text"
id="swapTitle"
placeholder="Enter item title">

</div>

<div class="field">

<label>Category</label>

<select id="swapCategory">

<option>Women's Wear</option>

<option>Men's Wear</option>

<option>Kids Wear</option>

<option>Footwear</option>

<option>Accessories</option>

<option>Winter Wear</option>

</select>

</div>

<div class="field">

<label>Size</label>

<select id="swapSize">

<option>S</option>

<option>M</option>

<option>L</option>

<option>XL</option>

<option>XXL</option>

</select>

</div>

<div class="field">

<label>Condition</label>

<select id="swapCondition">

<option>Excellent</option>

<option>Good</option>

<option>Fair</option>

</select>

</div>

<div class="field">

<label>Estimated Value</label>

<input
type="number"
id="swapValue"
placeholder="Estimated Value">

</div>

<div class="field">

<label>Message</label>

<textarea
id="swapMessage"
rows="4"
placeholder="Write a message..."></textarea>

</div>

<div
id="swapStatus"
style="
display:none;
margin-bottom:15px;
padding:12px;
border-radius:8px;
font-weight:600;
">
</div>

<button
type="submit"
class="confirm-swap-btn"
id="sendSwapBtn">

Send Swap Request

</button>

</form>

</div>

</div>

`;

    document.body.appendChild(modal);

    attachSwapButtons();

    registerModalEvents();

}


/*==========================================================
    ATTACH ALL SWAP BUTTONS
==========================================================*/

function attachSwapButtons() {

    const buttons = document.querySelectorAll(".btn-swap");

    buttons.forEach(button => {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const card = button.closest(".category-card");

            openSwapModal(card);

        });

    });

}


/*==========================================================
    OPEN MODAL
==========================================================*/

function openSwapModal(card) {

    const modal = document.getElementById("dynamicSwapModal");

    const image = card.querySelector("img");

    const title = card.querySelector("h3");

    const value = card.querySelector(".item-value");

    document.getElementById("selectedItemImage").src =
        image ? image.src : "";

    document.getElementById("selectedItemName").textContent =
        title ? title.textContent : "";

    document.getElementById("selectedItemValue").textContent =
        value ? value.textContent : "";

    modal.style.display = "flex";

}


/*==========================================================
    CLOSE MODAL
==========================================================*/

function registerModalEvents() {

    const modal = document.getElementById("dynamicSwapModal");

    document
        .getElementById("closeSwap")
        .addEventListener("click", () => {

            modal.style.display = "none";

        });

    window.addEventListener("click", function (e) {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

}
/*==========================================================
        PART 2
        IMAGE UPLOAD & FORM FUNCTIONS
==========================================================*/

// Wait until modal is created
setTimeout(() => {

    initializeUploadSystem();

}, 100);



/*==========================================================
        IMAGE UPLOAD
==========================================================*/

function initializeUploadSystem() {

    const uploadInput = document.getElementById("swapImage");

    const preview = document.getElementById("previewImage");

    if (!uploadInput || !preview) return;

    uploadInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            showSwapStatus(
                "Please upload a valid image.",
                false
            );

            this.value = "";

            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {

            preview.src = e.target.result;

            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

}



/*==========================================================
        RESET FORM
==========================================================*/

function resetSwapForm() {

    const form = document.getElementById("swapForm");

    if (form) {

        form.reset();

    }

    const preview = document.getElementById("previewImage");

    if (preview) {

        preview.src = "";

        preview.style.display = "none";

    }

    const status = document.getElementById("swapStatus");

    if (status) {

        status.style.display = "none";

        status.innerHTML = "";

    }

}



/*==========================================================
        SHOW STATUS
==========================================================*/

function showSwapStatus(message, success = true) {

    const box = document.getElementById("swapStatus");

    if (!box) return;

    box.style.display = "block";

    box.innerHTML = message;

    if (success) {

        box.style.background = "#16a34a";

        box.style.color = "#ffffff";

    } else {

        box.style.background = "#dc2626";

        box.style.color = "#ffffff";

    }

}



/*==========================================================
        UPDATE MODAL CLOSE
==========================================================*/

const oldRegisterModalEvents = registerModalEvents;

registerModalEvents = function () {

    oldRegisterModalEvents();

    const modal = document.getElementById("dynamicSwapModal");

    document
        .getElementById("closeSwap")
        .addEventListener("click", resetSwapForm);

    window.addEventListener("click", function (e) {

        if (e.target === modal) {

            resetSwapForm();

        }

    });

};



/*==========================================================
        ESC KEY CLOSE
==========================================================*/

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        const modal = document.getElementById("dynamicSwapModal");

        if (!modal) return;

        modal.style.display = "none";

        resetSwapForm();

    }

});
/*==========================================================
                PART 3
        FORM VALIDATION & SUBMISSION
==========================================================*/

document.addEventListener("submit", function (e) {

    if (e.target.id !== "swapForm") return;

    e.preventDefault();

    const image = document.getElementById("swapImage");
    const title = document.getElementById("swapTitle");
    const category = document.getElementById("swapCategory");
    const size = document.getElementById("swapSize");
    const condition = document.getElementById("swapCondition");
    const value = document.getElementById("swapValue");
    const message = document.getElementById("swapMessage");

    if (!image.files.length) {

        showSwapStatus("Please upload your item image.", false);
        return;

    }

    if (title.value.trim() === "") {

        showSwapStatus("Please enter item title.", false);
        title.focus();
        return;

    }

    if (value.value.trim() === "") {

        showSwapStatus("Please enter estimated value.", false);
        value.focus();
        return;

    }

    if (Number(value.value) <= 0) {

        showSwapStatus("Estimated value should be greater than 0.", false);
        value.focus();
        return;

    }

    const sendBtn = document.getElementById("sendSwapBtn");

    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";



    /*======================================================
            Backend Ready Object
    ======================================================*/

    const reader = new FileReader();

reader.onload = function () {

    const request = {

        userImage: reader.result,

        userItem: title.value,

        targetItem: document.getElementById("selectedItemName").textContent,

        targetPrice: document
            .getElementById("selectedItemValue")
            .textContent.replace(/[₹,]/g, ""),

        status: "Pending",

        date: new Date().toLocaleDateString()
    };

    let requests =
        JSON.parse(localStorage.getItem("swapRequests")) || [];

    requests.push(request);

    localStorage.setItem(
        "swapRequests",
        JSON.stringify(requests)
    );

    console.log(request);
};

reader.readAsDataURL(image.files[0]);


    



    /*======================================================
                Fake API Delay
    ======================================================*/

    setTimeout(function () {

        showSwapStatus(

            "✔ Swap Request Sent Successfully!",

            true

        );

        sendBtn.disabled = false;

        sendBtn.innerHTML = "Send Swap Request";



        setTimeout(function () {

            document.getElementById(

                "dynamicSwapModal"

            ).style.display = "none";

            resetSwapForm();

        }, 1800);

    }, 1500);

});



/*==========================================================
        AUTO OPEN ANIMATION
==========================================================*/

const observer = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform =

                "translateY(0px)";

        }

    });

}, {

    threshold: 0.15

});



document.querySelectorAll(".category-card").forEach(function (card) {

    card.style.opacity = "0";

    card.style.transform = "translateY(30px)";

    card.style.transition =

        "all .5s ease";

    observer.observe(card);

});



/*==========================================================
        BUTTON RIPPLE EFFECT
==========================================================*/

document.querySelectorAll(".btn-swap").forEach(function (btn) {

    btn.addEventListener("click", function () {

        btn.style.transform = "scale(.96)";

        setTimeout(function () {

            btn.style.transform = "";

        }, 120);

    });

});



/*==========================================================
        IMAGE HOVER EFFECT
==========================================================*/

document.querySelectorAll(".category-card img").forEach(function (img) {

    img.addEventListener("mouseenter", function () {

        img.style.transform = "scale(1.06)";

    });

    img.addEventListener("mouseleave", function () {

        img.style.transform = "scale(1)";

    });

});



/*==========================================================
                END OF FILE
==========================================================*/

console.log(

"%cReWear Category Module Loaded",

"color:#7c3aed;font-size:16px;font-weight:bold"

);