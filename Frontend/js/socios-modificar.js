// ==========================
// Gestión de Socios - JS
// ==========================

// === Buscador de socios ===
const inputBuscar = document.getElementById("buscarSocio");
if (inputBuscar) {
  inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.toLowerCase();
    const filas = document.querySelectorAll("#tablaSocios tr");
    filas.forEach(fila => {
      const nombre = fila.children[1].textContent.toLowerCase();
      fila.style.display = nombre.includes(texto) ? "" : "none";
    });
  });
}

// === Eliminar socio ===
document.querySelectorAll(".btn-eliminar").forEach(btn => {
  btn.addEventListener("click", e => {
    if (confirm("¿Seguro que querés eliminar este socio?")) {
      e.target.closest("tr").remove();
    }
  });
});

// === Imprimir carnet de socio ===
document.querySelectorAll(".btn-imprimir").forEach(btn => {
  btn.addEventListener("click", () => {
    const fila = btn.closest("tr");
    const id = fila.children[0].textContent;
    const nombre = fila.children[1].textContent;
    const dni = fila.children[2].textContent;
    const membresia = fila.children[3].textContent;
    const telefono = fila.children[4].textContent;
    const email = fila.children[5].textContent;

    // Foto del socio o ícono SVG por defecto
    const fotoSrc = fila.dataset.foto || 
      "data:image/svg+xml;base64," + btoa(`
        <svg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 100 100'>
          <rect width='100' height='100' rx='12' fill='#e6f0ff'/>
          <circle cx='50' cy='35' r='18' fill='#007bff'/>
          <rect x='25' y='60' width='50' height='30' rx='10' fill='#007bff'/>
        </svg>`);

    // Nueva ventana con el carnet
    const ventana = window.open("", "", "width=750,height=850,resizable=yes,scrollbars=yes");
    ventana.document.write(`
      <html>
        <head>
          <title>Carnet de Socio</title>
          <style>
            @page { size: A5; margin: 0; }
            body {
              background-color: #f4f8ff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .carnet-container {
              width: 420px;
              border-radius: 15px;
              border: 3px solid #007bff;
              padding: 20px 25px;
              text-align: center;
              font-family: 'Segoe UI', Arial, sans-serif;
              background: linear-gradient(180deg, #ffffff 0%, #e7f0ff 100%);
              box-shadow: 0 0 8px rgba(0,0,0,0.15);
            }
            .logo {
              width: 80px;
              margin-bottom: 5px;
            }
            .foto-socio {
              width: 110px;
              height: 110px;
              object-fit: cover;
              border-radius: 10px;
              border: 2px solid #007bff;
              background-color: #f8f9ff;
            }
            .qr-placeholder {
              width: 110px;
              height: 110px;
              border: 2px dashed #007bff;
              border-radius: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              color: #007bff;
              background-color: #f0f6ff;
              text-align: center;
              padding: 5px;
            }
            .carnet-container h2 {
              color: #007bff;
              margin: 0;
            }
            .carnet-container h4 {
              color: #333;
              margin: 5px 0 10px;
            }
            .carnet-container p {
              font-size: 15px;
              margin: 6px 0;
            }
            .carnet-container hr {
              border: 1px solid #007bff;
              margin: 10px 0 15px;
            }
            .foto-qr-row {
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-top: 10px;
            }
            footer {
              font-size: 11px;
              color: #666;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="carnet-container">
            <img src="image/logo02Azul.png" alt="Logo" class="logo">
            <h2>CUERPO SANO</h2>
            <h4>Carnet de Socio</h4>
            <hr>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>DNI:</strong> ${dni}</p>
            <p><strong>Membresía:</strong> ${membresia}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Alta:</strong> ${new Date().toLocaleDateString()}</p>

            <div class="foto-qr-row">
              <img src="${fotoSrc}" alt="Foto del socio" class="foto-socio">
              <div class="qr-placeholder">
                <strong>QR</strong><br>
                Espacio reservado<br>
                (React)
              </div>
            </div>

            <hr>
            <footer>© Cuerpo Sano - Gimnasio | Uso exclusivo del socio</footer>
          </div>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
  });
});

// ==========================
// NUEVA FUNCIÓN: Editar socio
// ==========================

// Crear modal dinámicamente si no existe
if (!document.getElementById("modalEditar")) {
  const modalHTML = `
    <div id="modalEditar" class="modal">
      <div class="modal-contenido">
        <h3>Editar Socio</h3>
        <form id="formEditarSocio">
          <input type="hidden" id="editId" />
          <label>Nombre:</label>
          <input type="text" id="editNombre" required />

          <label>DNI:</label>
          <input type="number" id="editDni" required />

          <label>Membresía:</label>
          <input type="text" id="editMembresia" required />

          <label>Teléfono:</label>
          <input type="text" id="editTelefono" required />

          <label>Email:</label>
          <input type="email" id="editEmail" required />

          <div class="botones-modal">
            <button type="submit" class="btn-login">Guardar</button>
            <button type="button" id="cancelarEdicion" class="btn-login">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Estilos mínimos si no están en el CSS
const estiloModal = document.createElement("style");
estiloModal.innerHTML = `
.modal {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-contenido {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.botones-modal {
  display: flex;
  justify-content: space-between;
}
`;
document.head.appendChild(estiloModal);

// === Funcionalidad de edición ===
const modal = document.getElementById("modalEditar");
const formEditar = document.getElementById("formEditarSocio");
let filaActual = null;

// Abrir modal y cargar datos
document.querySelectorAll(".btn-editar").forEach(btn => {
  btn.addEventListener("click", () => {
    filaActual = btn.closest("tr");
    document.getElementById("editId").value = filaActual.children[0].textContent;
    document.getElementById("editNombre").value = filaActual.children[1].textContent;
    document.getElementById("editDni").value = filaActual.children[2].textContent;
    document.getElementById("editMembresia").value = filaActual.children[3].textContent;
    document.getElementById("editTelefono").value = filaActual.children[4].textContent;
    document.getElementById("editEmail").value = filaActual.children[5].textContent;
    modal.style.display = "flex";
  });
});

// Cerrar modal
document.getElementById("cancelarEdicion").addEventListener("click", () => {
  modal.style.display = "none";
});

// Guardar cambios
formEditar.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!filaActual) return;

  filaActual.children[1].textContent = document.getElementById("editNombre").value;
  filaActual.children[2].textContent = document.getElementById("editDni").value;
  filaActual.children[3].textContent = document.getElementById("editMembresia").value;
  filaActual.children[4].textContent = document.getElementById("editTelefono").value;
  filaActual.children[5].textContent = document.getElementById("editEmail").value;

  modal.style.display = "none";
  alert("Datos del socio actualizados correctamente.");
});
