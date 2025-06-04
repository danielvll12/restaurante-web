const menu = [
  { nombre: "Tacos de pollo", precio: 3.00 },
  { nombre: "Tacos de carne", precio: 3.50 },
  { nombre: "Torta de Pollo", precio: 3.00 },
  { nombre: "Torta de carne", precio: 3.50 },
  { nombre: "Burrito Especial", precio: 3.50 },
  { nombre: "Pan de Ajo", precio: 1.00 },
  { nombre: "Refresco de sabores", precio: 0.75 },
  { nombre: "Coca-Cola Lata", precio: 1.25 },
  { nombre: "Botella de agua", precio: 0.75 }
];

const menuItemsDiv = document.getElementById("menuItems");
const ticketList = document.getElementById("ticketList");
const totalSpan = document.getElementById("total");
let total = 0;

menu.forEach(item => {
  const card = document.createElement("div");
  card.className = "menu-card";
  card.innerHTML = `
    <span>${item.nombre} - $${item.precio.toFixed(2)}</span>
    <button onclick='agregarAlTicket("${item.nombre}", ${item.precio})'>Agregar</button>
  `;
  menuItemsDiv.appendChild(card);
});

function agregarAlTicket(nombre, precio) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${nombre} - $${precio.toFixed(2)}
    <button class="btn-delete" onclick="eliminarItem(this, ${precio})">❌</button>
  `;
  ticketList.appendChild(li);
  total += precio;
  totalSpan.textContent = total.toFixed(2);
}

function eliminarItem(button, precio) {
  const li = button.parentElement;
  ticketList.removeChild(li);
  total -= precio;
  totalSpan.textContent = total.toFixed(2);
}

function resetTicket() {
  ticketList.innerHTML = "";
  total = 0;
  totalSpan.textContent = "0.00";
}

function solicitarPedido() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();

  if (!nombre || !direccion) {
    alert("Por favor, completa tu nombre y dirección.");
    return;
  }

  if (ticketList.children.length === 0) {
    alert("Primero agrega productos al pedido.");
    return;
  }

  let mensaje = `🍽 *Nuevo Pedido para llevar*\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n\n`;

  const items = ticketList.querySelectorAll("li");
  items.forEach(li => {
    const texto = li.textContent.replace("❌", "").trim();
    mensaje += `• ${texto}\n`;
  });

  mensaje += `\n💵 *Total:* $${total.toFixed(2)}`;

  const numeroWhatsApp = "50374811907"; // Cambia este número por el del dueño
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  // Abrir WhatsApp
  window.open(url, '_blank');

  // ✅ Reset automático
  resetTicket();
  document.getElementById("nombreCliente").value = "";
  document.getElementById("direccionCliente").value = "";

  // ✅ Mensaje de confirmación
  alert("✅ Pedido enviado con éxito, ¡Gracias por tu compra!");
}


 
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("loader").style.display = "none";
    }, 5000); // 3000 milisegundos = 3 segundos
  });

