const addBtn = document.querySelector(".btn-outline");
const modal = document.getElementById("docModal");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("docForm");


const titleInput = document.getElementById("docTitle");
const statusInput = document.getElementById("docStatus");

const waitingInput = document.getElementById("waitingCount");
const waitingGroup = document.getElementById("waitingGroup");
const tableBody = document.querySelector(".documents-table tbody");


 const profileToggle = document.querySelector(".profile-toggle");
const profileDropdown = document.querySelector(".profile-dropdown");

profileToggle.addEventListener("click", () => {
  profileDropdown.classList.toggle("active");
});


  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile")) {
       profileDropdown.classList.remove("active");
    }
  });


let documents = JSON.parse(localStorage.getItem("documents")) || [];
let editIndex = null;


addBtn.addEventListener("click", () => {
  form.reset();
  editIndex = null;
  waitingGroup.style.display = "none";
  modal.style.display = "flex";
});



cancelBtn.addEventListener("click", (e) => {
  if (e.target === cancelBtn) modal.style.display = "none";
});

// status 
statusInput.addEventListener("change", () => {
  if (statusInput.value === "Pending") {
    waitingGroup.style.display = "block";
  } else {
    waitingGroup.style.display = "none";
    waitingInput.value = "";
  }
});


function validateForm() {
  let valid = true;

  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  if (!titleInput.value.trim()) {
    titleInput.nextElementSibling.textContent = "Title is required";
    valid = false;
  }

  if (!statusInput.value) {
    statusInput.nextElementSibling.textContent = "Select status";
    valid = false;
  }

 

  return valid;
}

// form submission


form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const { date, time } = getCurrentDateTime();

  const docData = {
    id: editIndex !== null ? documents[editIndex].id : Date.now(),
    title: titleInput.value,
    status: statusInput.value,
    date,            
    time,            
    waitingCount:
      statusInput.value === "Pending" ? waitingInput.value : null
  };

  if (editIndex !== null) {
    documents[editIndex] = docData;
  } else {
    documents.push(docData);
  }

  localStorage.setItem("documents", JSON.stringify(documents));
  renderTable();
  modal.style.display = "none";
});



// table renderr
function renderTable() {
  tableBody.innerHTML = "";

  documents.forEach((doc, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="checkbox"></td>

      <td class="doc-name">${doc.title}</td>

      <td>
        <span class="status ${getStatusClass(doc.status)}">
          ${doc.status}
        </span>
        ${
          doc.status === "Pending"
            ? `<div class="status-sub">
               <i> Waiting for <strong>${doc.waitingCount} ${doc.waitingCount > 1 ? "people" : "person"}</strong></i>
              </div>`
            : ""
        }
      </td>

      <td class="date">
  ${doc.date}<br>
  <span>${doc.time}</span>
</td>


       
  <td class="action-cell">
    <button class="action-btn">
      ${getActionText(doc.status)}
    </button>
  </td>

 
  <td class="more-cell">
    <div class="more-wrapper">
      <button class="more-btn">
        <img src="assets/threeDot_icon.svg">
      </button>
      <div class="more-dropdown">
        <button onclick="editDoc(${index})">Edit</button>
        <button class="delete" onclick="deleteDoc(${index})">Delete</button>
      </div>
    </div>
  </td>
    `;

    tableBody.appendChild(tr);
  });
}


function getStatusClass(status) {
  if (status === "Needs Signing") return "signing";
  if (status === "Pending") return "pending";
  if (status === "Completed") return "completed";
  return "";
}

function getActionText(status) {
  if (status === "Needs Signing") return "Sign now";
  if (status === "Pending") return "Preview";
  if (status === "Completed") return "Download PDF";
  return "Preview";
}

function getCurrentDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString("en-GB"); 
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return { date, time };
}

//edit
function editDoc(index) {
  const doc = documents[index];
  editIndex = index;

  titleInput.value = doc.title;
  statusInput.value = doc.status;
 

  if (doc.status === "Pending") {
    waitingGroup.style.display = "block";
    waitingInput.value = doc.waitingCount;
  } else {
    waitingGroup.style.display = "none";
    waitingInput.value = "";
  }

  modal.style.display = "flex";
}



// delete
function deleteDoc(index) {
  if (!confirm("Delete this document?")) return;
  documents.splice(index, 1);
  localStorage.setItem("documents", JSON.stringify(documents));
  renderTable();
}


renderTable();

//more
document.addEventListener("click", (e) => {
  const moreBtn = e.target.closest(".more-btn");

  document.querySelectorAll(".more-dropdown").forEach(d => {
    d.classList.remove("show");
  });

 
  if (moreBtn) {
    e.stopPropagation();
    const dropdown = moreBtn.nextElementSibling;
    dropdown.classList.add("show");
  }
});


// search document by title

  const searchInput = document.getElementById("searchInput");
const rows = document.querySelectorAll("#documentsBody tr");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  rows.forEach(row => {
    const title = row.querySelector(".doc-name")?.innerText.toLowerCase() || "";

    if (title.includes(query)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});


//search byy status

const statusFilter = document.getElementById("statusFilter");

statusFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

function applyFilters() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  const rows = document.querySelectorAll(".documents-table tbody tr");

  rows.forEach(row => {
    const title =
      row.querySelector(".doc-name")?.innerText.toLowerCase() || "";

    const status =
      row.querySelector(".status")?.innerText.trim() || "";

    const matchesTitle = title.includes(searchQuery);
    const matchesStatus =
      selectedStatus === "select" || status === selectedStatus;

    row.style.display =
      matchesTitle && matchesStatus ? "" : "none";
  });
}





































