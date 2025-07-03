export class Sidebar {
    constructor() {
        this.initDropdown();
    }

    initDropdown() {
        const categoriesMainLink = document.getElementById('categories-link');
        const categoriesDropdown = new bootstrap.Collapse(
            document.getElementById('categories-dropdown'),
            { toggle: false }
        );

        categoriesMainLink.addEventListener('click', (e) => {
            if (categoriesDropdown._isShown()) {
                categoriesDropdown.hide();
            } else {
                categoriesDropdown.show();
            }
        });
    }
}