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

import { add_DeleteActiveClass_BtnNotice } from "../component/componentNotice.js";


export default class NavFooter {
    /*
    Класс реализующий функциональность нижней панели инструментов (связано с записями).
    */

    constructor() {
        this.classGenerationAppMonth = new GenerationAppMonth(false);

        this.navFooter = document.querySelector("#nav-footer");;

        this.formAddNew = document.querySelector(".calendar__form");
        this.formAddNew_BtnAdd = this.formAddNew.querySelector(".calendar__form-content-back-btn");
        this.formAddNew_Inputs = this.formAddNew.querySelectorAll(".calendar-form-input");
        this.formAddNew_BtnsLevel = this.formAddNew.querySelectorAll(".calendar__form-content-back-btn-level");

        this.receivedDataFromForm = {
            "subject": "",
            "content": "",
            "importance": ""
        };

        this.navFooterBtnAddNew = this.navFooter.querySelector(".nav-footer__content-btn");

        this.pressedFormBtnAdd = () => {
            /* При нажатии добавляет заметку на выбранный день (если конечно она существует).  */

            this.formAddNew_BtnAdd.removeEventListener("click", this.pressedFormBtnAdd);

            this.closeFormAddNew();

            this.checksForContent_FormInput();

            this.checksIfSeveritySensorInstalled_ForNote();
            this.saveDataNotes_Dictionary();
            this.createNote();
        };

        this.pressedBtnAddNew = () => {
            /* Открывает форму добавления новой заметки.  */

            this.activeItemBlockApp = document.querySelector(".app-month-content-item-pressed-btn");

            // Идёт проверка на то, чтобы ползователь выбрал день месяца.
            if (this.activeItemBlockApp) {
                this.formAddNew.classList.add("calendar-form-active");
                this.formAddNew_BtnAdd.addEventListener("click", this.pressedFormBtnAdd);

            } else {
                const navFooterBackBtnPrompt = this.navFooter.querySelector(".nav-footer__content-back-btn-prompt");
                navFooterBackBtnPrompt.classList.add("nav-footer-back-btn-prompt-active");

                setTimeout(() => {
                    navFooterBackBtnPrompt.classList.remove("nav-footer-back-btn-prompt-active");
                }, TIMEOUT * 12);
            };
        };

        this.addEventPressed_Blcoks();
        this.addEventPressed_FormInactiveZone();
    }

    // Отвечают за навешивание событий на блоки.
    addEventPressed_Blcoks() {
        /* Добавляет события нажатия для блоков.  */

        this.navFooterBtnAddNew.addEventListener("click", () => { this.pressedBtnAddNew(); });

        this.formAddNew_BtnsLevel.forEach((btnLevel) => {
            btnLevel.addEventListener("click", () => { this.pressedFormBtnLevel() })
        });
    }

    addEventPressed_FormInactiveZone() {
        /* Добавления события на форму - при нажатии на неактивную зону, форма закрывается.  */

        this.formAddNew.addEventListener("click", (event) => {
            if (!event.target.closest(".calendar__form-content")) {
                this.closeFormAddNew();
            };
        });
    }

    // Вспомогательные методы.
    cleansUpDataForm() {
        /* Очищает поля и выбранные данные при закрытии формы.  */

        this.formAddNew_Inputs.forEach((input) => {
            input.value = "";
            input.classList.remove("calendar-form-input-lack-text");
        });

        this.formAddNew_BtnsLevel.forEach((btnLevel) => {
            if (btnLevel.classList.contains("calendar-form-btn-level-active")) {
                btnLevel.classList.remove("calendar-form-btn-level-active");
            };
        });

        Object.keys(this.receivedDataFromForm).forEach((key) => {
            this.receivedDataFromForm[key] = "";
        });
    }

    closeFormAddNew() {
        /* Закрывает форму и очищает в ней поля.  */

        this.formAddNew.classList.remove("calendar-form-active");

        setTimeout(() => {
            this.cleansUpDataForm();
        }, TIMEOUT);
    }

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

    // Отвечают за обработку событий.
    pressedFormBtnLevel() {
        /*
        При нажатии кнопки, пользователь выбирает важность занятия своей заметки.
        Значение записывается в словарь "receivedDataFromForm".
        */

        this.formAddNew_BtnsLevel.forEach((btnLevel) => {
            if (btnLevel.classList.contains("calendar-form-btn-level-active")) {
                btnLevel.classList.remove("calendar-form-btn-level-active");
            };
        });
        
        this.receivedDataFromForm["importance"] = event.currentTarget.dataset.importance;

        event.currentTarget.classList.add("calendar-form-btn-level-active");
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


    checksIfSeveritySensorInstalled_ForNote() {
        /* Проверяет установлен ли степень важности для заметки.  */

        if (this.receivedDataFromForm["importance"] == false) {
            this.receivedDataFromForm["importance"] = "normal";
        };
    }

    saveDataNotes_Dictionary() {
        /* Записыает данные в словарь "NOTES_DATA" о добаленных заметках.  */

        const numberDay = +(this.activeItemBlockApp.querySelector(".app-month__content-item-day").innerHTML);

        if (NOTES_DATA[this.activeItemBlockApp.dataset.month][numberDay] == undefined) {
            NOTES_DATA[this.activeItemBlockApp.dataset.month][numberDay] = [];
        };

        let time;

        if (new Date().getMinutes() <= 9) {
            time = `0${new Date().getMinutes()}`;
        } else {
            time = `${new Date().getHours()}:${new Date().getMinutes()}`;
        };

        NOTES_DATA[this.activeItemBlockApp.dataset.month][numberDay].push({
            note: [
                {"subject": `${this.receivedDataFromForm['subject']}`},
                {"content": `${this.receivedDataFromForm['content']}`},
                {"importance": `${this.receivedDataFromForm['importance']}`},
                {"month": this.activeItemBlockApp.dataset.month},
                {"number_day_month": numberDay},
                {"time": time}
            ]
        });


        add_DeleteActiveClass_BtnNotice();
    }

    saveDataNotes_DictionaryCounter(numberNotes) {
        /* Сохраняет данные о остальных ссылок (устанавливает на последнюю заметку счётчик невмещаемых заметок).  */

        const dayPressedItemAppMonth = +(this.activeItemBlockApp.querySelector(".app-month__content-item-day").innerHTML);
        const numberDay_Month_Note = NOTES_DATA[this.activeItemBlockApp.dataset.month][dayPressedItemAppMonth];

        numberDay_Month_Note[numberDay_Month_Note.length - 1]["note"].push({"counter": numberNotes});
    }

    checksForContent_FormInput() {
        /*
        Проверяет наличие тескта в полях для заполнения и добавляет значения в словарь
        receivedDataFromForm".
        */

        this.formAddNew_Inputs.forEach((input) => {
            if (input.value == 0) {
                input.classList.add("calendar-form-input-lack-text");
            } else {
                let typeData_ForDictionary = input.dataset.typeForDictionary;
                this.receivedDataFromForm[typeData_ForDictionary] = input.value;
            };
        });
    }
};
