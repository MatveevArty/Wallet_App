import {Router} from "./router";

export class UserMenu {
    private readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    init(): Promise<void> | undefined {
        const userPhoto: HTMLElement | null = document.getElementById('user-photo');
        const userDropdown: HTMLElement | null = document.getElementById('user-dropdown');
        if (userDropdown) {
            const logoutLink: HTMLElement | null = userDropdown.querySelector('a[href="/logout"]');

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
                this.openNewRoute('/logout').then();
            });
        }
    }
}