export class Sidebar {
    constructor() {
        this.init();
    }

    init() {
        const sidebarLinks = document.querySelectorAll('#sidebar-links a');
        const categoriesLinks = document.querySelectorAll('#categories-dropdown a');
        const categoriesMainLink = document.getElementById('categories-link');
        const categoriesDropdown = new bootstrap.Collapse(
            document.getElementById('categories-dropdown'),
            {toggle: false} // Отключаем авто-переключение
        );

        sidebarLinks.forEach(sidebarLink => {
            sidebarLink.addEventListener('click', function (e) {

                // Проверяем, не является ли текущая ссылка частью categories-dropdown
                const isCategoriesLink = Array.from(categoriesLinks).includes(this);
                // Если кликнули не на ссылку внутри categories-dropdown, закрываем его
                if (!isCategoriesLink && this !== categoriesMainLink) {
                    categoriesDropdown.hide(); // Закрываем выпадающий список
                }

                if (isCategoriesLink) {
                    Array.from(categoriesLinks).forEach(sidebarLink => {
                        if (categoriesLinks !== this) {
                            sidebarLink.classList.remove('active', 'text-white');
                            sidebarLink.classList.add('text-primary');
                        }

                        this.classList.remove('text-primary');
                        this.classList.add('active', 'text-white');
                    });
                } else {
                    Array.from(sidebarLinks).forEach(sidebarLink => {
                        if (sidebarLink !== this) {
                            sidebarLink.classList.remove('active', 'text-white');

                            if (!Array.from(categoriesLinks).includes(sidebarLink)) {
                                sidebarLink.classList.add('text-primary-emphasis');
                            } else {
                                sidebarLink.classList.add('text-primary');
                            }
                        }
                    });

                    this.classList.remove('text-primary-emphasis', 'text-primary');
                    this.classList.add('active', 'text-white');
                }
            })
        })
    }
}

