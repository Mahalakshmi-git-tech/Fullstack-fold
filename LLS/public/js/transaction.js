const ITEMS_API = "/api/items/list";
const OPERATIONS_API = "/api/operations/list";
const TRANSACTIONS_API = "/api/transactions";

const updateBtn = document.getElementById("updateBtn");
const transactionBody = document.getElementById("transactionBody");
const messageDiv = document.getElementById("message");

window.addEventListener("DOMContentLoaded", fetchAndDisplayTransactions);
updateBtn.addEventListener("click", updateTransactions);

async function fetchAndDisplayTransactions() {
  try {
    const res = await fetch(`${TRANSACTIONS_API}/list`);
    const data = await res.json();

    transactionBody.innerHTML = "";

    data.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.operation}</td>
        <td>${tx.item_code}</td>
        <td>${tx.quantity}</td>
        <td>${new Date(tx.date).toLocaleString()}</td>
      `;
      transactionBody.appendChild(tr);
    });

    // 🔔 Keep message visible for 5 seconds
    setTimeout(() => {
      messageDiv.innerText = "";
    }, 5000);
  } catch (err) {
    messageDiv.innerText = "Failed to load transactions.";
    console.error(err);
  }
}

async function updateTransactions() {
  updateBtn.disabled = true;
  messageDiv.innerText = "Updating transactions...";

  try {
    const [itemsRes, operationsRes] = await Promise.all([
      fetch(ITEMS_API),
      fetch(OPERATIONS_API)
    ]);

    const items = await itemsRes.json();
    const operations = await operationsRes.json();

    const allTransactions = [];
    const quantityMap = new Map();
    let currentQty = 1;

    for (const item of items) {
      let qty = quantityMap.get(item.item_code);
      if (!qty) {
        qty = currentQty;
        quantityMap.set(item.item_code, qty);
        currentQty++;
      }

      for (const op of operations) {
        const opStr = `${op.operation_code} - ${op.operation_name} - ${op.operation_character}`;
        allTransactions.push({
          operation: opStr,
          item_code: item.item_code,
          quantity: qty
        });
      }
    }

    const res = await fetch(`${TRANSACTIONS_API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(allTransactions)
    });

    const result = await res.json();

    if (res.ok) {
      messageDiv.innerText = `Transactions updated. New records inserted: ${result.inserted}`;
      await fetchAndDisplayTransactions();
    } else {
      throw new Error(result.error || "Unknown error");
    }
  } catch (err) {
    console.error(err);
    messageDiv.innerText = "Failed to update transactions.";
  } finally {
    updateBtn.disabled = false;
  }
}
