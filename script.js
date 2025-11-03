const menu = [
  { nombre: "Tacos de Res", precio: 3.50 },
  { nombre: "Tacos de pollo", precio: 3.00 },
  { nombre: "Tacos de pastor", precio: 3.00 },
  { nombre: "Tacos mixtos", precio: 3.00 },
  { nombre: "Tortas de Res", precio: 3.50 },
  { nombre: "Tortas de pollo", precio: 3.00 },
  { nombre: "Tortas de pastor", precio: 3.00 },
  { nombre: "Tortas mixtas", precio: 3.00 },
  { nombre: "Burrito de Res", precio: 3.50 },
  { nombre: "Burrito de pollo", precio: 3.00 },
  { nombre: "Burrito de pastor", precio: 3.00 },
  { nombre: "Burrito de mixto", precio: 3.00 },
  { nombre: "Quesadilla de Res", precio: 3.50 },
  { nombre: "Quesadilla de pollo", precio: 3.00 },
  { nombre: "Quesadilla de pastor", precio: 3.00 },
  { nombre: "Quesadilla mixta", precio: 3.00 },
  { nombre: "Pan con Ajo", precio: 1.00 },
  { nombre: "Nachos", precio: 2.00 },
  { nombre: "Sodas enlatadas", precio: 1.00 },
  { nombre: "Sodas de envase", precio: 1.00 },
  { nombre: "Jugos del valle", precio: 1.00 },
  { nombre: "Gatorade", precio: 1.25 },
  { nombre: "Powerade", precio: 1.25 },
  { nombre: "Botella de agua", precio: 0.50 },
];

const menuItemsDiv = document.getElementById("menuItems");
const ticketList = document.getElementById("ticketList");
const totalSpan = document.getElementById("total");
let total = 0;

// Variables para almacenar coordenadas del cliente
let usuarioLat = null;
let usuarioLon = null;

// ---------------------------
// Generar menú dinámico
// ---------------------------
menu.forEach(item => {
  const card = document.createElement("div");
  card.className = "menu-card";
  card.innerHTML = `
    <span>${item.nombre} - $${item.precio.toFixed(2)}</span>
    <button onclick='agregarAlTicket("${item.nombre}", ${item.precio})'>Agregar</button>
  `;
  menuItemsDiv.appendChild(card);
});

// ---------------------------
// Agregar producto al ticket
// ---------------------------
function agregarAlTicket(nombre, precio) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${nombre} - $${precio.toFixed(2)}
    <button class="btn-delete" onclick="eliminarItem(this, ${precio})">❌</button>
  `;
  ticketList.appendChild(li);
  total += precio;
  totalSpan.textContent = total.toFixed(2);

  // ---------------------------
  // Scroll automático al ticket
  // ---------------------------
  const ticketSection = document.querySelector('.ticket');
  ticketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // ---------------------------
  // Resaltar ticket brevemente
  // ---------------------------
  ticketSection.style.transition = 'background-color 0.3s';
  ticketSection.style.backgroundColor = '#fffae6'; // color temporal
  setTimeout(() => {
    ticketSection.style.backgroundColor = '#fff'; // color original
  }, 500);
}

// ---------------------------
// Eliminar producto del ticket
// ---------------------------
function eliminarItem(button, precio) {
  const li = button.parentElement;
  ticketList.removeChild(li);
  total -= precio;
  totalSpan.textContent = total.toFixed(2);
}

// ---------------------------
// Resetear ticket
// ---------------------------
function resetTicket() {
  ticketList.innerHTML = "";
  total = 0;
  totalSpan.textContent = "0.00";
}

// ---------------------------
// Solicitar pedido por WhatsApp y abrir Waze
// ---------------------------
function solicitarPedido() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccionGPS = document.getElementById("direccionCliente").value.trim();
  const direccionAlt = document.getElementById("direccionAlternativa") 
                        ? document.getElementById("direccionAlternativa").value.trim() 
                        : "";

  // Prioriza la dirección alternativa si el usuario la ingresa
  const direccion = direccionAlt || direccionGPS;

  if (!nombre || !direccion) {
    alert("Por favor, completa tu nombre y dirección.");
    return;
  }

  if (ticketList.children.length === 0) {
    alert("Primero agrega productos al pedido.");
    return;
  }

  // Construir mensaje del pedido
  let mensaje = `🍽 *Nuevo Pedido para llevar*\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n\n`;

  const items = ticketList.querySelectorAll("li");
  items.forEach(li => {
    const texto = li.textContent.replace("❌", "").trim();
    mensaje += `• ${texto}\n`;
  });

  mensaje += `\n💵 *Total:* $${total.toFixed(2)}`;

  // Enviar por WhatsApp
  const numeroWhatsApp = "50372484861"; // Cambiar al número del dueño
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(urlWhatsApp, '_blank');

  // Abrir Waze usando coordenadas del GPS si están disponibles
  if (usuarioLat && usuarioLon) {
    const urlWaze = `https://www.waze.com/ul?ll=${usuarioLat},${usuarioLon}&navigate=yes`;
    window.open(urlWaze, '_blank');
  }

  // Reset automático del formulario y ticket
  resetTicket();
  document.getElementById("nombreCliente").value = "";
  document.getElementById("direccionCliente").value = "";
  if (document.getElementById("direccionAlternativa")) {
    document.getElementById("direccionAlternativa").value = "";
  }

  alert("✅ Pedido enviado con éxito, ¡Gracias por tu compra!");
}

// ---------------------------
// Formulario de feedback
// ---------------------------
const form = document.getElementById("feedbackForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch("/api/feedback", {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    statusMsg.innerText = "✅ Mensaje enviado con éxito";
    statusMsg.style.color = "green";
    form.reset();
  })
  .catch(error => {
    console.error(error);
    statusMsg.innerText = "❌ Error al enviar mensaje";
    statusMsg.style.color = "red";
  });
});

// ---------------------------
// Obtener ubicación automáticamente
// ---------------------------
function obtenerUbicacion() {
  const direccionInput = document.getElementById('direccionCliente');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Guardar coordenadas para Waze
        usuarioLat = lat;
        usuarioLon = lon;

        try {
          // Usamos API de geocodificación inversa gratuita de OpenStreetMap (Nominatim)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await response.json();
          direccionInput.value = data.display_name || "Ubicación encontrada";
        } catch (error) {
          direccionInput.value = "No se pudo obtener la dirección";
          console.error(error);
        }
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            direccionInput.value = "Permiso denegado para acceder a la ubicación";
            break;
          case error.POSITION_UNAVAILABLE:
            direccionInput.value = "Ubicación no disponible";
            break;
          case error.TIMEOUT:
            direccionInput.value = "Tiempo de espera agotado";
            break;
          default:
            direccionInput.value = "Error desconocido";
        }
      }
    );
  } else {
    direccionInput.value = "Geolocalización no soportada por tu navegador";
  }
}
