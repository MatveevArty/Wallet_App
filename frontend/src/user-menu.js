export class UserMenu {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    init() {
        const userPhoto = document.getElementById('user-photo');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutLink = userDropdown?.querySelector('a[href="/logout"]');

        if (!userPhoto || !userDropdown || !logoutLink) return;

        // Показываем/скрываем меню при клике на аватар
        userPhoto.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Скрываем меню при клике вне его
        document.addEventListener('click', () => {
            userDropdown.style.display = 'none';
        });

        // Обработчик выхода
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.openNewRoute('/logout');
        });
    }
}