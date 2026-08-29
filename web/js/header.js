"use strict";

import { supabase } from "/js/supabase.js";
import { state } from "/js/state.js";
import { comunidadRenderer } from "/js/renderers/comunidad.js";
import { seccionRenderer } from "/js/renderers/seccion.js";


const navbarNav = document.getElementById("navbarNav");
const navbar = document.querySelector(".navbar");

navbarNav.addEventListener("show.bs.collapse", () => {
    navbar.classList.add("navbar-open-shadow");
});
navbarNav.addEventListener("hide.bs.collapse", () => {
    navbar.classList.remove("navbar-open-shadow");
});


const selector_comunidades = document.getElementById("selector_comunidades");
selector_comunidades.addEventListener("click", (event) => {
    const link = event.target.closest("[data-comunidad-id]");
    if (!link) {
        return;
    }

    event.preventDefault();

    let new_comunidad_id = Number(link.dataset.comunidadId);
    if (new_comunidad_id !== state.comunidad_id) {
        state.comunidad_id = new_comunidad_id;
    }

    // Cerrar el navbar collapse
    const collapseInstance = bootstrap.Collapse.getInstance(navbarNav);
    if (collapseInstance) {
        collapseInstance.hide();
    }
});

// Para añadir un desplegable: escribir filtro
// Para añadir una comunidad directamente: null
const secciones = {
    "ETSII (US)": "(US)",
    "Selectividad": "- Prueba de Acceso a la Universidad",
    "Bachillerato": null,
    "ESO": null,
    "Idiomas": null,
}


async function cargarSecciones() {
    const promesas = Object.entries(secciones).map(async ([nombre, filtro]) => {
        let seccion;

        if (filtro) {
            seccion = seccionRenderer.asNavItem(nombre);
            const menu = seccion.querySelector("ul");

            const { data: comunidades, error } = await supabase
                .from("comunidades_con_documentos")
                .select("*")
                .like("nombre", `%${filtro}`)
                .order("numero_documentos", { ascending: false })
                .order("nombre");

            if (error) {
                console.error(error);
                return seccion;
            }

            for (const comunidad of comunidades) {
                menu.appendChild(
                    comunidadRenderer.asDropdownItem(comunidad, nombre, filtro)
                );
            }

        } else {
            const { data: comunidad, error } = await supabase
                .from("comunidades")
                .select("*")
                .like("nombre", nombre)
                .single();

            if (error) {
                console.error(error);
                return null;
            }

            seccion = comunidadRenderer.asNavItem(comunidad);
        }

        return seccion;
    });

    const resultados = await Promise.all(promesas);

    const primeraComunidad = resultados
    .flatMap(seccion => [...seccion.querySelectorAll("[data-comunidad-id]")])
    .at(0);
    if (state.comunidad_id === null && primeraComunidad) {
        state.comunidad_id = Number(primeraComunidad.dataset.comunidadId);
    }

    const fragment = document.createDocumentFragment();

    for (const seccion of resultados) {
        if (seccion) {
            fragment.appendChild(seccion);
        }
    }

    selector_comunidades.appendChild(fragment);
}

cargarSecciones();



function ajustarEspacioNavbar() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const altura = `${navbar.offsetHeight}px`;
    document.body.style.paddingTop = altura;
    document.documentElement.style.setProperty('--navbar-height', altura);
  }
}

// Ejecutar al cargar y al redimensionar la ventana
window.addEventListener('DOMContentLoaded', ajustarEspacioNavbar);
window.addEventListener('resize', ajustarEspacioNavbar);