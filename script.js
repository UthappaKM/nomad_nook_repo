let menu = {};
let order = [];
let total = 0;
let orderId = null;

// ...existing code...
const urlParams = new URLSearchParams(window.location.search);
const decoded = decodeURIComponent(urlParams.get('data') || '');
const [tableNo, phoneNo] = decoded.split("|");
// ...existing code...

fetch("data/menu.json")
  .then(res => res.json())
  .then(data => {
    menu = data;
    loadCategories();
  });

function loadCategories() {
  const catSelect = document.getElementById("categorySelect");
  catSelect.innerHTML = `<option>Select category</option>`;

  Object.keys(menu).forEach(cat => {
    catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  catSelect.onchange = loadItems;
}

function loadItems() {
  const itemSelect = document.getElementById("itemSelect");
  const category = categorySelect.value;
  itemSelect.innerHTML = `<option>Select item</option>`;

  menu[category].forEach((item, index) => {
    itemSelect.innerHTML += `<option value="${index}">${item.name}</option>`;
  });

  itemSelect.onchange = showItemDetails;
}

function showItemDetails() {
  const category = categorySelect.value;
  const item = menu[category][itemSelect.value];

  document.getElementById("itemDetails").innerHTML =
    `${item.description}<br>Price: ₹${item.price}`;
}

function addItem() {
  const category = categorySelect.value;
  const item = menu[category][itemSelect.value];
  const qty = parseInt(quantity.value);

  const itemTotal = item.price * qty;
  total += itemTotal;

  order.push({
    name: item.name,
    quantity: qty,
    price: item.price
  });

  updateOrderUI();
}

function removeItem(index) {
  const removedItem = order[index];

  total -= removedItem.price * removedItem.quantity;
  order.splice(index, 1);

  updateOrderUI();
}


function updateOrderUI() {
  const list = document.getElementById("orderList");
  list.innerHTML = "";

  order.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} – ₹${itemTotal}
      <button onclick="removeItem(${index})" style="margin-left:10px;color:red;">
        ❌
      </button>
    `;

    list.appendChild(li);
  });

  document.getElementById("total").innerText = total;
}


function submitOrder() {
    if (!orderId) {
  orderId = "NN-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

  const payload = {
    order_id: orderId,
    name: customername.value,
    phone:phoneNo,
    table: tableNo,
    items: order,
    total: total
  };

  fetch("https://n8n.srv1116490.hstgr.cloud/webhook-test/ea1a69d0-8884-497f-905e-02258f7cd1e5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // Redirect to thank you page
  window.location.href = "thank-you.html";
}
