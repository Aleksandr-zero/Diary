import {
    NOTES_DATA,
    TIMEOUT,

    CURRENT_APP,
    changeCurrentApp,

    DATE_MONTH_CHANGE,

    ARR_DAYS,
    ARR_MONTHS,

    ARROW_ICON_APP_DAY,
    DELETE_ICON_APP_DAY,
    ADD_NOTE_ICON_APP_DAY

} from "../constants/constants.js";

import {
    GenerationAppMonth,
    GenerationAppMonth_CreateNotes
} from "./appMonth.js";

import { add_DeleteActiveClass_BtnNotice } from "../component/componentNotice.js";

import NavFooter from "../toolbars/navFooter.js";


export class GenerationAppDay {
    /*
    Класс, генерирующий приложение Day и его составные части.
    */

    constructor() {
        this.appWrapper = document.querySelector(".wrapper-app")

        this.classGenerationAppMonth_CreateNotes = new GenerationAppMonth_CreateNotes();

        this.formAddNew = document.querySelector(".calendar__form");
        this.formAddNew_BtnAdd = this.formAddNew.querySelector(".calendar__form-content-back-btn");

        this.appDay = document.createElement("div");
        this.appDayContent = document.createElement("div");
        this.appDayNoteItems = document.createElement("div");

        this.formBtnAdd_AddNote;
        this.formBtnAdd_EditNote;

        this.pressedFormBtnAdd = () => {
            /* Перезаписывает данные заметки  */

            const inputSubjectValue = this.formAddNew.querySelector("input").value;
            const contentTextAreaValue = this.formAddNew.querySelector("textarea").value;
            let btnLevelNoteActive_Value;
            const btnLevelNoteActive = this.formAddNew.querySelector(".calendar-form-btn-level-active");

            if (btnLevelNoteActive) {
                btnLevelNoteActive_Value = btnLevelNoteActive.dataset.importance
            } else {
                btnLevelNoteActive_Value = "normal";
            };

            if (this.formBtnAdd_EditNote) {
                this.overwritesCurrentDataNoteWithNew(
                    this.inputValue = inputSubjectValue,
                    this.textareaInput = contentTextAreaValue,
                    this.btnLevel_Value = btnLevelNoteActive_Value
                );
            } else if (this.formBtnAdd_AddNote) {
                this.createNewNote_AddDataDictionary(
                    this.inputValue = inputSubjectValue,
                    this.textareaInput = contentTextAreaValue,
                    this.btnLevel_Value = btnLevelNoteActive_Value
                );
            }

            this.formAddNew_BtnAdd.removeEventListener("click", this.pressedFormBtnAdd);
            this.closeFormAddNew();
        }

        this.pressedBtnFooterAddNewNote = () => {
            /* При нажатии открывает форму добавление новой заметки>  */
            console.log(event.currentTarget);
        }
    }

    // Вспомогательные методы.
    getSetAttribute_BlockDay(blockDay) {
        /* Возвращает массив дата-атрибутов (data-month, data-day).  */
        return [
            blockDay.dataset.month,
            +(blockDay.dataset.day)
        ];
    }

    getDataPressedNote() {
        /* Получает контент нажатой заметки.  */

        this.pressedNote = event.currentTarget.closest('.app-day__content-note-day');

        this.dataPressedNote = {
            "subject": this.pressedNote.querySelector("h4").innerHTML,
            "content": this.pressedNote.querySelector("p").innerHTML,
            "importance": this.pressedNote.classList[1].split("-")[2],
        };
    }

    getTitleDay_PressedBlock(day, month, year) {
        /* Возвращает названия дня нажатого блока приложения Month.  */
        return ARR_DAYS[new Date(year, month, day).getDay()];
    }

    hides_appearsBlock_SectionDays() {
        /* Скрывает блок - sectionDay  */

        const sectionDays = document.querySelector(".section-days");
        sectionDays.classList.toggle("section-days-pass");
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

    blocksBtnsHeaderMonth() {
        /* Блокирует кнопки переключатели месяцув.  */
        const navHeader_BtnMonth = document.querySelectorAll(".nav-header__content-btn-month");

        navHeader_BtnMonth.forEach((btnMonth) => {
            btnMonth.classList.toggle("nav-header-content-btn-month-pass");
        });
    }

    overwritesCurrentDataNoteWithNew(inputValue, textareaInput, btnLevel_Value) {
        /* Перезаписывает текущие данные на новые на выбранной заметки.  */

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );

        const monthPressedNote = ARR_MONTHS[ARR_MONTHS.indexOf(dataSetBlockDay[0])];

        Object.keys(NOTES_DATA[monthPressedNote][dataSetBlockDay[1]]).forEach((note) => {
            if (NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][1]["content"] ==
                                this.dataPressedNote["content"]) {

                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][0]["subject"] = inputValue;
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][1]["content"] = textareaInput;
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][2]["importance"] = btnLevel_Value;
                NOTES_DATA[monthPressedNote][dataSetBlockDay[1]][note]["note"][5]["time"] = `${new Date().getHours()}:${new Date().getMinutes()}`;
            };
        });

        this.pressedNote.querySelector(".app-day__content-note-day-title").innerHTML = inputValue;
        this.pressedNote.querySelector(".app-day__content-note-day-text").innerHTML = `<p>${textareaInput}</p>`;
        this.pressedNote.classList.remove(this.pressedNote.classList[1]);
        this.pressedNote.classList.add(`degree-importance-${btnLevel_Value}`);

        this.pressedNote.querySelector(".app-day__content-note-day-time").innerHTML = `${new Date().getHours()}:${new Date().getMinutes()}`;
    }

    createNewNote_AddDataDictionary(inputValue, textareaInput, btnLevel_Value) {
        /* Создаёт новую заметку и добавляет в словарь - NOTES_DATA.  */

        if (!textareaInput && !inputValue) {
            return;
        };

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );

        if (NOTES_DATA[dataSetBlockDay[0]][dataSetBlockDay[1]] == undefined) {
            NOTES_DATA[dataSetBlockDay[0]][dataSetBlockDay[1]] = [];
        };

        NOTES_DATA[dataSetBlockDay[0]][dataSetBlockDay[1]].push({
            note: [
                {"subject": `${inputValue}`},
                {"content": `${textareaInput}`},
                {"importance": `${btnLevel_Value}`},
                {"month": dataSetBlockDay[0]},
                {"number_day_month": dataSetBlockDay[1]},
                {"time": `${new Date().getHours()}:${new Date().getMinutes()}`}
            ]
        });

        const notes = this.appDayNoteItems.querySelectorAll(".app-day__content-note-day").length;

        const lengthNotesData_Note = NOTES_DATA[dataSetBlockDay[0]][dataSetBlockDay[1]].length;
        if (notes >= 1) {
            NOTES_DATA[dataSetBlockDay[0]][dataSetBlockDay[1]][lengthNotesData_Note - 1]["note"]
                                                            .push({"counter": notes});
        };

        this.createNote_AppDay(
            this.noteData = NOTES_DATA[dataSetBlockDay[0]][dataSetBlockDay[1]][lengthNotesData_Note - 1]
        );


        add_DeleteActiveClass_BtnNotice();
    }

    // Отвечают за добавления событий и их обработчиков.
    pressedAppMonthItemDay() {
        /* При клике генерирует приложение - день. */

        this.changesButtonsActivity_NavHeader(
            this.nextApp = "day"
        );

        this.appMonth = document.querySelector(".app-month");
        this.appMonth.classList.add("switching-app");

        this.blocksBtnsHeaderMonth();

        this.currentBlockDay = event.target.closest(".app-month__content-item");

        setTimeout(() => {
            this.appMonth.remove();
            this.render();
        }, TIMEOUT * 1.25);
    }

    moveZoneAppDay() {
        /* Навешивает событие наведение на приложение Day, если курсор достигнет   */
        // const widthAppDay = this.appDay.offsetWidth;

        // console.log(event.clientX);
    }

    activeBtnSwicth_AppDay() {
        /*
        Добавляет к кнопке-переключатель активный класс - т.е даёт возможность переключать
        дни в приложении Day.
        */
    }

    openFormEditNote() {
        /* Открывает форму для редактирования заметки.  */

        this.formBtnAdd_AddNote = false;
        this.formBtnAdd_EditNote = true;

        this.formAddNew.classList.add("calendar-form-active");
        this.formAddNew_BtnAdd.addEventListener("click", this.pressedFormBtnAdd);
    }

    openFormAddNote() {
        /* Открывает форму для добавления заметки.  */

        this.formBtnAdd_AddNote = true;
        this.formBtnAdd_EditNote = false;

        this.formAddNew.classList.add("calendar-form-active");
        this.formAddNew_BtnAdd.addEventListener("click", this.pressedFormBtnAdd);
    }

    addCurrentDataNote_ToForm() {
        /* Добавляет текущие данные для редактирование.  */

        const inputSubject = this.formAddNew.querySelector(".calendar__form-content-back-input");
        const contentTextArea = this.formAddNew.querySelector(".calendar__form-content-back-textarea");
        const btnsLevelNote = this.formAddNew.querySelectorAll(".calendar__form-content-back-btn-level");

        inputSubject.value = `${this.dataPressedNote["subject"]}`;
        contentTextArea.value = `${this.dataPressedNote["content"]}`;

        btnsLevelNote.forEach((btnLevel) => {
            if (this.dataPressedNote["importance"] == btnLevel.dataset.importance) {
                btnLevel.classList.add("calendar-form-btn-level-active");
            };
        });
    }

    closeFormAddNew() {
        /* Зыкрывает форму и чищет в ней поля. */

        this.formAddNew.classList.remove("calendar-form-active");

        setTimeout(() => {
            this.formAddNew.querySelector("input").value = "";
            this.formAddNew.querySelector("textarea").value = "";
            if (this.formAddNew.querySelector(".calendar-form-btn-level-active")) {
                this.formAddNew.querySelector(".calendar-form-btn-level-active").classList.remove("calendar-form-btn-level-active");
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
            this.hides_appearsBlock_SectionDays();

            const classGenerationAppMonth = new GenerationAppMonth(false);
            classGenerationAppMonth.render();

            this.appMonth = document.querySelector(".app-month");

            this.classGenerationAppMonth_CreateNotes.createAllNote_SpecifiedMonth();

            this.blocksBtnsHeaderMonth();
        }, TIMEOUT * 1.25);
    }

    pressedBtnEdit() {
        /* При нажатии открывает окно редактирования заметки.  */

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

    pressedBtnCompleted_Or_BtnDelete(act) {
        /* При нажатии удаляет заметку с поля видения и также в словаре - NOTES_DATA.  */

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

        this.appDayNoteItems.setAttribute("class", "app-day__content-items-notes-day");

        this.appDayContent.append(this.appDayNoteItems);
    }

    createBtnAdd_AppDay() {
        /* Добавляет кнопку - добавления новой заметки  */

        const backBtnAddNote = document.createElement("div");
        backBtnAddNote.setAttribute("class", "app-day__content-note-day-back-add");

        const btnAppNote = document.createElement("a");
        btnAppNote.setAttribute("class", "app-day__content-note-day-back-add-btn");
        btnAppNote.setAttribute("role", "button");

        btnAppNote.insertAdjacentHTML("beforeend", `${ADD_NOTE_ICON_APP_DAY}`);

        btnAppNote.addEventListener("click", () => { this.openFormAddNote(); })

        backBtnAddNote.append(btnAppNote);

        this.appDayContent.append(backBtnAddNote);
    }

    createNoteBtnBack_AppDay() {
        /* Создаёт кнопку - вернутся обратно (к приложению Month)  */

        const backBtnClose = document.createElement("div");
        backBtnClose.setAttribute("class", "app-day__content-note-day-back-close");

        const btnClose = document.createElement("a");
        btnClose.setAttribute("class", "app-day__content-note-day-back-close-btn");
        btnClose.setAttribute("role", "button");

        btnClose.insertAdjacentHTML("beforeend", `${ARROW_ICON_APP_DAY}`);
        btnClose.addEventListener("click", () => { this.pressedBtnBack(); });

        backBtnClose.append(btnClose);

        this.appDayContent.append(backBtnClose);
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
        btnEditNote.setAttribute("class", "app-day__content-note-day-btn-edit app-day-content-note-day-btn");
        btnEditNote.setAttribute("role", "button");

        btnEditNote.insertAdjacentHTML("beforeend", `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="#ffffff" height="20" viewBox="0 0 24 24">
                <path d="M14.078 7.061l2.861 2.862-10.799 10.798-3.584.723.724-3.585 10.798-10.798zm0-2.829l-12.64 12.64-1.438
                7.128 7.127-1.438 12.642-12.64-5.691-5.69zm7.105 4.277l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z"/>
            </svg>
        `);

        btnEditNote.addEventListener("click", () => { this.pressedBtnEdit(); });

        btnEditNote_Wrapper.append(btnEditNote);

        return btnEditNote_Wrapper;
    }

    createNote_AppDay_CompletedBtn() {
        /* Создаёт кнопку завершение заметки.  */

        const btnCompletedNote_Wrapper = document.createElement("div");
        btnCompletedNote_Wrapper.setAttribute("class", "app-day__content-note-day-back-btn-completed");

        const btnCompletedNote = document.createElement("a");
        btnCompletedNote.setAttribute("class", "app-day__content-note-day-btn-completed app-day-content-note-day-btn");
        btnCompletedNote.setAttribute("role", "button");

        btnCompletedNote.addEventListener("click", () => {
            btnCompletedNote.classList.add("note-day-btn-completed-active");

            this.pressedBtnCompleted_Or_BtnDelete(
                this.act = "completed"
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
        btnDeleteNote.setAttribute("class", "app-day__content-note-day-btn-delete app-day-content-note-day-btn");
        btnDeleteNote.setAttribute("role", "button");

        btnDeleteNote.addEventListener("click", () => { this.pressedBtnCompleted_Or_BtnDelete(this.act = "delete"); });
        btnDeleteNote.insertAdjacentHTML("beforeend", DELETE_ICON_APP_DAY);

        btnDeleteNote_Wrapper.append(btnDeleteNote);

        return btnDeleteNote_Wrapper;
    }

    createNote_AppDay(noteData) {
        /* Создаёт заметку.  */

        const note = document.createElement("div");
        note.setAttribute("class", `app-day__content-note-day degree-importance-${noteData["note"][2]["importance"]}`);

        const noteWrapperTitle_Text = document.createElement("div");
        noteWrapperTitle_Text.setAttribute("class", "app-day__content-note-day-wrapper");

        noteWrapperTitle_Text.insertAdjacentHTML("beforeend", `
            <h4 class="app-day__content-note-day-title">${noteData["note"][0]["subject"]}</h4>
            <div class="app-day__content-note-day-text">
                <p>${noteData["note"][1]["content"]}</p>
            </div>
        `);

        const noteWrapperBtnEdit_BtnCompleted = document.createElement("div");
        noteWrapperBtnEdit_BtnCompleted.setAttribute("class", "app-day__content-note-day-wrapper");

        const timeToAddNote = this.createNoteAppDay_TimeToAddNote(this.noteData = noteData);
        const btnEditNote = this.createNote_AppDay_EditBtn();
        const btnCompletedNote = this.createNote_AppDay_CompletedBtn();
        const btnDeletedNote = this.createNote_AppDay_DeleteBtn();

        noteWrapperBtnEdit_BtnCompleted.append(timeToAddNote, btnEditNote, btnCompletedNote, btnDeletedNote);

        note.append(noteWrapperTitle_Text);
        note.append(noteWrapperBtnEdit_BtnCompleted);

        this.appDayNoteItems.append(note);
    }

    createContent_AppDay() {
        /* Генерирует основной контент (заметки и прочее).  */

        const dataSetBlockDay = this.getSetAttribute_BlockDay(
            this.blockDay = this.currentBlockDay
        );

        const notesForSelectedDay = this.findNotes_PressedDay(this.dataSet = dataSetBlockDay);

        if (notesForSelectedDay) {
            notesForSelectedDay.forEach((noteData) => {
                this.createNote_AppDay(this.noteData = noteData);
            });
        };
    }

    renderBlockApp() {
        /* Рендерит главный блок приложения и его составные части  */

        this.appDay.setAttribute("class", "app app-day");
        this.appDay.addEventListener("mousemove", () => { this.moveZoneAppDay(); });

        this.appDayContent.setAttribute("class", "app-day__content");

        this.createTitle_AppDay();
        this.createNoteBtnBack_AppDay();
        this.createBtnAdd_AppDay();
        this.createNoteItems_AppDay();
        this.createContent_AppDay();

        this.appDay.append(this.appDayContent);
        this.appWrapper.append(this.appDay);
    }

    render(currentBlockDay) {

        if (currentBlockDay) {
            this.currentBlockDay = currentBlockDay;
        };

        this.hides_appearsBlock_SectionDays();
        this.renderBlockApp();
    }
};
