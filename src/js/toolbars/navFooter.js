import {
    NOTES_DATA,
    TIMEOUT,

    CURRENT_APP,
    changeCurrentApp,

    ARR_DAYS,
    ARR_MONTHS,

    changeMonth

} from "../constants/constants.js";

import { GenerationAppMonth } from "../app/appMonth.js";

import { WorkingWithForm } from "./form.js"

import { add_DeleteActiveClass_BtnNotice } from "../component/componentNotice.js";


export class NavFooter {
    /*
    Класс реализующий функциональность нижней панели инструментов (связано с записями).
    */

    constructor() {
        this.classGenerationAppMonth = new GenerationAppMonth(false);
        this.classWorkingWithForm = new WorkingWithForm();

        this.navFooter = document.querySelector("#nav-footer");;
        this.navFooterBtnAddNew = this.navFooter.querySelector(".nav-footer__content-btn");

        this.pressedBtnAddNew = () => {
            /* Открывает форму добавления новой заметки.  */

            this.activeItemBlockApp = document.querySelector(".app-month-content-item-pressed-btn");

            // Идёт проверка на то, чтобы ползователь выбрал день месяца.
            if (this.activeItemBlockApp) {

                this.classWorkingWithForm.start(
                    this.activeItemBlockApp,
                    "month"
                );

            } else {
                const navFooterBackBtnPrompt = this.navFooter.querySelector(".nav-footer__content-back-btn-prompt");
                navFooterBackBtnPrompt.classList.add("nav-footer-back-btn-prompt-active");

                setTimeout(() => {
                    navFooterBackBtnPrompt.classList.remove("nav-footer-back-btn-prompt-active");
                }, 2400);
            };
        };

        this.addEventPressed_Blcoks();
    }

    // Отвечают за навешивание событий на блоки.
    addEventPressed_Blcoks() {
        /* Добавляет события нажатия для блоков.  */

        this.navFooterBtnAddNew.addEventListener("click", this.pressedBtnAddNew);
    }
};


export class NavFooter_CreateNote {
    /*
    Класс отвечающий за создание заметки из класса "NavFooter"
    */

    constructor(activeItemBlockApp) {
        this.classGenerationAppMonth = new GenerationAppMonth(false);

        this.activeItemBlockApp = activeItemBlockApp;
    }

    // Вспомогательные методы.
    checksIf_NoteNeedsHidden(note) {
        /*
        Проверяет количество заметок, если будет больше одного то мы скрываем все будущие заметки
        и устанавливаем счётчик остальных заметок.
        */

        if (this.activeItemBlockApp.querySelectorAll(".app-month__content-item-note").length > 1) {
            note.style.cssText = `
                opacity: 0;
                visibility: hidden;
            `;

            this.createNotesCounter(
                this.numberNotes = this.activeItemBlockApp.querySelectorAll(".app-month__content-item-note").length - 1
            );
        };
    }

    // Отвечают за генерацию заметки.
    createNote() {
        /* Генерация вёрстки заметки.  */

        const dayPressedItemAppMonth = +(this.activeItemBlockApp.querySelector(".app-month__content-item-day").innerHTML);
        const numberDay_Month_Note = NOTES_DATA[this.activeItemBlockApp.dataset.month][dayPressedItemAppMonth];

        const note = this.classGenerationAppMonth.createNote_ForItemBlockApp(
            this.noteData = numberDay_Month_Note[numberDay_Month_Note.length - 1]["note"]
        );

        this.activeItemBlockApp.append(note);

        // Если количество заметок будет больше одного то мы скрываем все будущие заметки
        // и устанавливаем счётчик остальных заметок.
        this.checksIf_NoteNeedsHidden(
            this.note = note
        );

        this.classGenerationAppMonth.measuresWidthBlock_NoteApp(
            this.note = note
        );

        this.activeItemBlockApp = null;
    }

    createNotesCounter(numberNotes) {
        /* Устанавливает счётчик остальных заметок для блока activeItemBlockApp.  */
        
        if (this.activeItemBlockApp.querySelector(".app__content-item-counter-notes")) {
            this.activeItemBlockApp.querySelector(".app__content-item-counter-notes-number")
                        .innerHTML = `+${numberNotes}`;

            this.saveDataNotes_DictionaryCounter(
                this.numberNotes = numberNotes
            );

            return;
        };

        this.saveDataNotes_DictionaryCounter(
            this.numberNotes = numberNotes
        );

        const counter = this.classGenerationAppMonth.createNotesCounter(
            this.numberNotes = numberNotes
        );

        this.activeItemBlockApp.append(counter);
    }


    saveDataNotes_DictionaryCounter(numberNotes) {
        /* Сохраняет данные о остальных ссылок (устанавливает на последнюю заметку счётчик невмещаемых заметок).  */

        const dayPressedItemAppMonth = +(this.activeItemBlockApp.querySelector(".app-month__content-item-day").innerHTML);
        const numberDay_Month_Note = NOTES_DATA[this.activeItemBlockApp.dataset.month][dayPressedItemAppMonth];

        numberDay_Month_Note[numberDay_Month_Note.length - 1]["note"].push({"counter": numberNotes});
    }
};
    