"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";
import { documentoRenderer } from "/js/renderers/documento.js";

const carpetaRenderer = {
    asListItem: function (carpeta, asignatura_slug) {
        const html = `
        <div class="list-group-item p-0">
            <button class="desplegable list-group-item-action btn w-100 rounded-0 text-start d-flex align-items-center gap-2 px-3 py-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#carpeta-${carpeta.id}"
                    aria-expanded="false"
                    aria-controls="carpeta-${carpeta.id}">
                
                <span class="icono-carpeta">
                    <i class="bi bi-folder text-primary carpeta-cerrada"></i>
                    <i class="bi bi-folder2-open text-primary carpeta-abierta"></i>
                </span>
                <span class="flex-grow-1">${carpeta.nombre}</span>
                <i class="bi bi-chevron-down"></i>
            </button>

            <div id="carpeta-${carpeta.id}" class="collapse">
                <div class="ms-4">
                    <div class="enlace-carpeta px-3 pt-0 pb-2">
                        <a href="https://wuolah.com/apuntes/${asignatura_slug}/${carpeta.documentos[0].slug}" 
                        class="text-decoration-none text-muted small d-inline-flex align-items-center gap-1" 
                        target="_blank">
                            <i class="bi bi-box-arrow-up-right"></i>
                            <span>Abrir carpeta en Wuolah</span>
                        </a>
                    </div>

                    <div class="list-group list-group-flush"></div>
                </div>
            </div>
        </div>
        `;

        const carpeta_element = parseHTML(html);
        const contenido = carpeta_element.querySelector(".list-group");

        for (const documento of carpeta.documentos) {
            contenido.appendChild(
                documentoRenderer.asListItem(documento, asignatura_slug)
            );
        }

        return carpeta_element;
    },
};

export { carpetaRenderer };