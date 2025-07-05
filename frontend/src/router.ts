import {AuthUtils} from "./utils/auth-utils";
import {FileUtils} from "./utils/file-utils";

import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";

import {Sidebar} from "./components/sidebar";
import {ChartBuild} from "./components/charts";

import {IncomeList} from "./components/income/income-list";
import {IncomeCreate} from "./components/income/income-create";
import {IncomeEdit} from "./components/income/income-edit";

import {ExpenseList} from "./components/expense/expense-list";
import {ExpenseCreate} from "./components/expense/expense-create";
import {ExpenseEdit} from "./components/expense/expense-edit";

import {CategoriesList} from "./components/categories/categories-list";
import {CategoriesCreate} from "./components/categories/categories-create";
import {CategoriesEdit} from "./components/categories/categories-edit";

import {BalanceService} from "./services/balance-service";
import {UserMenu} from "./user-menu";

import {RouteType} from "./types/route.type";
import {BalanceType} from "./types/balance.type";
import {DefaultErrorType} from "./types/default-error.type";
import {UserInfoType} from "./types/token.type";
import bootstrap from "bootstrap";

export class Router {
    private readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private routes: RouteType[];
    private userName: string;

    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentPageElement = document.getElementById('page-content');
        this.userName = '';

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ChartBuild(this.openNewRoute.bind(this));
                    new Sidebar();
                    new UserMenu(this.openNewRoute.bind(this));
                },
                scripts: ['chart.umd.js']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: '',
                load: () => {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.add('d-flex');
                        this.contentPageElement.classList.add('align-items-center');
                    }
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.remove('d-flex');
                        this.contentPageElement.classList.remove('align-items-center');
                    }
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: '',
                load: () => {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.add('d-flex');
                        this.contentPageElement.classList.add('align-items-center');
                    }
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.remove('d-flex');
                        this.contentPageElement.classList.remove('align-items-center');
                    }
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
                useLayout: '',
                load: () => {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.add('d-flex');
                        this.contentPageElement.classList.add('align-items-center');
                    }
                },
                unload: () => {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.remove('d-flex');
                        this.contentPageElement.classList.remove('align-items-center');
                    }
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/income-list.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/income/income-create.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/income/income-edit.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/expense-list.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expense/expense-create.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/expense/expense-edit.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/categories',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/categories/categories-list.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new CategoriesList(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/categories/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/categories/categories-create.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new CategoriesCreate(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/categories/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/categories/categories-edit.html',
                useLayout: '/templates/pages/layout.html',
                load: () => {
                    new CategoriesEdit(this.openNewRoute.bind(this));
                    new UserMenu(this.openNewRoute.bind(this));
                },
            },
        ];

        this.initEvents();
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    public async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        if (currentRoute) {
            await this.activateRoute(null, currentRoute);
        }
    }

    private async activateRoute(e: any, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);

            // Удаление необходимых js файлов со страницы
            if (currentRoute) {
                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach(script => {
                        document.querySelector(`script[src='/js/${script}']`)?.remove();
                    })
                }
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            // Подключение необходимых js файлов на текущую страницу
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            // Присвоение соответствующего заголовка страницы
            if (newRoute.title) {
                if (this.titlePageElement) {
                    this.titlePageElement.innerText = newRoute.title + ' | LumincoinFinance';
                }
            }

            // Присовение соответствующего контента страница
            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout && this.contentPageElement && contentBlock) {
                    this.contentPageElement.innerHTML =
                        await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    const balanceElement: HTMLElement | null = document.getElementById('current-amount');
                    const userBalance: BalanceType | DefaultErrorType = await BalanceService.getBalance();

                    if (balanceElement && userBalance) {
                        if ((userBalance as BalanceType).balance !== undefined) {
                            balanceElement.innerText = userBalance.balance.toString();
                        }
                    }

                    const profileNameElement: HTMLElement | null  = document.getElementById('profile-name');

                    if (!this.userName) {
                        const userInfoName: string | null | undefined = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) ?
                            (AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) as UserInfoType).name : '';
                        if (userInfoName) {
                            this.userName = userInfoName;
                        }
                    }

                    if (profileNameElement) {
                        profileNameElement.innerText = this.userName;
                    }
                    this.activateMenuItem(newRoute);
                }
                if (contentBlock) {
                    contentBlock.innerHTML =
                        await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState({}, '', '/404');
            await this.activateRoute(null, null);
        }
    }

    private activateMenuItem(route: RouteType): void {
        // Сбрасываем все активные состояния
        const sidebarLinks: NodeListOf<Element> = document.querySelectorAll('#sidebar-links a');
        const categoriesLinks: NodeListOf<Element> = document.querySelectorAll('#categories-dropdown a');
        const categoriesMainLink: HTMLElement | null = document.getElementById('categories-link');
        const categoriesDropdown: HTMLElement | null = document.getElementById('categories-dropdown');

        sidebarLinks.forEach((link: Element) => {
            link.classList.remove('active', 'text-white');
            link.classList.add('text-primary-emphasis');
        });

        categoriesLinks.forEach((link: Element) => {
            link.classList.remove('active', 'text-white');
            link.classList.add('text-primary');
        });

        if (categoriesMainLink) {
            categoriesMainLink.classList.remove('active', 'text-white');
            categoriesMainLink.classList.add('text-primary-emphasis');

            // Управление выпадающим меню
            if (categoriesDropdown) {
                const bsCollapse: bootstrap.Collapse = bootstrap.Collapse.getInstance(categoriesDropdown) ||
                    new bootstrap.Collapse(categoriesDropdown, {toggle: false});

                // Активация в зависимости от текущего маршрута
                switch (route.route) {
                    case '/':
                        let linkMain: Element | null = document.querySelector('#sidebar-links a[href="/"]');
                        if (linkMain) {
                            this.setActiveLink(linkMain);
                        }
                        bsCollapse.hide();
                        break;

                    case '/categories':
                        let linkCategories: Element | null = document.querySelector('#sidebar-links a[href="/categories"]');
                        if (linkCategories) {
                            this.setActiveLink(linkCategories);
                        }
                        bsCollapse.hide();
                        break;

                    case '/income':
                        this.setActiveLink(categoriesMainLink);
                        let linkIncome: Element | null = document.querySelector('#categories-dropdown a[href="/income"]');
                        if (linkIncome) {
                            this.setActiveLink(linkIncome);
                        }
                        let linkExpenseNotActive: Element | null = document.querySelector('#categories-dropdown a[href="/expense"]');
                        if (linkExpenseNotActive) {
                            linkExpenseNotActive.classList.add('border', 'border-2', 'border-primary');
                        }
                        bsCollapse.show();
                        break;

                    case '/expense':
                        this.setActiveLink(categoriesMainLink);
                        let linkExpense: Element | null = document.querySelector('#categories-dropdown a[href="/expense"]');
                        if (linkExpense) {
                            this.setActiveLink(linkExpense);
                        }
                        let linkIncomeNotActive: Element | null = document.querySelector('#categories-dropdown a[href="/income"]');
                        if (linkIncomeNotActive) {
                            linkIncomeNotActive.classList.add('border', 'border-2', 'border-primary');
                        }
                        bsCollapse.show();
                        break;
                }
            }
        }
    }

    private setActiveLink(link: Element): void {
        if (!link) return;

        if (link.id === 'categories-link') {
            link.classList.remove('text-primary-emphasis');
            link.classList.add('active', 'text-white');
        } else {
            link.classList.remove('text-primary-emphasis', 'text-primary');
            link.classList.add('active', 'text-white');
        }
    }
}