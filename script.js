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
  { nombre: "Burrito  mixto", precio: 3.00 },
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
let comprobanteGenerado = false; // ⚡ Nuevo: para controlar si ya se descargó el comprobante

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

  const ticketSection = document.querySelector('.ticket');
  ticketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  ticketSection.style.transition = 'background-color 0.3s';
  ticketSection.style.backgroundColor = '#fffae6';
  setTimeout(() => {
    ticketSection.style.backgroundColor = '#fff';
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
  comprobanteGenerado = false; // reinicia el estado
}

// ---------------------------
// Solicitar pedido por WhatsApp
// ---------------------------
async function solicitarPedido() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const comentario = document.getElementById("comentarioCliente")?.value.trim() || ""; // ✅ Nuevo campo

  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }

  if (ticketList.children.length === 0) {
    alert("Primero agrega productos al pedido.");
    return;
  }

  // ⚡ Si no se ha generado comprobante, hacerlo primero
  if (!comprobanteGenerado) {
    const exito = await generarComprobante(true); // modo automático
    if (!exito) return; // si falla, no continúa
  }

  // Construir mensaje del pedido
  let mensaje = `🍽 *Nuevo Pedido para llevar*\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n\n`;

  const items = ticketList.querySelectorAll("li");
  items.forEach(li => {
    const texto = li.textContent.replace("❌", "").trim();
    mensaje += `• ${texto}\n`;
  });

  mensaje += `\n💵 *Total:* $${total.toFixed(2)}`;

  // ✅ Agregar comentario si existe
  if (comentario) {
    mensaje += `\n📝 *Comentario:* ${comentario}`;
  }

  // Enviar por WhatsApp
  const numeroWhatsApp = "50372484861"; // Cambiar al número del dueño
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(urlWhatsApp, '_blank');

  // Reset automático del formulario y ticket
  resetTicket();
  document.getElementById("nombreCliente").value = "";
  if (document.getElementById("comentarioCliente")) {
    document.getElementById("comentarioCliente").value = "";
  }

  alert("✅ Pedido enviado con éxito, ¡Gracias por tu compra!");
}



// Generar comprobante de factura (sin comentario)
// ---------------------------
async function generarComprobante(auto = false) {
  const { jsPDF } = window.jspdf;
  const nombre = document.getElementById("nombreCliente").value.trim();
  const total = document.getElementById("total").textContent;
  const ticketList = document.querySelectorAll("#ticketList li");
  const fecha = new Date().toLocaleString();

  if (!nombre) {
    if (!auto) alert("Por favor, ingresa el nombre del cliente para generar el comprobante.");
    return false;
  }

  if (ticketList.length === 0) {
    if (!auto) alert("No hay productos en el pedido para generar un comprobante.");
    return false;
  }

  const doc = new jsPDF();

  // Encabezado centrado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Taquería Mercy", 105, 20, { align: "center" }); // centrado horizontalmente

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Comprobante de compra", 105, 28, { align: "center" }); // centrado en la misma línea vertical

  // Línea separadora
  doc.line(10, 32, 200, 32);

  doc.setFontSize(11);
  doc.text(`Cliente: ${nombre}`, 14, 42);
  doc.text(`Fecha: ${fecha}`, 14, 48);

  const productos = [];
  ticketList.forEach((item) => {
    const texto = item.textContent.replace("❌", "").trim();
    const partes = texto.split(" - $");
    const nombreProd = partes[0];
    const precio = partes[1];
    productos.push([nombreProd, `$${precio}`]);
  });

  doc.autoTable({
    startY: 55,
    head: [["Producto", "Precio"]],
    body: productos,
    styles: { fontSize: 11 },
    headStyles: { fillColor: [255, 150, 50] },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`Total a pagar: $${total}`, 14, finalY);

  // ⚠️ Nueva sección: Nota para el cliente
   // ⚠️ Nueva sección: Nota para el cliente
  const nota = `
Nota importante:
Su pedido estará listo en un plazo de 15 a 30 minutos.
Por favor, pase a retirar su pedido presentando este comprobante
y realice el pago en efectivo al momento de la entrega.
`;
  const notaFormateada = doc.splitTextToSize(nota, 180);

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(notaFormateada, 14, finalY + 10);

  // 📍 Dirección formateada
  const direccion = "Estamos ubicados en: 3ª Calle Oriente y 6 Av. Norte, media cuadra arriba de CAESS, Cojutepeque, Cuscatlán Sur.";
  const direccionFormateada = doc.splitTextToSize(direccion, 180);

  // 🔽 Espaciado después de la nota
  let nextY = finalY + 10 + notaFormateada.length * 5 + 8;

  // 🏠 Ubicación del local
  doc.setFont("helvetica", "bold");
  doc.text("Ubicación del local:", 14, nextY);
  doc.setFont("helvetica", "normal");
  doc.text(direccionFormateada, 14, nextY + 6);

  // 🙏 Frase de agradecimiento (último)
  const agradecimientoY = nextY + direccionFormateada.length * 5 + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Gracias por tu compra. ¡Vuelve pronto!", 14, agradecimientoY);

  doc.save(`Factura_${nombre}_${Date.now()}.pdf`);

  comprobanteGenerado = true; // ✅ marcar como generado

  if (!auto) alert("✅ Comprobante generado con éxito.");
  return true;
}






// 🟢 Ocultar loader cuando todo haya cargado
 window.addEventListener("load", function() {
    const loader = document.getElementById("loader");

    // Espera 2.5 segundos antes de ocultar el loader
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease";
      setTimeout(() => loader.style.display = "none", 500);
    }, 1800); // ← Aquí ajustas la duración (en milisegundos)
  });



// ❄️ Generador de nieve
const snowContainer = document.createElement("div");
document.body.appendChild(snowContainer);

function crearNieve() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = "❄";
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
  snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
  snowflake.style.opacity = Math.random();
  snowContainer.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 5000);
}

setInterval(crearNieve, 150);

