const API_URL = 'http://localhost:3000/productos';

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  document.getElementById('product-form')
          .addEventListener('submit', handleFormSubmit);
});

function fetchProducts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderTable(data))
    .catch(err => console.error('Error al obtener productos:', err));
}

function renderTable(products) {
  const tbody = document.getElementById('products-table');
  tbody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.precio}</td>
      <td>${p.cantidad}</td>
      <td>${p.descripcion || ''}</td>
      <td class="actions">
        <button class="edit-btn" onclick="editProduct(${p.id})">
          Editar
        </button>
        <button class="delete-btn" onclick="deleteProduct(${p.id})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);
  const cantidad = parseInt(document.getElementById('cantidad').value, 10);
  const descripcion = document.getElementById('descripcion').value;

  const producto = { nombre, precio, cantidad, descripcion };
  const opts = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  };

  if (id) {
    // Editar
    fetch(`${API_URL}/${id}`, { method: 'PUT', ...opts })
      .then(() => { resetForm(); fetchProducts(); });
  } else {
    // Crear
    fetch(API_URL, { method: 'POST', ...opts })
      .then(() => { resetForm(); fetchProducts(); });
  }
}

function editProduct(id) {
  // Obtener un solo producto no está implementado en el backend mock,
  // así que simplemente rellenamos desde la lista ya cargada:
  fetch(API_URL)
    .then(res => res.json())
    .then(list => {
      const p = list.find(x => x.id === id);
      document.getElementById('product-id').value = p.id;
      document.getElementById('nombre').value = p.nombre;
      document.getElementById('precio').value = p.precio;
      document.getElementById('cantidad').value = p.cantidad;
      document.getElementById('descripcion').value = p.descripcion;
      document.getElementById('submit-btn').textContent = 'Actualizar Producto';
    });
}

function deleteProduct(id) {
  if (confirm('¿Eliminar este producto?')) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts());
  }
}

function resetForm() {
  document.getElementById('product-id').value = '';
  document.getElementById('product-form').reset();
  document.getElementById('submit-btn').textContent = 'Agregar Producto';
}
