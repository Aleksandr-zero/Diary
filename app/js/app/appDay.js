import {
    NOTES_DATA,
    TIMEOUT,

    CURRENT_APP,
    changeCurrentApp,

    CURRENT_VISUAL_CONTENT_DAY_NOTES,
    changeCurrentVisualDayNotes,

    DATE_MONTH_CHANGE,

    ARR_DAYS,
    ARR_MONTHS,
    ARR_DEGREE_IMPORTANCE,

    ARROW_ICON_APP_DAY,
    DELETE_ICON_APP_DAY,
    ADD_NOTE_ICON_APP_DAY,
    SORTING_NOTES_IMPORTANT

} from "../constants/constants.js";

import {
    AppMonth,
    AppMonth_CreateNotes
} from "./appMonth.js";

import {
    setsTime_For_Note,
    WorkingWithForm
} from "../commonTools/form.js";
import { NavFooter } from "../toolbars/navFooter.js";

import { add_DeleteActiveClass_BtnNotice } from "../components/componentNotice.js";

import {
    hides_appearsBlock_SectionDays,
    blocksBtnsHeaderMonth
} from "../commonTools/generationApp.js";

import { addCss_Block } from "../commonTools/generationComponent.js";


export class AppDay {
    /*
    Класс, генерирующий приложение Day и его составные части.
    */

    constructor() {
        this.appWrapper = document.querySelector(".wrapper-app")

        this.classAppMonth_CreateNotes = new AppMonth_CreateNotes();
        this.classWorkingWithForm = new WorkingWithForm();

        this.formAddNew = document.querySelector(".diary__form");
        this.formAddNew_BtnAdd = this.formAddNew.querySelector(".diary__form-content-back-btn");
        this.btnsLevelNote = this.formAddNew.querySelectorAll(".diary__form-content-back-btn-level");

        this.appDay = document.createElement("div");
        this.appDayContent = document.createElement("div");
        this.appDayNoteItems = document.createElement("div");

        this.formBtnAdd_AddNote;
        this.formBtnAdd_EditNote;

        this.currentBlockDay;
        this.pressedDayNumber;

        this.pressedFormBtnAdd = () => {
            /* Перезаписывает данные заметки.  */

            const inputSubjectValue = this.formAddNew.querySelector("input").value;
            const contentTextAreaValue = this.formAddNew.querySelector("textarea").value;
            this.btnLevelNoteActive_Value;
            const btnLevelNoteActive = this.formAddNew.querySelector(".diary-form-btn-level-active");

            if (btnLevelNoteActive) {
                this.btnLevelNoteActive_Value = btnLevelNoteActive.dataset.importance;
            } else {
                this.btnLevelNoteActive_Value = "normal";
            };

            if (this.formBtnAdd_EditNote) {
                this.overwritesCurrentDataNoteWithNew(
                    this.inputValue = inputSubjectValue,
                    this.textareaInput = contentTextAreaValue,
                    this.btnLevel_Value = this.btnLevelNoteActive_Value
                );
            };

            this.formAddNew_BtnAdd.removeEventListener("click", this.pressedFormBtnAdd);

            const btnsLevel = this.formAddNew.querySelectorAll(".diary__form-content-back-btn-level");
            btnsLevel.forEach((btnLevel) => {
                btnLevel.removeEventListener("click", this.pressedFormBtnLevel);
            });

            this.closeFormAddNew();
        };

        this.pressedFormBtnLevel = () => {
            /*
            При нажатии кнопки, пользователь выбирает важность занятия своей заметки.
            Значение записывается в словарь "receivedDataFromForm".
            */

            if (event.currentTarget.classList.contains("diary-form-btn-level-active")) {
                event.currentTarget.classList.remove("diary-form-btn-level-active");
                this.btnLevelNoteActive_Value = "normal";

                return;
            };

           this.btnsLevelNote.forEach((btnLevel) => {
                if (btnLevel.classList.contains("diary-form-btn-level-active")) {
                    btnLevel.classList.remove("diary-form-btn-level-active");
                };
            });
            
            this.btnLevelNoteActive_Value = event.currentTarget.dataset.importance;

            event.currentTarget.classList.add("diary-form-btn-level-active");
        }

        this.deleteSortingMenu = () => {
            const sortingMenu = document.querySelector(".app-day__content-note-day-menu-sorting");
            sortingMenu.style.opacity = "0";

            setTimeout(() => {
                sortingMenu.remove();
            }, TIMEOUT);
        }

        this.addEventClick_InactiveZoneMenuSorting = () => {
            /* При нажатии на неактивную зону 'backContextMenu' удаляем контект меню.  */

            if (!event.target.closest(".app-day__content-note-day-back-sorting-menu")) {
                this.deleteSortingMenu();
                document.removeEventListener("click", this.addEventClick_InactiveZoneMenuSorting);
            };
        };
    }


    // Вспомогательные методы.
    getSetAttribute_BlockDay(blockDay) {
        /* Возвращает массив дата-атрибутов (data-month, data-day).  */
        return [
            blockDay.dataset.month,
            +(blockDay.dataset.day)
        ];
    }

    measuresHeightApp_addHeightWrapperApp() {
        this.appWrapper.style.height = `${this.appDayContent.offsetHeight}px`;
    } 

    getDataPressedNote() {
        /* Получает контент нажатой заметки.  */

        this.pressedNote = event.currentTarget.closest('.app-day__content-note-day');

        this.dataPressedNote = {
            "subject": this.pressedNote.querySelector("h4").innerHTML,
            "content": this.pressedNote.querySelector("p").innerHTML,
            "importance": this.pressedNote.classList[2].split("-")[2],
        };
    }

    getTitleDay_PressedBlock(day, month, year) {
        /* Возвращает названия дня нажатого блока приложения Month.  */
        return ARR_DAYS[new Date(year, month, day).getDay()];
    }

    changesButtonsActivity_NavHeader(nextApp) {
        /* Меняет активность кнопки в зависимости какое приложение.  */

        const btnsHeaderSwitchingApp = document.querySelectorAll(".nav-header__content-btn-item-link");

        btnsHeaderSwitchingApp.forEach((btnSwitch) => {
            if (btnSwitch.classList.contains("nav-header-btn-swicth-active")) {
                btnSwitch.classList.remove("nav-header-btn-swicth-active");
            };

            if (btnSwitch.dataset.appSwitch === nextApp) {
                btnSwitch.classList.add("nav-header-btn-swicth-active");
                changeCurrentApp(nextApp);
            };
        });
    }

    findNotes_PressedDay(dataSet) {
        /* Возвращает все найденные заметки на нажатий день.  */
        return NOTES_DATA[dataSet[0]][dataSet[1]];
    }

    overwritesCurrentDataNoteWithNew(inputValue, textareaInput, btnLevel_Value) {
        /* Перезаписывает текущие данные на новые на выбранной заметки.  */

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );

        const monthPressedNote = ARR_MONTHS[ARR_MONTHS.indexOf(dataSetBlockDay[0])];

        const time = setsTime_For_Note();

        Object.keys(NOTES_DATA[monthPressedNote][dataSetBlockDay[1]]).forEach((note) => {
            if (NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][1]["content"] ==
                                this.dataPressedNote["content"]) {

                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][0]["subject"] = inputValue;
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][1]["content"] = textareaInput;
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][2]["importance"] = btnLevel_Value;
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][5]["time"] = time;
            };
        });

        this.pressedNote.querySelector(".app-day__content-note-day-title").innerHTML = inputValue;
        this.pressedNote.querySelector(".app-day__content-note-day-text").innerHTML = `<p>${textareaInput}</p>`;
        this.pressedNote.classList.remove(this.pressedNote.classList[2]);
        this.pressedNote.classList.add(`degree-importance-${btnLevel_Value}`);

        this.pressedNote.querySelector(".app-day__content-note-day-time").innerHTML = time;
    }


    // Отвечают за добавления событий и их обработчиков.
    pressedAppMonthItemDay() {
        /* При клике генерирует приложение - день. */

        this.changesButtonsActivity_NavHeader(
            this.nextApp = "day"
        );

        this.appMonth = document.querySelector(".app-month");
        this.appMonth.classList.add("switching-app");

        blocksBtnsHeaderMonth();

        this.currentBlockDay = event.target.closest(".app-month__content-item");
        this.pressedDayNumber = this.currentBlockDay.dataset.day;

        setTimeout(() => {
            this.appMonth.remove();
            this.render();
        }, TIMEOUT * 1.25);
    }

    openFormEditNote() {
        /* Открывает форму для редактирования заметки.  */

        this.formBtnAdd_AddNote = false;
        this.formBtnAdd_EditNote = true;

        this.formAddNew.classList.add("diary-form-active");
        this.formAddNew_BtnAdd.addEventListener("click", this.pressedFormBtnAdd);
    }

    openFormAddNote() {
        /* Открывает форму для добавления заметки.  */

        this.formBtnAdd_AddNote = true;
        this.formBtnAdd_EditNote = false;

        this.classWorkingWithForm.start(
            this.currentBlockDay,
            "day"
        );
    }

    addCurrentDataNote_ToForm() {
        /* Добавляет текущие данные для редактирование.  */

        const inputSubject = this.formAddNew.querySelector(".diary__form-content-back-input");
        const contentTextArea = this.formAddNew.querySelector(".diary__form-content-back-textarea");

        inputSubject.value = `${this.dataPressedNote["subject"]}`;
        contentTextArea.value = `${this.dataPressedNote["content"]}`;

        this.btnsLevelNote.forEach((btnLevel) => {
            btnLevel.addEventListener("click", this.pressedFormBtnLevel);
            if (this.dataPressedNote["importance"] == btnLevel.dataset.importance) {
                btnLevel.classList.add("diary-form-btn-level-active");
            };
        });
    }

    closeFormAddNew() {
        /* Зыкрывает форму и чищет в ней поля. */

        this.formAddNew.classList.remove("diary-form-active");

        setTimeout(() => {
            this.formAddNew.querySelector("input").value = "";
            this.formAddNew.querySelector("textarea").value = "";
            if (this.formAddNew.querySelector(".diary-form-btn-level-active")) {
                this.formAddNew.querySelector(".diary-form-btn-level-active").classList.remove("diary-form-btn-level-active");
            };
        }, TIMEOUT * 1.25);
    }

    pressedBtnBack() {
        /* При нажатии удаляет приложение Day и генерирует приложение Month.  */

        this.changesButtonsActivity_NavHeader(
            this.nextApp = "month"
        );

        this.appDay.classList.add("switching-app")

        setTimeout(() => {
            this.appDay.remove();
            hides_appearsBlock_SectionDays();

            const classAppMonth = new AppMonth(false);
            classAppMonth.render();

            this.appMonth = document.querySelector(".app-month");

            this.classAppMonth_CreateNotes.createAllNote_SpecifiedMonth();

            blocksBtnsHeaderMonth();
        }, TIMEOUT * 1.25);
    }

    pressedBtnSwitchVisualContent() {
        /* Переключает визуальное окружение заметок  */

        const lengthClassCurrentTarget = event.currentTarget.classList[0].split("-").length;

        if ( CURRENT_VISUAL_CONTENT_DAY_NOTES === event.currentTarget.classList[0].split("-")[lengthClassCurrentTarget - 1] ) {
            return;
        };

        if ( event.currentTarget.classList[0].split("-")[lengthClassCurrentTarget - 1] === "grid" ) {
            changeCurrentVisualDayNotes("grid");
        } else if ( event.currentTarget.classList[0].split("-")[lengthClassCurrentTarget - 1] === "pillar" ) {
            changeCurrentVisualDayNotes("pillar");
        };

        this.appDayNoteItems.classList.add("app-day-items-notes-swicth-visual-content");

        setTimeout(() => {
            this.appDayNoteItems.remove();
            this.appDayNoteItems = document.createElement("div");

            this.createNoteItems_AppDay();
            this.createContent_AppDay();
        }, TIMEOUT * 1.25);
    }

    pressedBtnSorting_Important() {
        /* Сортирует заметки по степени важности.  */

        const pressedBtn_Importance = event.currentTarget.dataset.importance;

        const notes = this.appDayNoteItems.querySelectorAll(`.${pressedBtn_Importance}`);
        
        notes.forEach((note) => {
            note.style.cssText = `
                max-height: ${note.scrollHeight}px;
            `;

            note.classList.add("animation-sorting");

            setTimeout(() => {
                note.classList.add("animation-sorting-no-width_height");
                note.removeAttribute("style");
            }, TIMEOUT * 2);
        });

        setTimeout(() => {
            notes.forEach((note) => {
                note.classList.remove("animation-sorting", "animation-sorting-no-width_height");
                document.querySelector(".app-day__content-items-notes-day").prepend(note);
            });
        }, 500);
    }

    pressedBtnEdit(pressedDayMonth) {
        /* При нажатии кнопки редактиования на заметке, открывает окно редактирования заметки.  */

        this.currentBlockDay = pressedDayMonth;

        this.getDataPressedNote();

        this.addCurrentDataNote_ToForm();
        this.openFormEditNote();
    }

    replaces_Or_Removes_CounterNotes(dataSetCurrentDay) {
        /* Проверяет наличие счётчика при удалении или завершении заметки, и его удаляет или изменяет.  */

        let noteNumberByCount = Array.from(this.appDayContent.querySelectorAll(".app-day__content-note-day"));
        noteNumberByCount = noteNumberByCount.indexOf(this.pressedNote)

        for (noteNumberByCount; noteNumberByCount < NOTES_DATA[dataSetCurrentDay[0]][dataSetCurrentDay[1]].length; noteNumberByCount++) {
            const note = NOTES_DATA[dataSetCurrentDay[0]][dataSetCurrentDay[1]][noteNumberByCount]["note"];

            if (note[6]) {
                note[6]["counter"] = note[6]["counter"] - 1;

                if (note[6]["counter"] === 0) {
                    delete note[6];
                };
            };
        };
    }

    pressedBtnCompleted_Or_BtnDelete(act, pressedDayMonth, appDayContent) {
        /* При нажатии удаляет заметку с поля видения и также в обьекте - NOTES_DATA.  */

        this.currentBlockDay = pressedDayMonth;
        this.appDayContent = appDayContent;

        this.getDataPressedNote();

        if (act == "completed") {
            this.pressedNote.classList.add("animation-completed");

        } else if (act == "delete") {
            this.pressedNote.classList.add("animation-delete");
        };

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );
        const monthPressedNote = ARR_MONTHS[ARR_MONTHS.indexOf(dataSetBlockDay[0])];

        NOTES_DATA[monthPressedNote][dataSetBlockDay[1]].forEach((note) => {
            if (note["note"][1]["content"] == this.dataPressedNote["content"]) {
                const indexDelNote = NOTES_DATA[monthPressedNote][dataSetBlockDay[1]].indexOf(note);
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]].splice(indexDelNote, 1);
            };
        });

        this.replaces_Or_Removes_CounterNotes(
            this.dataSetCurrentDay = dataSetBlockDay
        );

        setTimeout(() => {
            this.pressedNote.remove();
        }, TIMEOUT * 2.8);


        add_DeleteActiveClass_BtnNotice();
    }


    // Отвечают за генерацию приложения и его составных частей.
    createTitle_AppDay() {
        /* Создаёт заголовок приложения  */

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );

        const titleDay = this.getTitleDay_PressedBlock(dataSetBlockDay[1], ARR_MONTHS.indexOf(dataSetBlockDay[0]), 2021);
        const strTitleDay = `${titleDay}, ${dataSetBlockDay[0]} ${dataSetBlockDay[1]}, 2021`;

        const titleAppDay = document.createElement("h2");
        titleAppDay.setAttribute("class", "app-day__content-title");
        titleAppDay.insertAdjacentHTML("beforeend", strTitleDay);
        
        this.appDayContent.append(titleAppDay);
    }

    createNoteItems_AppDay() {
        /* Создаёт контейнер для заметок.  */

        if ( CURRENT_VISUAL_CONTENT_DAY_NOTES === "pillar" ) {
            this.appDayNoteItems.setAttribute("class", "app-day__content-items-notes-day visual-content-pillar");
        } else if ( CURRENT_VISUAL_CONTENT_DAY_NOTES === "grid" ) {
            this.appDayNoteItems.setAttribute("class", "app-day__content-items-notes-day visual-content-grid");
        };

        this.appDayContent.append(this.appDayNoteItems);
    }

    createBtnAdd_AppDay() {
        /* Добавляет кнопку - добавления новой заметки  */

        const backBtnAddNote = document.createElement("div");
        backBtnAddNote.setAttribute("class", "app-day__content-note-day-back-add");

        const btnAppNote = document.createElement("a");
        btnAppNote.setAttribute("class", "app-day__content-note-day-back-add-btn flex");
        btnAppNote.setAttribute("role", "button");

        btnAppNote.insertAdjacentHTML("beforeend", `${ADD_NOTE_ICON_APP_DAY}`);

        btnAppNote.addEventListener("click", () => { this.openFormAddNote(); })

        backBtnAddNote.append(btnAppNote);

        this.appDayContent.append(backBtnAddNote);
    }

    createNotesBtns_SwitchingVisualContent() {
        /*
        Создаёт кнопки переключение визулального контента (позваоляет разместить заметки либо
        сеткой, либо в столбеу). 
        */

        const backBtnsSwitchVisualContent = document.createElement("div");
        backBtnsSwitchVisualContent.setAttribute("class", "app-day__content-note-day-back-btns-switch flex");

        const btnSwicthVisualContentGrid = document.createElement("a");
        btnSwicthVisualContentGrid.setAttribute("class", "app-day__content-note-day-btn-switch-grid flex");
        btnSwicthVisualContentGrid.setAttribute("role", "button");
        btnSwicthVisualContentGrid.insertAdjacentHTML("beforeend", `
            <svg xmlns="http://www.w3.org/2000/svg" fill="#666666" width="20" height="20" viewBox="0 0 24 24">
                <path d="M6 6h-6v-6h6v6zm9-6h-6v6h6v-6zm9 0h-6v6h6v-6zm-18 9h-6v6h6v-6zm9
                0h-6v6h6v-6zm9 0h-6v6h6v-6zm-18 9h-6v6h6v-6zm9 0h-6v6h6v-6zm9 0h-6v6h6v-6z"/>
            </svg>
        `);
        btnSwicthVisualContentGrid.addEventListener("click", () => { this.pressedBtnSwitchVisualContent(); });

        const btnSwicthVisualContentPillar = document.createElement("a");
        btnSwicthVisualContentPillar.setAttribute("class", "app-day__content-note-day-btn-switch-pillar flex");
        btnSwicthVisualContentPillar.setAttribute("role", "button");
        btnSwicthVisualContentPillar.insertAdjacentHTML("beforeend", `
            <svg xmlns="http://www.w3.org/2000/svg" fill="#666666" width="20" height="20" viewBox="0 0 24 24">
                <path d="M2 23h-2v-2h2v2zm0-12h-2v2h2v-2zm0 5h-2v2h2v-2zm0-15h-2v2h2v-2zm2 0v2h20v-2h-20zm-2
                5h-2v2h2v-2zm2 7h20v-2h-20v2zm0 10h20v-2h-20v2zm0-15h20v-2h-20v2zm0 10h20v-2h-20v2z"/>
            </svg>
        `);
        btnSwicthVisualContentPillar.addEventListener("click", () => { this.pressedBtnSwitchVisualContent(); });

        backBtnsSwitchVisualContent.append(btnSwicthVisualContentGrid, btnSwicthVisualContentPillar);

        this.appDayContent.append(backBtnsSwitchVisualContent);
    }

    createBtnsSortingNotes_Important() {
        /* Создаёт кнопки сортировки по степени важности.  */

        const backBtnOpenMenuSorting = document.createElement("div");
        backBtnOpenMenuSorting.setAttribute("class", "app-day__content-note-day-back-sorting-menu");

        const backBtnOpenMenuSortingWrapper = document.createElement("div");
        backBtnOpenMenuSortingWrapper.setAttribute("class", "app-day__content-note-day-back-sorting-menu-wrapper");

        const btnOpenMenuSorting = document.createElement("a");
        btnOpenMenuSorting.setAttribute("class", "app-day__content-note-day-btn-sorting-menu flex");
        btnOpenMenuSorting.setAttribute("role", "button");
        btnOpenMenuSorting.insertAdjacentHTML("beforeend", `
            ${SORTING_NOTES_IMPORTANT}
        `);
        btnOpenMenuSorting.addEventListener("click", () => {
            this.createMenuSortingNotes_Important(
                this.block = backBtnOpenMenuSortingWrapper
            );
        });

        backBtnOpenMenuSortingWrapper.append(btnOpenMenuSorting);
        backBtnOpenMenuSorting.append(backBtnOpenMenuSortingWrapper);

        this.appDayContent.append(backBtnOpenMenuSorting);
    }

    createMenuSortingNotes_Important(block) {
        /* Создаёт меню выбора сортировки заметок по важности.  */

        if ( document.querySelector(".app-day__content-note-day-menu-sorting") ) {
            return this.deleteSortingMenu();
        };

        const backMenuSorting = document.createElement("div");
        backMenuSorting.setAttribute("class", "app-day__content-note-day-menu-sorting flex");

        ARR_DEGREE_IMPORTANCE.forEach((degree) => {
            backMenuSorting.insertAdjacentHTML("beforeend", `
                <div class="app-day__content-note-day-menu-sorting-back-btn">
                    <a role="button" data-importance="${degree}" class="app-day__content-note-day-menu-sorting-btn flex ${degree}">
                        Button
                    </a>
                </div>
            `);

            const btnSort = backMenuSorting.querySelector(`.${degree}`);
            btnSort.addEventListener("click", () => { this.pressedBtnSorting_Important(); });
        });

        addCss_Block(
            backMenuSorting
        );

        block.append(backMenuSorting);

        document.addEventListener("click", this.addEventClick_InactiveZoneMenuSorting);
    }

    createNoteBtnBack_AppDay() {
        /* Создаёт кнопку - вернутся обратно (к приложению Month)  */

        const backBtnClose = document.createElement("div");
        backBtnClose.setAttribute("class", "app-day__content-note-day-back-close");

        const btnClose = document.createElement("a");
        btnClose.setAttribute("class", "app-day__content-note-day-back-close-btn flex");
        btnClose.setAttribute("role", "button");

        btnClose.insertAdjacentHTML("beforeend", `${ARROW_ICON_APP_DAY}`);
        btnClose.addEventListener("click", () => { this.pressedBtnBack(); });

        backBtnClose.append(btnClose);

        this.appDayContent.append(backBtnClose);
    }

    createContent_AppDay() {
        /* Генерирует основной контент (заметки и прочее).  */

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );

        const notesForSelectedDay = this.findNotes_PressedDay(this.dataSet = dataSetBlockDay);

        if (notesForSelectedDay) {
            notesForSelectedDay.forEach((noteData) => {
                new AppDay_CreateNote(this.appDayNoteItems, this.currentBlockDay).createNote_AppDay(noteData);
            });
        };
    }

    renderBlockApp() {
        /* Рендерит главный блок приложения и его составные части  */

        this.appDay.setAttribute("class", "app app-day");

        this.appDayContent.setAttribute("class", "app-day__content");

        this.createTitle_AppDay();
        this.createNoteBtnBack_AppDay();
        this.createBtnAdd_AppDay();
        this.createNotesBtns_SwitchingVisualContent();
        this.createBtnsSortingNotes_Important();
        this.createNoteItems_AppDay();
        this.createContent_AppDay();

        this.appDay.append(this.appDayContent);
        this.appWrapper.append(this.appDay);
    }

    render(currentBlockDay) {

        if (currentBlockDay) {
            this.currentBlockDay = currentBlockDay;
        };

        this.renderBlockApp();
        hides_appearsBlock_SectionDays();

        this.measuresHeightApp_addHeightWrapperApp();
    }
};


export class AppDay_CreateNote {
    /*
    Класс реализующий функционал создания заметки для приложения Day.
    */

    constructor(appDayNoteItems, pressedDayMonth) {
        this.appDayNoteItems = appDayNoteItems;
        this.pressedDayMonth = pressedDayMonth;
    }

    createNoteAppDay_TimeToAddNote(noteData) {
        /* Создаёт блок с временем добавлении заметки.  */

        const wrapperBlockTime = document.createElement("div");
        wrapperBlockTime.setAttribute("class", "app-day__content-note-day-back-time");

        wrapperBlockTime.insertAdjacentHTML("beforeend", `
            <h4 class="app-day__content-note-day-time">${noteData["note"][5]["time"]}</h4>
        `);

        return wrapperBlockTime;
    }

    createNote_AppDay_EditBtn() {
        /* Создаёт кнопку редактирование заметки.  */

        const btnEditNote_Wrapper = document.createElement("div");
        btnEditNote_Wrapper.setAttribute("class", "app-day__content-note-day-back-btn-edit");

        const btnEditNote = document.createElement("a");
        btnEditNote.setAttribute("class", "app-day__content-note-day-btn-edit flex app-day-content-note-day-btn");
        btnEditNote.setAttribute("role", "button");

        btnEditNote.insertAdjacentHTML("beforeend", `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="#ffffff" height="20" viewBox="0 0 24 24">
                <path d="M14.078 7.061l2.861 2.862-10.799 10.798-3.584.723.724-3.585 10.798-10.798zm0-2.829l-12.64 12.64-1.438
                7.128 7.127-1.438 12.642-12.64-5.691-5.69zm7.105 4.277l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z"/>
            </svg>
        `);

        btnEditNote.addEventListener("click", () => {
            new AppDay().pressedBtnEdit(this.pressedDayMonth);
        });

        btnEditNote_Wrapper.append(btnEditNote);

        return btnEditNote_Wrapper;
    }

    createNote_AppDay_CompletedBtn() {
        /* Создаёт кнопку завершение заметки.  */

        const btnCompletedNote_Wrapper = document.createElement("div");
        btnCompletedNote_Wrapper.setAttribute("class", "app-day__content-note-day-back-btn-completed");

        const btnCompletedNote = document.createElement("a");
        btnCompletedNote.setAttribute("class", "app-day__content-note-day-btn-completed flex flex");
        btnCompletedNote.setAttribute("role", "button");

        btnCompletedNote.addEventListener("click", () => {
            btnCompletedNote.classList.add("note-day-btn-completed-active");

            new AppDay().pressedBtnCompleted_Or_BtnDelete(
                "completed",
                this.pressedDayMonth,
                document.querySelector(".app-day__content")
            );
        });

        btnCompletedNote_Wrapper.append(btnCompletedNote);

        return btnCompletedNote_Wrapper;
    }

    createNote_AppDay_DeleteBtn() {
        /* Создаёт кнопку удаление заметки.  */

        const btnDeleteNote_Wrapper = document.createElement("div");
        btnDeleteNote_Wrapper.setAttribute("class", "app-day__content-note-day-back-btn-delete");

        const btnDeleteNote = document.createElement("a");
        btnDeleteNote.setAttribute("class", "app-day__content-note-day-btn-delete flex app-day-content-note-day-btn");
        btnDeleteNote.setAttribute("role", "button");

        btnDeleteNote.addEventListener("click", () => {
            new AppDay().pressedBtnCompleted_Or_BtnDelete(
                "delete",
                this.pressedDayMonth,
                document.querySelector(".app-day__content")
            );
        });

        btnDeleteNote.insertAdjacentHTML("beforeend", DELETE_ICON_APP_DAY);

        btnDeleteNote_Wrapper.append(btnDeleteNote);

        return btnDeleteNote_Wrapper;
    }

    createNote_AppDay(noteData) {
        /* Создаёт заметку.  */

        const note = document.createElement("div");
        note.setAttribute("class", `app-day__content-note-day flex degree-importance-${noteData["note"][2]["importance"]}`);

        const noteWrapperTitle_Text = document.createElement("div");
        noteWrapperTitle_Text.setAttribute("class", "app-day__content-note-day-wrapper flex");

        noteWrapperTitle_Text.insertAdjacentHTML("beforeend", `
            <h4 class="app-day__content-note-day-title">${noteData["note"][0]["subject"]}</h4>
            <div class="app-day__content-note-day-text">
                <p>${noteData["note"][1]["content"]}</p>
            </div>
        `);

        const noteWrapperBtnEdit_BtnCompleted = document.createElement("div");
        noteWrapperBtnEdit_BtnCompleted.setAttribute("class", "app-day__content-note-day-wrapper flex");

        const timeToAddNote = this.createNoteAppDay_TimeToAddNote(this.noteData = noteData);
        const btnEditNote = this.createNote_AppDay_EditBtn();
        const btnCompletedNote = this.createNote_AppDay_CompletedBtn();
        const btnDeletedNote = this.createNote_AppDay_DeleteBtn();

        noteWrapperBtnEdit_BtnCompleted.append(timeToAddNote, btnEditNote, btnCompletedNote, btnDeletedNote);

        note.append(noteWrapperTitle_Text);
        note.append(noteWrapperBtnEdit_BtnCompleted);

        this.appDayNoteItems.append(note);
    }
};
    