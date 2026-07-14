// =========================================
// ReWear - Your Listings
// =========================================
console.log("your_listings.js loaded");
let swapRequests = [];
let activeUser = "You";
console.log("Current page:", window.location.pathname);

console.log("Grid element:", document.getElementById("listings-dynamic-grid"));

console.log("Empty state:", document.getElementById("empty-state"));

console.log("Count:", document.getElementById("request-count"));

async function loadSwapRequests() {

    console.log("loadSwapRequests called");

    try {

        console.log("API URL:", `${API_BASE}/swaps/outgoing`);
        console.log("Headers:", authHeaders());

        const response = await fetch(`${API_BASE}/swaps/outgoing`, {
            headers: authHeaders()
        });

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Unable to load swap requests");
        }

        swapRequests = data;

        renderListings();

    } catch (err) {

        console.error("ERROR:", err);

    }
}
// -----------------------------
// Load Page
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");
    loadSwapRequests();
});

// -----------------------------
// Get Requests
// -----------------------------



// -----------------------------
// Load + Render
// -----------------------------
function loadAndRenderListings() {

    swapRequests = getSwapRequests();

    sortRequests();

    renderListings();

}
// -----------------------------
// Render Listings
// -----------------------------
function renderListings() {

    const grid = document.getElementById("listings-dynamic-grid");
    const emptyState = document.getElementById("empty-state");
    const count = document.getElementById("request-count");

    if (!grid) {
    console.error("Grid not found!");
    return;
}

if (!emptyState) {
    console.error("Empty state not found!");
    return;
}

if (!count) {
    console.error("Request count not found!");
    return;
}

grid.innerHTML = "";

    count.textContent = swapRequests.length;

    if (swapRequests.length === 0) {

        emptyState.style.display = "flex";
        grid.style.display = "none";

        return;
    }

    emptyState.style.display = "none";
    grid.style.display = "grid";

    swapRequests.forEach((request, index) => {
        console.log("Rendering:", request);

        const card = document.createElement("div");
        card.className = "listing-card";

        let badgeClass = "pending";

        if (request.status === "Accepted") {
            badgeClass = "accepted";
        }

        if (request.status === "Rejected") {
            badgeClass = "rejected";
        }

        card.innerHTML = `

        <div class="listing-image">

            <img src="http://localhost:5000/${request.offeredListingId?.image || 'assets/no-image.png'}" alt="My Item">
        </div>

        <div class="listing-content">

            <h3>${request.offeredListingId?.title || "My Item"}</h3>

            <p class="swap-for">

                <strong>Swap For:</strong>

                ${request.listingId?.title}

            </p>

            <p>

                <strong>Estimated Value:</strong>
                ${request.listingId?.price || "Value Not Set"}

            </p>

            <p>

                <strong>Requested On:</strong>

                ${request.dateTime}

            </p>

            <div class="status-row">

                <span class="status-badge ${badgeClass}">

                    ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}

                </span>

            </div>

            <div class="progress">

                ${getProgress(request.status)}

            </div>

            <button class="delete-btn"
                   onclick="deleteRequest('${request._id}')">

                Delete

            </button>

        </div>

        `;

        grid.appendChild(card);
        console.log("Card added");

    });

}
// ==========================================
// Progress Tracker
// ==========================================

function getProgress(status) {

    if (status === "pending") {

        return `
            <div class="progress-wrapper">

                <div class="progress-step completed">
                    ✔ Request Sent
                </div>

                <div class="progress-step active">
                    ⏳ Waiting for Owner
                </div>

                <div class="progress-step">
                    Swap Complete
                </div>

            </div>
        `;

    }

    if (status === "accepted") {

        return `
            <div class="progress-wrapper">

                <div class="progress-step completed">
                    ✔ Request Sent
                </div>

                <div class="progress-step completed">
                    ✔ Accepted
                </div>

                <div class="progress-step completed">
                    ✔ Swap Complete
                </div>

            </div>
        `;

    }

    return `
        <div class="progress-wrapper">

            <div class="progress-step completed">
                ✔ Request Sent
            </div>

            <div class="progress-step rejected">
                ✖ Rejected
            </div>

        </div>
    `;

}



// ==========================================
// Delete One Request
// ==========================================

function deleteRequest(index) {

    const confirmDelete = confirm(
        "Delete this swap request?"
    );

    if (!confirmDelete) return;

    swapRequests.splice(index, 1);

    saveSwapRequests(swapRequests);

    loadAndRenderListings();

}



// ==========================================
// Clear Entire History
// ==========================================

function clearAllSwaps() {

    const ok = confirm(
        "Clear all swap history?"
    );

    if (!ok) return;

    localStorage.removeItem("swapRequests");

    swapRequests = [];

    loadAndRenderListings();

}



// ==========================================
// Sort Requests
// ==========================================

function sortRequests() {

    const sort = document.getElementById("sort-requests");

    if (!sort) return;

    switch (sort.value) {

        case "oldest":

            swapRequests.sort((a, b) =>
                a.id - b.id
            );

            break;

        case "price-high":

            swapRequests.sort((a, b) =>
                b.targetPrice - a.targetPrice
            );

            break;

        case "price-low":

            swapRequests.sort((a, b) =>
                a.targetPrice - b.targetPrice
            );

            break;

        case "status":

            swapRequests.sort((a, b) => {

                const order = {
                    Pending: 1,
                    Accepted: 2,
                    Rejected: 3
                };

                return order[a.status] - order[b.status];

            });

            break;

        default:

            swapRequests.sort((a, b) =>
                b.id - a.id
            );

    }

}



// ==========================================
// Active User
// ==========================================

// ==========================================
// Validate Old Saved Data
// ==========================================




// ==========================================
// Reload Automatically
// ==========================================





// ==========================================
// First Time Initialization
// ==========================================




// ==========================================
// Debug Helper
// Remove later if you want
// ==========================================

console.log(
    "✅ ReWear Your Listings Loaded Successfully"
);
