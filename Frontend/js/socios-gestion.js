         // {🔧 Inicialización de elementos
        const btnNuevo = document.getElementById("btnNuevoSocio");
        const btnVerLista = document.getElementById("btnVerLista");
        const identidad = document.querySelector(".contenedor-identidad");

        // {🧰 Funcion utilitarias}
        function mostrarIdentidad(visible) {
            if (visible) {
                identidad.classList.remove("oculto");
            } else {
                identidad.classList.add("oculto");
            }
        }

        const formulario = document.getElementById("formularioSocios");
        const lista = document.getElementById("listaSocios");
        const tabla = document.getElementById("tabla-socios");
        const form = document.getElementById("form-socios");

        const btnGuardar = document.getElementById("btnGuardar");
        const btnLimpiar = document.getElementById("btnLimpiar");
        const btnModificar = document.getElementById("btnModificar");
        const btnEliminar = document.getElementById("btnEliminar");

        const fotoInput = document.getElementById("foto");
        const fotoPreview = document.getElementById("fotoSocio");

        let modo = "nuevo"; // 'nuevo' | 'ver' | 'editar'
        let socioActual = null;

        // {🧰 Funcion utilitarias}
        function mostrarBotonVerLista() {
            btnVerLista.classList.remove("oculto");
            btnVerLista.style.display = "inline-block";
        }
        function ocultarBotonVerLista() {
            btnVerLista.classList.add("oculto");
            btnVerLista.style.display = "none";
        }

        function cargarFormulario(socio) {
            document.getElementById("idSocio").value = socio.id || "";
            document.getElementById("nombre").value = socio.nombre || "";
            document.getElementById("dni").value = socio.dni || "";
            document.getElementById("telefono").value = socio.telefono || "";
            document.getElementById("email").value = socio.email || "";
            document.getElementById("fechaNacimiento").value = socio.fechaNacimiento || "";
            document.getElementById("membresia").value = socio.membresia || "";
            fotoPreview.src = socio.foto && socio.foto !== "" ? socio.foto : "image/placeholder-foto.png";
        }

        function setModoFormulario(modo) {
            const campos = form.querySelectorAll("input, select");

            // Habilitar o deshabilitar campos según el modo
            campos.forEach(campo => {
                if (campo.id !== "idSocio") {
                    campo.disabled = (modo === "ver");
                }
            });

            // Foto: deshabilitar solo en modo ver
            fotoInput.disabled = (modo === "ver");

            // Botón Guardar
            if (modo === "ver") {
                btnGuardar.classList.add("oculto");
            } else {
                btnGuardar.classList.remove("oculto");
                btnGuardar.textContent = (modo === "editar") ? "Modificar datos" : "Guardar";
            }

            // Botón Limpiar (solo en nuevo)
            if (modo === "nuevo") {
                btnLimpiar.classList.remove("oculto");
            } else {
                btnLimpiar.classList.add("oculto");
            }

            // Botón Modificar y Eliminar (solo en ver)
            if (modo === "ver") {
                btnModificar.classList.remove("oculto");
                btnEliminar.classList.remove("oculto");
            } else {
                btnModificar.classList.add("oculto");
                btnEliminar.classList.add("oculto");
            }
        }

        // {📦 Cargar socios en tabla}
        function cargarSocios() {
            tabla.innerHTML = "";
            const socios = JSON.parse(localStorage.getItem("sociosRegistrados")) || [];

            socios.forEach((socio, index) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
        <td>${socio.nombre}</td>
        <td>${socio.dni}</td>
        <td>${socio.telefono}</td>
        <td>${socio.email}</td>
        <td>${socio.membresia}</td>
        <td>
          <button class="btn-editar" data-index="${index}">✏️</button>
          <button class="btn-eliminar" data-index="${index}">🗑️</button>
          <button class="btn-ver" data-index="${index}">👁️</button>
        </td>
      `;
                tabla.appendChild(fila);
            });

            tabla.querySelectorAll(".btn-ver").forEach(btn => {
                btn.addEventListener("click", () => verSocio(btn.dataset.index));
            });

            tabla.querySelectorAll(".btn-editar").forEach(btn => {
                btn.addEventListener("click", () => editarSocio(btn.dataset.index));
            });

            tabla.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", () => eliminarSocio(btn.dataset.index));
            });
        }

        // {👁️ Accion Ver socio}
        function verSocio(index) {
            const socios = JSON.parse(localStorage.getItem("sociosRegistrados")) || [];
            socioActual = socios[index];
            modo = "ver";
            cargarFormulario(socioActual);
            setModoFormulario("ver");
            formulario.classList.remove("oculto");
            mostrarIdentidad(true);
            lista.style.display = "none";
            btnNuevo.style.display = "none";
            mostrarBotonVerLista();
        }

        // {✏️ Accion Editar socio}
        function editarSocio(index) {
            verSocio(index);
            modo = "editar";
            setModoFormulario("editar");
            mostrarBotonVerLista();
        }

        // {🗑️ Accion Eliminar socio}
        function eliminarSocio(index) {
            if (!confirm("¿Estás seguro de que querés eliminar este socio?")) return;
            const socios = JSON.parse(localStorage.getItem("sociosRegistrados")) || [];
            socios.splice(index, 1);
            localStorage.setItem("sociosRegistrados", JSON.stringify(socios));
            cargarSocios();
        }

        // {📥 Registrar o modificar socio}
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const socio = {
                id: socioActual?.id || Date.now().toString(),
                nombre: document.getElementById("nombre").value.trim(),
                dni: document.getElementById("dni").value.trim(),
                telefono: document.getElementById("telefono").value.trim(),
                email: document.getElementById("email").value.trim(),
                fechaNacimiento: document.getElementById("fechaNacimiento").value,
                membresia: document.getElementById("membresia").value,
                foto: fotoPreview.src
            };

            if (!socio.nombre || !socio.dni || !socio.telefono || !socio.email || !socio.fechaNacimiento || !socio.membresia) {
                alert("Completá todos los campos.");
                return;
            }

            const socios = JSON.parse(localStorage.getItem("sociosRegistrados")) || [];

            if (modo === "nuevo") {
                socios.push(socio);
            } else if (modo === "editar" && socioActual) {
                const index = socios.findIndex(s => s.id === socioActual.id);
                if (index !== -1) {
                    socios[index] = socio;
                    localStorage.setItem("sociosRegistrados", JSON.stringify(socios));
                    alert("Los datos del socio fueron modificados correctamente.");
                    socioActual = socio;
                    verSocio(index);
                    return;
                }
            }

            localStorage.setItem("sociosRegistrados", JSON.stringify(socios));
            form.reset();
            btnVerLista.click();
        });

        // {🖼️ Cargar imagen en vista previa}
        fotoInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    fotoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // {🧭 Botones principales}
        btnNuevo.addEventListener("click", () => {
            modo = "nuevo";
            socioActual = null;
            form.reset();
            setModoFormulario("nuevo");
            formulario.classList.remove("oculto");
            mostrarIdentidad(false);
            lista.style.display = "none";
            btnNuevo.style.display = "none";
            mostrarBotonVerLista();
            fotoPreview.src = "image/placeholder-foto.png";
        });

        btnVerLista.addEventListener("click", () => {
            formulario.classList.add("oculto");
            mostrarIdentidad(false);
            lista.style.display = "block";
            ocultarBotonVerLista();
            btnNuevo.style.display = "inline-block";
            cargarSocios();
        });

        btnModificar.addEventListener("click", () => {
            modo = "editar";
            setModoFormulario("editar");
            mostrarBotonVerLista();
        });

        // {🚀 Inicialización}
        formulario.classList.add("oculto");
        mostrarIdentidad(false);
        cargarSocios();
