"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const cursoRenderer = {
    asNavItem: function (curso) {
        const html = `
        <li class="nav-item">
            <button class="nav-link" type="button" data-curso="${curso}">
                ${curso}º
            </button>
        </li>
        `;
        return parseHTML(html);
    },
};

export { cursoRenderer };