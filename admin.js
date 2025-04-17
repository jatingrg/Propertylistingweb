import { auth, db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const list = document.getElementById("property-list");
const searchInput = document.getElementById("search");
const sortBy = document.getElementById("sortBy");

let properties = [];  

onAuthStateChanged(auth, (user) => {
  if (user) {
    const adminId = user.uid;

    async function fetchProperties(adminId) {
      list.innerHTML = "";
      const q = query(
        collection(db, "properties"),
        where("adminId", "==", adminId),
        orderBy("createdAt", "desc")
      );
      

      const querySnapshot = await getDocs(q);
      properties = [];  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        properties.push(data);
      });
      displayProperties(properties);
    }

    function displayProperties(propertiesToDisplay) {
      list.innerHTML = "";
      propertiesToDisplay.forEach((data) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div>
            <strong>${data.title}</strong> - ${data.location} - ₹${data.price}<br>
            <small>${data.category} | ${data.bhk}</small><br>
            <p>${data.description}</p>
            <img src="${data.imageUrl}" width="100" style="margin-top: 5px; border-radius: 4px;">
          </div>
        `;
        list.appendChild(li);
      });
    }

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query)
      );
      displayProperties(filteredProperties);
    });

    sortBy.addEventListener("change", (e) => {
      const sortValue = e.target.value;
      let sortedProperties = [...properties];

      if (sortValue === "price-asc") {
        sortedProperties.sort((a, b) => a.price - b.price);
      } else if (sortValue === "price-desc") {
        sortedProperties.sort((a, b) => b.price - a.price);
      } else if (sortValue === "title-asc") {
        sortedProperties.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortValue === "title-desc") {
        sortedProperties.sort((a, b) => b.title.localeCompare(a.title));
      }

      displayProperties(sortedProperties);
    });

    fetchProperties(adminId);

  } else {
    window.location.href = "login.html";
  }
});
