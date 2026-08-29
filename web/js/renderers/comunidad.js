"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";
import { banderas } from "/js/data/banderas.js";

const comunidadRenderer = {
    asDropdownItem: function (comunidad, seccion, filtro) {
        let nombre = comunidad.nombre.replace(filtro, "").trim();
        let bandera = ""
        if (seccion === "Selectividad") {
            nombre = nombre.split(" ").slice(1).join(" ");
            const nombre_bandera = Object.keys(banderas)
                .find(com_aut => nombre.includes(com_aut));
            bandera = `<img src="/images/${banderas[nombre_bandera]}" class="bandera me-2">`;
        }

        let html = `
        <li class="px-1">
            <button class="dropdown-item dropdown-comunidad rounded rounded-pill" data-comunidad-id="${comunidad.id}">
                ${bandera}
                <span>${nombre}</span>
            </button>
        </li>`;
        return parseHTML(html);
    },

    asNavItem: function (comunidad) {
        let html = `
        <li class="nav-item me-2">
            <a class="nav-link" role="button" data-comunidad-id="${comunidad.id}">
                ${comunidad.nombre}
            </a>
        </li>`;
        return parseHTML(html);
    },
};

export { comunidadRenderer };