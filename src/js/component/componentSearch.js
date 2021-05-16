import {
    NOTES_DATA,
    TIMEOUT,

    DATE_MONTH_CHANGE,

    ARR_MONTHS

} from "../constants/constants.js";

import { addCss_Block } from "../commonTools/generationComponent.js"


export class ComponentSearch {
    /*
    Класс реализующий поиск заметок.
    */

    constructor() {
        this.searchContent = document.querySelector(".search__content");
        this.btnSearch = this.searchContent.querySelector(".search__content-back-input-btn");
        this.inputSearch = this.searchContent.querySelector(".search__content-input");

        this.addEventPressed_BtnSearch();
        this.addEventOnblur_InputSearch();

        this.addEventClickInactiveZone_ContentSearch = () => {
            /* При клике на неактивную зону удаляет компонент.  */

            if ( !event.target.closest(".search__content-result-search") && !event.target.closest(".search__content-back-input-btn") ) {

                this.resultSearchContent.style.cssText = `
                    transition: all ${TIMEOUT * 4};
                    opacity: 0;
                `;

                setTimeout(() => {
                    this.resultSearchContent.remove();
                    this.btnSearch.style.cssText = `pointer-events: auto`;
                }, 800);

                document.removeEventListener("click", this.addEventClickInactiveZone_ContentSearch);
            };
        };
    }


    // Вспомогательные методы.
    getValueInputSearch() {
        /* Получает значение из поля ввода.  */
        this.valueInputSearch = this.inputSearch.value.toLowerCase().trim();
    }

    getAllFoundNotes() {
        /* Ищет все заметки в "NOTES_DATA".  */

        this.foundNotes = [];

        let currentMonthIndex = ARR_MONTHS.indexOf(ARR_MONTHS[DATE_MONTH_CHANGE]);

        for (currentMonthIndex; currentMonthIndex < ARR_MONTHS.length; currentMonthIndex++) {
            NOTES_DATA[ARR_MONTHS[currentMonthIndex]].forEach((days) => {
                days.forEach((item) => {
                    const note = item['note'];

                    if ( note[0]["subject"].toLowerCase().trim() == this.valueInputSearch ||
                         note[1]["content"].toLowerCase().trim() == this.valueInputSearch ) {
                        this.foundNotes.push(item);
                    };
                });
            });
        };
    }

    addEventDelete_ContentNotice(element) {
        /* Удаляет элемент после некоторого промежутка времени.  */

        setTimeout(() => {
            element.style.cssText = `
                transition: all ${TIMEOUT * 4};
                opacity: 0;
            `;
        }, 3000);

        setTimeout(() => {
            element.remove();
            this.btnSearch.style.cssText = `pointer-events: auto`;
        }, 3800);
    };


    // Отвечают за навешивание событий.
    addEventPressed_BtnSearch() {
        /* Навешивает событие клика и рендерит компонент.  */

        this.btnSearch.addEventListener("click", () => { this.render(); })
    }

    addEventOnblur_InputSearch() {
        /* После потери фокуса если там есть значение оставляем поле активным.  */

        this.inputSearch.oninput = () => {
            if (this.inputSearch.value) {
                this.inputSearch.classList.add("search-input-active");
            } else {
                this.inputSearch.classList.remove("search-input-active");
            };
        };
    }


    // Отвечают за генерацию компонента.
    createComponent_NoValueInput() {
        /* Рендерит компонент указывающее на пустое поле ввода.  */

        const backContentResult = document.createElement("div");
        backContentResult.setAttribute("class", "search__content-result-search");
        addCss_Block(
            backContentResult
        );

        backContentResult.insertAdjacentHTML("beforeend", `
            <h4 class="search__content-result-search-title">Please,fill in the above field!</h4>
        `);

        this.searchContent.append(backContentResult);

        this.btnSearch.style.cssText = `pointer-events: none`;
        this.addEventDelete_ContentNotice(
            this.element = backContentResult
        );

        this.btnSearch.classList.add("search-input-unfilled");
        this.inputSearch.classList.add("search-input-unfilled");
        this.inputSearch.classList.add("search-input-unfilled-color-line");
        setTimeout(() => {
            this.btnSearch.classList.remove("search-input-unfilled");
            this.inputSearch.classList.remove("search-input-unfilled");
        }, 3000);

        setTimeout(() => {
            this.inputSearch.classList.remove("search-input-unfilled-color-line");
        }, 3200);
    }

    createComponent_NoResultSearch() {
        /* Создаёт блок где указывается, что заметок не найдено.  */

        const backContentResult = document.createElement("div");
        backContentResult.setAttribute("class", "search__content-result-search search-not-result-search");

        backContentResult.insertAdjacentHTML("beforeend", `
            <h4 class="search__content-result-search-title">According to your request: "<span>${this.valueInputSearch}</span>", nothing was found</h4>
        `);

        addCss_Block(
            backContentResult
        );

        this.btnSearch.style.cssText = `pointer-events: none`;
        this.addEventDelete_ContentNotice(
            this.element = backContentResult
        );

        this.searchContent.append(backContentResult);
    }

    createContentComponent() {
        /* Создаёт блок с основным контентом.  */

        this.resultSearchContent = document.createElement("div");
        this.resultSearchContent.setAttribute("class", "search__content-result-search");
        addCss_Block(
            this.resultSearchContent
        );

        this.resultSearchContent.insertAdjacentHTML("beforeend", ` 
            <h4 style="text-align: center;" class="search__content-result-search-title">Search results...</h4>
        `);

        this.searchContent.append(this.resultSearchContent);
    }

    createItemsNotes() {
        /* Создаёт блок для найденных заметок  */

        this.resultSearchItemsNotes = document.createElement("div");
        this.resultSearchItemsNotes.setAttribute("class", "search__content-result-search-items");

        this.resultSearchContent.append(this.resultSearchItemsNotes);
    }

    createFoundNote() {
        /* Создаёт заметку и помещает её в "resultSearchItemsNotes".  */

        this.foundNotes.forEach((note) => {
            this.resultSearchItemsNotes.insertAdjacentHTML("beforeend", `
                <div class="search__content-result-search-item degree-importance-${note["note"][2]["importance"]}">
                    <div class="search__content-result-search-item-text">
                        <p>${note["note"][1]["content"]}</p>
                    </div>
                </div>
            `);
        })
    }

    renderBlockComponent() {
        /* Рендерит главный блок приложения и его составные части  */

        this.btnSearch.style.cssText = `pointer-events: none`;

        this.createContentComponent();
        this.createItemsNotes();
        this.createFoundNote();

        document.addEventListener("click", this.addEventClickInactiveZone_ContentSearch);
    }

    render() {
        this.getValueInputSearch();
        this.getAllFoundNotes();

        if (this.valueInputSearch == false) {
            this.createComponent_NoValueInput();
            return;
        };

        if (this.foundNotes == false) {
            this.createComponent_NoResultSearch();
            return;
        };

        this.renderBlockComponent();

        this.inputSearch.value = "";
        this.inputSearch.classList.remove("search-input-active");
    }
};
