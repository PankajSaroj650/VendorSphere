// VendorSphere - Simple Working Version
// Data browser ke LocalStorage me save hota hai

let vendors = [];
let nextId = 1;

// Purana data load karo (agar kharab data ho to crash nahi hoga)
try {
  vendors = JSON.parse(localStorage.getItem("vendors") || "[]");
  if (!Array.isArray(vendors)) vendors = [];
} catch (e) {
  vendors = [];
}
nextId = Number(localStorage.getItem("nextId") || 1);
if (!nextId || nextId < 1) nextId = 1;

function $(id) {
  return document.getElementById(id);
}

function save() {
  localStorage.setItem("vendors", JSON.stringify(vendors));
  localStorage.setItem("nextId", String(nextId));
}

// < > jaise characters se bachne ke liye (XSS fix)
function safe(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showMsg(text, isError) {
  var m = $("msg");
  m.textContent = text;
  m.className = isError ? "error" : "";
  // 3 second baad msg hata do
  setTimeout(function () { m.textContent = ""; m.className = ""; }, 3000);
}

function render() {
  var q = $("search").value.toLowerCase();
  var f = $("filter").value;

  var list = vendors.filter(function (v) {
    var text = (v.name + " " + v.company + " " + v.product).toLowerCase();
    return text.includes(q);
  });

  if (f === "top") {
    list = list.filter(function (v) { return Number(v.rating) >= 4; });
  }

  var html = "";
  list.forEach(function (v) {
    html += "<tr><td>" + v.id + "</td>"
      + "<td>" + safe(v.name) + "</td>"
      + "<td>" + safe(v.company) + "</td>"
      + "<td>" + safe(v.product) + "</td>"
      + "<td>" + safe(v.phone || "-") + "</td>"
      + "<td>" + Number(v.value || 0) + "</td>"
      + "<td>" + Number(v.rating || 0) + " Star</td>"
      + "<td><button type='button' onclick='editVendor(" + v.id + ")'>Edit</button> "
      + "<button type='button' class='danger' onclick='deleteVendor(" + v.id + ")'>Delete</button></td></tr>";
  });
  $("tbody").innerHTML = html;
  $("empty").style.display = list.length ? "none" : "block";

  var total = 0;
  var topCount = 0;
  vendors.forEach(function (v) {
    total += Number(v.value || 0);
    if (Number(v.rating) >= 4) topCount++;
  });
  $("stats").textContent = "Total Vendors: " + vendors.length +
    " | Total Contract Value: Rs " + total +
    " | Top Rated: " + topCount;
}

// Form submit - Add / Update
$("vendorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var name = $("name").value.trim();
  var company = $("company").value.trim();
  var product = $("product").value.trim();
  var phone = $("phone").value.trim();
  var email = $("email").value.trim();
  var value = $("value").value === "" ? 0 : Number($("value").value);
  var rating = $("rating").value === "" ? 0 : Number($("rating").value);

  if (!name || !company || !product) {
    showMsg("Name, Company aur Product bharna zaroori hai.", true);
    return;
  }
  if (phone !== "" && !/^[0-9]{10}$/.test(phone)) {
    showMsg("Phone 10 digit ka hona chahiye.", true);
    return;
  }
  if (email !== "" && !email.includes("@")) {
    showMsg("Sahi email likho.", true);
    return;
  }
  if (value < 0) {
    showMsg("Contract Value 0 se kam nahi ho sakta.", true);
    return;
  }
  if (rating < 0 || rating > 5) {
    showMsg("Rating 0 se 5 ke beech honi chahiye.", true);
    return;
  }

  var data = {
    name: name, company: company, product: product,
    phone: phone, email: email, value: value, rating: rating
  };

  var editId = $("editId").value;
  if (editId !== "") {
    // UPDATE
    var index = vendors.findIndex(function (v) { return v.id == editId; });
    if (index === -1) {
      showMsg("Ye vendor nahi mila.", true);
      return;
    }
    vendors[index] = { id: vendors[index].id, ...data };
    showMsg("Vendor Updated!");
  } else {
    // ADD
    data.id = nextId++;
    vendors.push(data);
    showMsg("Vendor Added Successfully!");
  }

  save();
  render();
  $("vendorForm").reset();
  $("editId").value = "";
  $("saveBtn").textContent = "Add Vendor";
  $("cancelEdit").classList.add("hidden");
});

// Edit button
window.editVendor = function (id) {
  var v = vendors.find(function (x) { return x.id === id; });
  if (!v) return;
  $("name").value = v.name;
  $("company").value = v.company;
  $("product").value = v.product;
  $("phone").value = v.phone || "";
  $("email").value = v.email || "";
  $("value").value = v.value;
  $("rating").value = v.rating;
  $("editId").value = v.id;
  $("saveBtn").textContent = "Update Vendor";
  $("cancelEdit").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Delete button
window.deleteVendor = function (id) {
  if (confirm("Delete this vendor?")) {
    vendors = vendors.filter(function (v) { return v.id !== id; });
    save();
    render();
  }
};

// Cancel Edit
$("cancelEdit").onclick = function () {
  $("vendorForm").reset();
  $("editId").value = "";
  $("saveBtn").textContent = "Add Vendor";
  $("cancelEdit").classList.add("hidden");
};

// Search + Filter
$("search").oninput = render;
$("filter").onchange = render;

// Clear All
$("clearBtn").onclick = function () {
  if (confirm("Delete ALL vendors?")) {
    vendors = [];
    nextId = 1;
    save();
    render();
  }
};

// Export CSV - comma wale naam bhi sahi export honge
$("exportBtn").onclick = function () {
  if (!vendors.length) {
    alert("No data to export");
    return;
  }
  function csvCell(x) {
    var s = String(x == null ? "" : x).replace(/"/g, '""');
    return '"' + s + '"';
  }
  var csv = "ID,Name,Company,Product,Phone,Email,Value,Rating\n";
  vendors.forEach(function (v) {
    csv += [v.id, v.name, v.company, v.product, v.phone, v.email, v.value, v.rating]
      .map(csvCell).join(",") + "\n";
  });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "vendors.csv";
  a.click();
  URL.revokeObjectURL(a.href);
};

render();
