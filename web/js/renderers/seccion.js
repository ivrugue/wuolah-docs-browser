"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

function normalizarId(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

const seccionRenderer = {
    asNavItem: function (nombre) {
        let html = `
        <li class="nav-item dropdown me-2">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                ${nombre}
            </a>
            <div class="dropdown-menu dropdown-menu-light fondo-light rounded rounded-4 border shadow py-2 overflow-hidden">
                <ul class="list-unstyled m-0 dropdown-menu-scroll" id="menu-${normalizarId(nombre)}">
                    
                </ul>
            </div>
        </li>`;
        return parseHTML(html);
    },
};

export { seccionRenderer };