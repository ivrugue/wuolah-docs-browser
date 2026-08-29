"use strict";

import { supabase } from "/js/supabase.js";
import { state, subscribe } from "/js/state.js";
import { cursoRenderer } from "/js/renderers/curso.js";
import { asignaturaRenderer } from "/js/renderers/asignatura.js";
import { categoriaRenderer } from "/js/renderers/categoria.js";


// Título
const titulo = document.getElementById("titulo");


// Cursos
const selector_cursos = document.getElementById("selector_cursos");

selector_cursos.addEventListener("click", (event) => {
    const link = event.target.closest("[data-curso]");
    if (!link) {
        return;
    }

    event.preventDefault();

    const new_curso = Number(link.dataset.curso);

    if (new_curso !== state.curso) {
        state.curso = new_curso;
    }
});

function actualizarCursoActivo() {
    const links = selector_cursos.querySelectorAll("[data-curso]");

    links.forEach((link) => {
        link.classList.toggle(
            "active",
            Number(link.dataset.curso) === state.curso
        );
    });
}


// Asignaturas
const selector_asignaturas = document.getElementById("selector_asignaturas");

selector_asignaturas.addEventListener("shown.bs.collapse", (event) => {
    if (!event.target.hasAttribute("data-asignatura-id")) {
        return;
    }

    const asignatura_id = Number(event.target.dataset.asignaturaId);
    renderDocumentos(asignatura_id);
});


// Control de versiones para evitar que una petición antigua sobrescriba una actualización más reciente
let renderVersion = 0;


// Renderizar comunidad completa
async function renderComunidad() {
    const version = ++renderVersion;
    const comunidad_id = state.comunidad_id;

    if (comunidad_id === null) {
        titulo.textContent = "";
        selector_cursos.replaceChildren();
        selector_asignaturas.replaceChildren();
        return;
    }

    const [resultadoComunidad, resultadoCursos] = await Promise.all([
        supabase
            .from("comunidades")
            .select("nombre")
            .eq("id", comunidad_id)
            .single(),

        supabase
            .from("asignaturas")
            .select("curso")
            .eq("comunidad_id", comunidad_id)
            .order("curso")
    ]);

    // Descartar resultados si cambió comunidad durante espera
    if (version !== renderVersion) {
        return;
    }

    if (resultadoComunidad.error) {
        console.error(resultadoComunidad.error);
        return;
    }

    if (resultadoCursos.error) {
        console.error(resultadoCursos.error);
        return;
    }

    const cursos = [
        ...new Set(resultadoCursos.data.map(({ curso }) => curso))
    ];

    const cursosFragment = document.createDocumentFragment();
    if (cursos.length > 1) {
        for (const curso of cursos) {
            cursosFragment.appendChild(
                cursoRenderer.asNavItem(curso)
            );
        }
    }

    // Cargar asignaturas del primer curso
    const curso = cursos[0];
    const { data: asignaturas, error } = await supabase
        .from("asignaturas")
        .select("*")
        .eq("comunidad_id", comunidad_id)
        .eq("curso", curso)
        .order("nombre");

    if (version !== renderVersion) {
        return;
    }

    if (error) {
        console.error(error);
        return;
    }


    const asignaturasFragment = document.createDocumentFragment();
    for (const asignatura of asignaturas) {
        asignaturasFragment.appendChild(
            asignaturaRenderer.asCard(asignatura)
        );
    }

    // Actualizar interfaz
    titulo.textContent = resultadoComunidad.data.nombre.replace(" -", "\u00A0-");

    selector_cursos.replaceChildren(cursosFragment);
    selector_cursos.classList.toggle("nav-tabs", cursos.length > 1);

    selector_asignaturas.replaceChildren(asignaturasFragment);

    state.curso = curso;
    actualizarCursoActivo();
}


// Renderizar únicamente las asignaturas al cambiar de curso
async function renderCurso() {
    const comunidad_id = state.comunidad_id;
    const curso = state.curso;

    if (comunidad_id === null || curso === undefined) {
        return;
    }

    const { data: asignaturas, error } = await supabase
        .from("asignaturas")
        .select("*")
        .eq("comunidad_id", comunidad_id)
        .eq("curso", curso)
        .order("nombre");

    if (error) {
        console.error(error);
        return;
    }

    // Comprobar que la comunidad y el curso siguen siendo los mismos cuando termina la petición
    if (
        comunidad_id !== state.comunidad_id ||
        curso !== state.curso
    ) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const asignatura of asignaturas) {
        fragment.appendChild(
            asignaturaRenderer.asCard(asignatura)
        );
    }

    selector_asignaturas.replaceChildren(fragment);

    actualizarCursoActivo();
}


// Documentos y carpetas
async function renderDocumentos(asignatura_id) {
    const docs_card = document.querySelector(
        `#docs-${asignatura_id} .card-body`
    );

    if (!docs_card) {
        return;
    }

    if (docs_card.dataset.loaded === "true") {
        return;
    }

    const comunidad_id = state.comunidad_id;

    const { data: asignatura, error: error_asignatura } = await supabase
        .from("asignaturas")
        .select("slug")
        .eq("id", asignatura_id)
        .eq("comunidad_id", comunidad_id)
        .single();

    if (error_asignatura) {
        console.error(error_asignatura);
        return;
    }

    const { data: carpetas, error: error_carpetas } = await supabase
        .from("carpetas")
        .select("*")
        .eq("comunidad_id", comunidad_id)
        .eq("asignatura_id", asignatura_id);

    if (error_carpetas) {
        console.error(error_carpetas);
        return;
    }

    const { data: documentos, error: error_documentos } = await supabase
        .from("documentos")
        .select("*")
        .eq("comunidad_id", comunidad_id)
        .eq("asignatura_id", asignatura_id);

    if (error_documentos) {
        console.error(error_documentos);
        return;
    }

    documentos.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { numeric: true })
    );

    carpetas.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { numeric: true })
    );


    const categorias = {};

    for (const carpeta of carpetas) {
        if (!categorias[carpeta.categoria]) {
            categorias[carpeta.categoria] = {
                carpetas: [],
                documentos: []
            };
        }

        categorias[carpeta.categoria].carpetas.push({
            ...carpeta,
            documentos: []
        });
    }


    for (const documento of documentos) {
        if (!categorias[documento.categoria]) {
            categorias[documento.categoria] = {
                carpetas: [],
                documentos: []
            };
        }

        if (documento.carpeta_id === null) {
            categorias[documento.categoria].documentos.push(documento);
        } else {
            const carpeta = categorias[documento.categoria].carpetas
                .find(carpeta => carpeta.id === documento.carpeta_id);

            if (carpeta) {
                carpeta.documentos.push(documento);
            }
        }
    }


    docs_card.replaceChildren();

    for (
        const [categoria, contenido]
        of Object.entries(categorias)
            .sort(([a], [b]) => a.localeCompare(b))
    ) {
        docs_card.appendChild(
            categoriaRenderer.asSection(
                categoria,
                contenido,
                asignatura.slug
            )
        );
    }

    docs_card.dataset.loaded = "true";
}


// Estado
subscribe((propiedad) => {
    if (propiedad === "comunidad_id") {
        renderComunidad();
    }

    if (propiedad === "curso") {
        renderCurso();
    }
});
