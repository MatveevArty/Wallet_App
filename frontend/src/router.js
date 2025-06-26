import {AuthUtils} from "./utils/auth-utils";
import {FileUtils} from "./utils/file-utils";

import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";

import {Sidebar} from "./components/sidebar";
import {Interval} from "./components/interval";
import {Charts} from "./components/charts";

// import {CategoriesCreate} from "./components/categories/categories-create";
// import {CategoriesDelete} from "./components/categories/categories-delete";
// import {CategoriesEdit} from "./components/categories/categories-edit";
// import {CategoriesList} from "./components/categories/categories-list";
//
// import {ExpenseCreate} from "./components/expense/expense-create";
// import {ExpenseDelete} from "./components/expense/expense-delete";
// import {ExpenseEdit} from "./components/expense/expense-edit";
// import {ExpenseList} from "./components/expense/expense-list";
//
// import {IncomeCreate} from "./components/income/income-create";
// import {IncomeDelete} from "./components/income/income-delete";
// import {IncomeEdit} from "./components/income/income-edit";
// import {IncomeList} from "./components/income/income-list";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentPageElement = document.getElementById('content');
        this.bootstrapStyleElement = document.getElementById('bootstrap-style');

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
                styles: [''],
                scripts: ['']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('d-flex');
                    document.body.classList.add('align-items-center');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('d-flex');
                    document.body.classList.remove('align-items-center');
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('d-flex');
                    document.body.classList.add('align-items-center');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('d-flex');
                    document.body.classList.remove('align-items-center');
                },
                styles: ['']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false
            },
        ];

        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);

    }

    async clickHandler(e) {

        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);

            // Удаление необходимых css файлов со страницы
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }

            // Удаление необходимых js файлов со страницы
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }

            // Вызов функции по удалению стилей css
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            // Подключение необходимых css файлов на текущую страницу
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.bootstrapStyleElement);
                });
            }

            // Подключение необходимых js файлов на текущую страницу
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }

            }

            // Присвоение соответствующего заголовка страницы
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | LumincoinFinance';
                console.log(newRoute.title);
            }

            // Присовение соответствующего контента страница
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML =
                        await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userinfoTokenKey) ? JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userinfoTokenKey)) : '';
                        if (userInfo && userInfo.name) {
                            this.userName = userInfo.name;
                        }
                    }
                    this.profileNameElement.innerText = this.userName;

                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML =
                    await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found!');
            history.pushState(null, '', '/404');
            await this.activateRoute(null);
        }
    }

    activateMenuItem(route) {

    }

}