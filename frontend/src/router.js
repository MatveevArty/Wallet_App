import {AuthUtils} from "./utils/auth-utils";
import {FileUtils} from "./utils/file-utils";

import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";

import {Sidebar} from "./components/sidebar";
import {Interval} from "./components/interval";
import {ChartBuild} from "./components/charts";

import {IncomeList} from "./components/income/income-list";
import {IncomeCreate} from "./components/income/income-create";
import {IncomeEdit} from "./components/income/income-edit";

import {ExpenseList} from "./components/expense/expense-list";
import {ExpenseCreate} from "./components/expense/expense-create";
import {ExpenseEdit} from "./components/expense/expense-edit";

// import {CategoriesCreate} from "./components/categories/categories-create";
// import {CategoriesEdit} from "./components/categories/categories-edit";
// import {CategoriesList} from "./components/categories/categories-list";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentPageElement = document.getElementById('page-content');

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ChartBuild(this.openNewRoute.bind(this));
                    new Sidebar();
                    new Interval();
                },
                // styles: [''],
                scripts: ['chart.umd.js']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    this.contentPageElement.classList.add('d-flex');
                    this.contentPageElement.classList.add('align-items-center');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    this.contentPageElement.classList.remove('d-flex');
                    this.contentPageElement.classList.remove('align-items-center');
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    this.contentPageElement.classList.add('d-flex');
                    this.contentPageElement.classList.add('align-items-center');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    this.contentPageElement.classList.remove('d-flex');
                    this.contentPageElement.classList.remove('align-items-center');
                },
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
                useLayout: false,
                load: () => {
                    this.contentPageElement.classList.add('d-flex');
                    this.contentPageElement.classList.add('align-items-center');
                },
                unload: () => {
                    this.contentPageElement.classList.remove('d-flex');
                    this.contentPageElement.classList.remove('align-items-center');
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/income-list.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                    new Sidebar();
                },
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/income/income-create.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/income/income-edit.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/expense-list.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expense/expense-create.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/expense/expense-edit.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                },
            },
        ];

        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        // document.addEventListener('click', this.clickHandler.bind(this));
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

            // Удаление необходимых js файлов со страницы
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            // Подключение необходимых js файлов на текущую страницу
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            // Присвоение соответствующего заголовка страницы
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | LumincoinFinance';
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
                        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) ? JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey)) : '';
                        if (userInfo && userInfo.name) {
                            this.userName = userInfo.name;
                        }
                    }
                    this.profileNameElement.innerText = this.userName;
                    this.activateMenuItem(newRoute);
                }
                contentBlock.innerHTML =
                    await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

    activateMenuItem(route) {

    }
}