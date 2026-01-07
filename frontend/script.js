// Cargar productos
fetch('http://localhost:3001/api/productos')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    data.forEach(p => {
      contenedor.innerHTML += `
        <div class="producto">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <p><strong>$${p.precio}</strong></p>
          <button onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
        </div>
      `;
    });
  });

function agregarCarrito(id) {
  fetch('http://localhost:3002/api/carrito', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ producto_id: id, cantidad: 1 })
  })
  .then(res => res.json())
  .then(data => alert(data.mensaje));
}

function verCarrito() {
  fetch('http://localhost:3002/api/carrito')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('carrito');
      contenedor.innerHTML = '';
      let total = 0;

      data.forEach(p => {
        total += p.precio * p.cantidad;

        contenedor.innerHTML += `
          <div class="item-carrito">
            <span>${p.nombre}</span>

            <input type="number" min="1" value="${p.cantidad}"
              onchange="actualizarCantidad(${p.id}, this.value)">

            <span>$${(p.precio * p.cantidad).toFixed(2)}</span>

            <button onclick="eliminarItem(${p.id})">❌</button>
          </div>
        `;
      });

      contenedor.innerHTML += `
        <hr>
        <strong>Total: $${total.toFixed(2)}</strong>
        <br><br>
        <button class="btn-finalizar" onclick="finalizarCompra()">
          Finalizar compra
        </button>
      `;
    });
}

function actualizarCantidad(id, cantidad) {
  fetch(`http://localhost:3002/api/carrito/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad })
  })
  .then(res => res.json())
  .then(data => alert(data.mensaje));
}

function eliminarItem(id) {
  fetch(`http://localhost:3002/api/carrito/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => verCarrito());
}

function finalizarCompra() {
  fetch('http://localhost:3002/api/carrito')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert('El carrito está vacío');
        return;
      }

      let resumen = 'Resumen de compra:\n\n';
      let total = 0;

      data.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;
        resumen += `${p.nombre} x ${p.cantidad} = $${subtotal.toFixed(2)}\n`;
      });

      resumen += `\nTOTAL A PAGAR: $${total.toFixed(2)}`;

      alert(resumen);

      // Vaciar carrito
      data.forEach(p => {
        fetch(`http://localhost:3002/api/carrito/${p.id}`, {
          method: 'DELETE'
        });
      });

      verCarrito();
    });
}
