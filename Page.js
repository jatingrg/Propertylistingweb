import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const list = document.getElementById("cards");

const filters = {
  bhk: document.getElementById("flat-bhk"),
  type: document.getElementById("property-type"),
  budget: document.getElementById("budget"),
  locality: document.getElementById("localities"),
};

function getSelectedFilters() {
  return {
    bhk: filters.bhk.value !== "BHK" ? filters.bhk.value : null,
    type: filters.type.value !== "Property Type" ? filters.type.value : null,
    budget: filters.budget.value !== "Budget" ? filters.budget.value : null,
    locality: filters.locality.value !== "Top Localities" ? filters.locality.value.toLowerCase() : null,
  };
}

async function fetchProperties() {
  list.innerHTML = "";

  const q = collection(db, "properties");
  const querySnapshot = await getDocs(q);

  const selected = getSelectedFilters();

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const matches =
      (!selected.bhk || data.bhk?.toLowerCase() === selected.bhk) &&
      (!selected.type || data.category?.toLowerCase() === selected.type) &&
      (!selected.budget || data.price <= selected.budget) &&
      (!selected.locality || data.location?.toLowerCase().includes(selected.locality));

    if (matches) {
      displayProperty(data);
    }
  });
}

function displayProperty(data) {
  const propertyCard = `
    <div class="property-card">
        <div class="left-section">
            <div class="property-image">
                <img src="${data.imageUrl || 'pic1.jpg'}" alt="Property Image">
            </div>
            <div class="owner-info">
                <p>Owner: ${data.adminId || 'N/A'}</p>
            </div>
        </div>
        <div class="middle-section">
            <h3>${data.title || 'Property Title'}</h3>
            <p>${data.description || 'Property Title'}</p>
            <p class="project-name">${data.project || ''}</p>
            <div class="features">
                <div class="feature"><span>Location</span><strong>${data.location}</strong></div>
                <div class="feature"><span>TRANSACTION</span><strong>${data.transaction}</strong></div>
                <div class="feature"><span>STATUS</span><strong>${data.status}</strong></div>
                <div class="feature"><span>FURNISHING</span><strong>${data.furnishing}</strong></div>
                <div class="feature"><span>FLOOR</span><strong>${data.floor}</strong></div>
                <div class="feature"><span>FACING</span><strong>${data.facing}</strong></div>
                <div class="feature"><span>CATEGORY</span><strong>${data.category}</strong></div>
                <div class="feature"><span>BHK</span><strong>${data.bhk}</strong></div>
            </div>
        </div>
        <div class="right-section">
            <div class="price-container">
                <h3 class="price">₹${data.price}</h3>
                <p class="price-per-sqft">₹${data.pricePerSqft} per sqft</p>
            </div>
            <button class="btn primary">Contact Owner</button>
            <button class="btn secondary">Get Phone No.</button>
            <button class = "btn view-btn" data-id="${data.id}">view</button>
        </div>
    </div>
  `;
  
  list.innerHTML += propertyCard;
}


Object.values(filters).forEach((dropdown) => {
  dropdown.addEventListener("change", fetchProperties);
});

fetchProperties(); 
