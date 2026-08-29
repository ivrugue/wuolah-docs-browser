"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const documentoRenderer = {
    asListItem: function (documento, asignatura_slug) {
        const html = `
        <a href="https://wuolah.com/estudia/${asignatura_slug}/${documento.slug}" 
                class="list-group-item list-group-item-action d-flex align-items-center gap-2 text-decoration-none" 
                target="_blank">
            <i class="bi bi-file-earmark-pdf text-danger"></i>
            <span class="flex-grow-1">
                ${documento.nombre
                    .replace(".pdf", "")
                    .replace("organized", "")
                    .replace(/(?<!\d)-|-(?!\d)/g, " ")}
            </span>
            <i class="bi bi-box-arrow-up-right small text-muted icono-enlace"></i>
        </a>
        `;

        return parseHTML(html);
    },
};

export { documentoRenderer };