export class RenderElementUtils {

    static renderElementList(item, href) {

        // <div class="col mt-3"></div>
        this.cardElement = document.createElement('div');
        this.cardElement.classList.add('col', 'mt-3');

            // <div class="card-body"></div>
            const innerCardElement = document.createElement("div");
            innerCardElement.classList.add('card');
            this.cardElement.appendChild(innerCardElement);

                // <div class="card-body"></div>
                const cardBodyElement = document.createElement("div");
                cardBodyElement.classList.add('card-body');
                innerCardElement.appendChild(cardBodyElement);

                    // <h1 class="card-title text-dark-violet"></h1>
                    const cardTitleElement = document.createElement("h3");
                    cardTitleElement.classList.add('card-title', 'text-dark-violet');
                    cardTitleElement.innerText = item.title;
                    cardBodyElement.appendChild(cardTitleElement);

                    // <a href="/income/:id" class="btn btn-primary">Редактировать</a>
                    const buttonEdit = document.createElement("a");
                    buttonEdit.classList.add('btn', 'btn-primary');
                    buttonEdit.innerText = "Редактировать";
                    // buttonEdit.setAttribute('href', href + '/edit?id=' + item.id);
                    buttonEdit.setAttribute('data-bs-toggle', 'modal');
                    buttonEdit.setAttribute('data-bs-target', '#staticBackdrop');
                    cardBodyElement.appendChild(buttonEdit);


                    // <a href="/income/:id" class="btn btn-danger">Удалить</a>
                    const buttonDelete = document.createElement("a");
                    buttonDelete.classList.add('btn', 'btn-danger', 'ms-1');
                    buttonDelete.innerText = 'Удалить';
                    // buttonDelete.setAttribute('href', href + '/delete?id='+ item.id);
                    buttonDelete.setAttribute('data-bs-toggle', 'modal');
                    buttonDelete.setAttribute('data-bs-target', '#staticBackdrop');
                    cardBodyElement.appendChild(buttonDelete);

        return this.cardElement;
    }

    static renderElementAddBtn(href) {

        // <div class="col mt-3"></div>
        this.cardElement = document.createElement('div');
        this.cardElement.classList.add('col', 'mt-3');

            // <a class="card-body"></a>
            const linkBodyElement = document.createElement("a");
            linkBodyElement.classList.add('text-decoration-none');
            linkBodyElement.setAttribute('href', href);
            this.cardElement.appendChild(linkBodyElement);

                // <div class="card"></div>
                const innerCardElement = document.createElement('div');
                innerCardElement.classList.add('card', 'p-2');
                linkBodyElement.appendChild(innerCardElement);

                    // <div class="card-body"></div>
                    const bigPlusElement = document.createElement("div");
                    bigPlusElement.classList.add('card-body', 'd-flex', 'align-items-center',
                        'justify-content-center', 'text-secondary', 'fs-3', 'p-4', 'fw-medium');
                    bigPlusElement.innerText = '+';
                    innerCardElement.appendChild(bigPlusElement);

        return this.cardElement;
    }
}