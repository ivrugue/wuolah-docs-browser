"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const asignaturaRenderer = {
    asCard: function (asignatura) {
        const html = `
        <div class="card mb-3 rounded rounded-4">
            <button class="card-header border-bottom-0 desplegable btn w-100 text-start d-flex justify-content-between align-items-center"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#docs-${asignatura.id}"
                    aria-expanded="false"
                    aria-controls="docs-${asignatura.id}">
                <span>${asignatura.nombre}</span>
                <i class="bi bi-chevron-down"></i>
            </button>

            <div id="docs-${asignatura.id}"
                class="collapse"
                data-asignatura-id="${asignatura.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-center">
                        <div class="loader" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        return parseHTML(html);
    },
};

export { asignaturaRenderer };