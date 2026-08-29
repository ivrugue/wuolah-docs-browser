"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";
import { carpetaRenderer } from "/js/renderers/carpeta.js";
import { documentoRenderer } from "/js/renderers/documento.js";

const categoriaRenderer = {
    asSection: function (categoria, contenido, asignatura_slug) {
        const html = `
        <div class="categoria mb-3">
            <h6 class="text-muted fw-bold mb-1">${categoria}</h6>
            <div class="list-group list-group-flush"></div>
        </div>
        `;
        const categoria_section = parseHTML(html);
        const categoria_contenido = categoria_section.querySelector(".list-group");

        for (let carpeta of contenido.carpetas) {
            categoria_contenido.appendChild(carpetaRenderer.asListItem(carpeta, asignatura_slug));
        }
        for (let documento of contenido.documentos) {
            categoria_contenido.appendChild(documentoRenderer.asListItem(documento, asignatura_slug));
        }

        return categoria_section;
    },
};

export { categoriaRenderer };