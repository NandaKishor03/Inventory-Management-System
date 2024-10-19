const itemsTableBody = document.getElementById('itemsTableBody');
let currentEditIndex = null;
let currentEditId = null;

async function fetchItems() {
    const response = await fetch('/items');
    const items = await response.json();
    displayItems(items);
}

function displayItems(items) {
    itemsTableBody.innerHTML = ''; 

    items.forEach(item => {
        itemsTableBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>
                    <button onclick="editItem('${item._id}')">Edit</button>
                    <button onclick="deleteItem('${item._id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    const itemData = { name, quantity, price };

    if (currentEditId) {
        await fetch(`/items/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });
        currentEditId = null; 
    } else {
        await fetch('/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });
    }

    document.getElementById('item-form').reset();
    fetchItems(); 
});

function editItem(id) {
    currentEditId = id; 
    const row = itemsTableBody.querySelector(`tr[data-id="${id}"]`);
    const item = {
        name: row.children[0].innerText,
        quantity: row.children[1].innerText,
        price: row.children[2].innerText,
    };

    document.getElementById('name').value = item.name;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('price').value = item.price;
}

async function deleteItem(id) {
    await fetch(`/items/${id}`, {
        method: 'DELETE',
    });
    fetchItems();
}

fetchItems();
