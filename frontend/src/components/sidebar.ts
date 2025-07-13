import {Collapse} from "bootstrap";

export class Sidebar {
    constructor() {
        this.initDropdown();
    }

    private initDropdown(): void {
        const categoriesMainLink = document.getElementById('categories-link');
        const categoriesDropdownElement = document.getElementById('categories-dropdown');

        if (!categoriesDropdownElement) return;

        const categoriesDropdown = new Collapse(
            categoriesDropdownElement,
            { toggle: false }
        );

        categoriesMainLink?.addEventListener('click', (e: Event) => {
            e.preventDefault();
            if ((categoriesDropdown as any)._isShown()) {
                categoriesDropdown.hide();
            } else {
                categoriesDropdown.show();
            }
        });
    }
}