import {
    NOTES_DATA,
    DATE,
    TIMEOUT,

    DATE_MONTH_CHANGE,
    changeCurrentApp,

    ARR_MONTHS

} from "../constants/constants.js";

import { addCss_Block } from "../commonTools/generationComponent.js";

import { AppDay } from "../app/appDay.js";


const lookingForMatches_NOTS_DATA = (searchLocation, valueInputSearch, thing) => {
    /* Ищет слова для поиска заметок если больше двух то возвращает true  */

    let foundWords = 0;

    valueInputSearch.split(" ").forEach((value) => {
        searchLocation.split(" ").forEach((local) => {
            if (value === local) {
                foundWords++;
            };
        });
    });

    if (foundWords >= 1 && thing === "subject") {
        return true;
    } else if (foundWords >= 2 && thing === "content") {
        return true;
    } else {
        return false;
    };
};


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
                this.removeComponent_ResulSearch();

                document.removeEventListener("click", this.addEventClickInactiveZone_ContentSearch);
            };
        };
    }


    // Вспомогательные методы.
    getValueInputSearch() {
        /* Получает значение из поля ввода.  */
        this.valueInputSearch = this.inputSearch.value.toLowerCase().replace(/\s+/g, ' ').trim();
    }

    removeComponent_ResulSearch() {
        /* Удаляет компонент.  */

        this.resultSearchContent.style.cssText = `
            transition: all ${TIMEOUT * 4};
            opacity: 0;
        `;

        setTimeout(() => {
            this.resultSearchContent.remove();
            this.btnSearch.style.cssText = `pointer-events: auto`;
        }, 800);
    }

    getAllFoundNotes() {
        /* Ищет все заметки в "NOTES_DATA".  */

        this.foundNotes = [];

        let currentMonthIndex = ARR_MONTHS.indexOf(ARR_MONTHS[DATE.getMonth()]);

        lookingForMatches_NOTS_DATA("note", this.valueInputSearch)

        for (currentMonthIndex; currentMonthIndex < ARR_MONTHS.length; currentMonthIndex++) {
            NOTES_DATA[ARR_MONTHS[currentMonthIndex]].forEach((days) => {
                days.forEach((item) => {
                    const note = item['note'];

                    const firstResult = lookingForMatches_NOTS_DATA(
                        note[0]["subject"].toLowerCase().replace(/\s+/g, ' ').trim(),
                        this.valueInputSearch,
                        "subject"
                    );

                    const secondResult = lookingForMatches_NOTS_DATA(
                        note[1]["content"].toLowerCase().replace(/\s+/g, ' ').trim(),
                        this.valueInputSearch,
                        "content"
                    );

                    if ( firstResult || secondResult ) {
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

    openAppDay() {
        /* При клике открывает приложение Day.  */

        const classGenerationAppDay = new AppDay();
        const pressedBlock = event.currentTarget;

        const currentApp = document.querySelector(".app");
        currentApp.classList.add("switching-app");

        setTimeout(() => {
            currentApp.remove();

            classGenerationAppDay.render(pressedBlock);
        }, TIMEOUT * 1.25);

        const currentBtnSwitch = document.querySelector(".nav-header-btn-swicth-active");
        currentBtnSwitch.classList.remove("nav-header-btn-swicth-active");

        const nextBtnSwitch = document.querySelector(`.nav-header__content-btn-item-link[data-app-switch="day"]`)
        nextBtnSwitch.classList.add("nav-header-btn-swicth-active");

        changeCurrentApp("day");

        this.removeComponent_ResulSearch();
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
        this.resultSearchContent.setAttribute("class", "search__content-result-search flex");
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

        let indexLink = 1;

        this.foundNotes.forEach((note) => {

            this.resultSearchItemsNotes.insertAdjacentHTML("beforeend", `
                <div class="search__content-result-search-item degree-importance-${note["note"][2]["importance"]}">
                    <div class="search__content-result-search-item-link">
                        <a class="result-search-item-link-${indexLink}" data-day="${note["note"][4]["number_day_month"]}" data-month="${note["note"][3]["month"]}" role="button">
                            <p>${note["note"][1]["content"]}</p>
                        </a>
                    </div>
                </div>
            `);

            const generationLink = this.resultSearchItemsNotes.querySelector(`.result-search-item-link-${indexLink}`);
            generationLink.addEventListener("click", () => { this.openAppDay(); });
            
            indexLink++;
        });
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
