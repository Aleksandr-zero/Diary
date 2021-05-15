import {
    TIMEOUT,
    NOTES_DATA,

    DATE_MONTH_CHANGE,
    DATE,

    ARR_DAYS,
    ARR_MONTHS,

} from "../constants/constants.js";
import { AppDay } from "../app/appDay.js";

import { addCss_Block } from "../commonTools/generationComponent.js";


export const add_DeleteActiveClass_BtnNotice = () => {
    /* добавляет или удаляет красную точку для кнопки уведомления.  */

    const btnNotice = document.querySelector(".notice__content-btn-notice");

    if (NOTES_DATA[ARR_MONTHS[DATE.getMonth()]][DATE.getDate()] &&
        NOTES_DATA[ARR_MONTHS[DATE.getMonth()]][DATE.getDate()] != false) {

        btnNotice.classList.add("btn-notice-active");
    } else {
        btnNotice.classList.remove("btn-notice-active");
    };
};


export class ComponentNotice {
    /*
    Отвечает за генерацию заметок в секции уведомление на сегодняшний день.
    */

	constructor() {
		this.backBtnNotice = document.querySelector(".notice__content-back-btn-notice");
        this.btnNotice = this.backBtnNotice.querySelector(".notice__content-btn-notice");

        this.addEventPressed_BtnNotice();


        this.addEventClickInactiveZone_ContentNotice = () => {
            /* При клике на неактивную зону удаляет компонент.  */

            if ( !event.target.closest(".notice__content-back-notice") && !event.target.closest(".notice__content-btn-notice") ) {

                this.componentNoticeContent.style.cssText = `
                    transition: all ${TIMEOUT * 4};
                    opacity: 0;
                `;

                setTimeout(() => {
                    this.componentNoticeContent.remove();
                    this.btnNotice.style.cssText = `pointer-events: auto`;
                }, 800);

                document.removeEventListener("click", this.addEventClickInactiveZone_ContentNotice);
            };
        };
	}


    // Отвечают за добавление событий.
    addEventPressed_BtnNotice() {
        /* При клике рендерит компонент.  */

        this.btnNotice.addEventListener("click", () => {
            this.render();
        });
    }

    addEventDelete_ContentNotice(element) {
        /* Удаляет элемент после некоторого промежутка времени.  */

        setTimeout(() => {
            element.style.cssText = `
                transition: all ${TIMEOUT * 4};
                opacity: 0;
            `;
        }, 3000)

        setTimeout(() => {
            element.remove();
            this.btnNotice.style.cssText = `pointer-events: auto`;
        }, 3800);
    };


    // Отвечают за генерацию приложения.
    createComponentNotice_NoNotes() {
        /* Создаёт окнок где указывает, что заметок на сегодня нет.  */

        const appNotNotes_Content = document.createElement("div");
        appNotNotes_Content.setAttribute("class", "notice__content-back-notice-not-notes");

        appNotNotes_Content.insertAdjacentHTML("beforeend", `
            <h4 class="notice__content-back-notice-not-notes-title">Rest!</h4>
            <div class="notice__content-back-notice-not-notes-text">
                <p>You have no important things to do today.</p>
            </div>
        `);

        addCss_Block(
            appNotNotes_Content
        );

        this.backBtnNotice.append(appNotNotes_Content);
        this.btnNotice.style.cssText = `pointer-events: none`;

        this.addEventDelete_ContentNotice(
            this.element = appNotNotes_Content
        );
    }

    createComponentNotice_Content() {
        /* Создаёт окнок где указывает заметки на сегодня.  */

        this.componentNoticeContent = document.createElement("div");
        this.componentNoticeContent.setAttribute("class", "notice__content-back-notice");

        this.componentNoticeContent.insertAdjacentHTML("beforeend", `
            <h4 style="text-align: center;" class="notice__content-back-notice-title">Notes for today...</h4>
        `);

        addCss_Block(
            this.componentNoticeContent
        );

        this.backBtnNotice.append(this.componentNoticeContent);

        this.btnNotice.style.cssText = `pointer-events: none`;
    }

    createComponentNotice_Note() {
        /* Создаёт заметки для уведомлений  */

        const backNote = document.createElement("div");
        backNote.setAttribute("class", "notice__content-back-notice-items");

        NOTES_DATA[ARR_MONTHS[DATE.getMonth()]][DATE.getDate()].forEach((note) => {
            backNote.insertAdjacentHTML("beforeend", `
                <div class="notice__content-back-notice-item degree-importance-${note["note"][2]["importance"]}">
                    <div class="notice__content-back-notice-item-text">
                        <p>${note["note"][1]["content"]}</p>
                    </div>
                </div>
            `);
        });

        this.componentNoticeContent.append(backNote);
    }

    createComponentNotice_ShowingNotes() {
        /* Добавляет красную точку к кнопке уведомлнеие (значит есть на сегодня заметки).  */

        if (NOTES_DATA[ARR_MONTHS[DATE.getMonth()]][DATE.getDate()]) {
            this.btnNotice.classList.add("btn-notice-active");
        };
    }

    renderBlockComponent() {
        /* Рендерит главный блок приложения и его составные части  */

        if (NOTES_DATA[ARR_MONTHS[DATE.getMonth()]][DATE.getDate()] &&
            NOTES_DATA[ARR_MONTHS[DATE.getMonth()]][DATE.getDate()] != false) {

            this.createComponentNotice_Content();
            this.createComponentNotice_Note();

            document.addEventListener("click", this.addEventClickInactiveZone_ContentNotice);
        } else {
            this.createComponentNotice_NoNotes();
        };
    }

    render() {
        this.renderBlockComponent();
    }
};
