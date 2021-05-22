import {
    NOTES_DATA,
    TIMEOUT,
    DATE,

    DATE_MONTH_CHANGE,

    ARR_DAYS,
    ARR_MONTHS,

} from "../constants/constants.js";
import { AppDay } from "./appDay.js";

import { NavFooter } from "../toolbars/navFooter.js";
import { WorkingWithForm } from "../commonTools/form.js"

import { add_DeleteActiveClass_BtnNotice } from "../components/componentNotice.js";


export class AppMonth {
    /* 
    Класс генерирующий основной блок приложения и его составные части.
    (генерирует месяц).
    */
    
    constructor(generationForFirstLaunch) {

        this.classComponentContextMenu_AppMonth = new ComponentContextMenu_AppMonth();

        this.generationForFirstLaunch = generationForFirstLaunch;
        this.checksAppNeedsCreated_FirstLaunch();

        this.blocksItemDayApp;

        this.columnsAppItems = 7;
        this.rowsAppItems = 6;

        this.number_RecordedDays = 0;
    }

    // вспомогательные методы.
    checksAppNeedsCreated_FirstLaunch(forciblyCreate = false) {
        /*
        Проверяет надо ли создавть блоки при первом запуске, нужно для того чтобы при смене
        месяца не создавлось многочисленно количество этих блоков.
        */

        if (this.generationForFirstLaunch || forciblyCreate) {
            this.wrapperApp = document.querySelector(".wrapper-app");
            this.appMonth = document.createElement("div");
            this.appContent = document.createElement("div");
        };
    }

    getDays_In_Month(month) {
        /* Возвращает список - количество дней в месяце и название последнего дня этого месяца.  */

        return [
            new Date(DATE.getFullYear(), month + 1, 0).getDate(),
            ARR_DAYS[new Date(DATE.getFullYear(), month + 1, 0).getDay()],
        ];
    }

    measuresHeightApp_addHeightWrapperApp() {
        /*
        Измеряет высоту блока "app" и добавляет высоту к блоку "wrapperApp", для того чтобы
        при смене блока "app" не было тряски контента.
        */

        this.wrapperApp.style.height = `${this.appMonth.offsetHeight}px`;
    }


    // Отвечают за добавления событий на составные части приложения.
    iteratesOverDaysAppMonth_AddEvent() {
        /* Перебрает дни для добавления события нажатия.  */

        const pressedDayApp_AddActiveClass = () => {
            /* Добавляет активный класс блоку при нажатии. */

            this.blocksItemDayApp.forEach((itemDay) => {
                if (itemDay.classList.contains("app-month-content-item-pressed-btn")) {
                    itemDay.classList.remove("app-month-content-item-pressed-btn");
                };
            });
    
            event.currentTarget.classList.add("app-month-content-item-pressed-btn");
        };

        this.blocksItemDayApp = this.appMonth.querySelectorAll(".app-month__content-item");

        this.blocksItemDayApp.forEach((itemDay) => {
            itemDay.addEventListener("click", pressedDayApp_AddActiveClass);
        });
    }

    addEventPressed_AppMonth_InactiveZone() {
        /*
        Добавления события на блок "appMonth" - при нажатии на неактивную зону,
        активный класс у блока (app__content-item) удаляется.s
        */

        document.querySelector(".diary").addEventListener("click", () => {

            // Если форма для заполнения заметки будет открыта (для того чтобы сохранять активный день)
            if (document.querySelector(".diary__form").classList.contains("diary-form-active")) {
                return;
            };

            // В противном случае удаляем
            if (!event.target.closest(".app-month__content")) {

                // Если мы нажали на кнопку "Добавить новое", для того чтобы пользователь
                // видел какой день он выбрал.
                if (event.target.classList[0] != "nav-footer__content-btn") {
                    let appItemDay = this.appItems.querySelector(".app-month-content-item-pressed-btn");

                    if (appItemDay) {
                        appItemDay.classList.remove("app-month-content-item-pressed-btn");
                    };
                };
            };
        });
    }

    addEventPressed_Click_AppMonthBlockDay(blockDay) {
        /* Добавления события на блок день приложения и вызывает генерацию приложения - day  */

        blockDay.addEventListener("dblclick", () => {
            this.classGenerationAppDay.pressedAppMonthItemDay();
            this.classGenerationAppDay = null;
        });

        blockDay.addEventListener("contextmenu", () => {
            this.addEventClickContextMenuMouse_AppMonthItemDay();
        });
    };

    addEventClickContextMenuMouse_AppMonthItemDay() {
        /* Добавляет событие нажитие правой кнопки мыши, вызывая при этом контекстное меню.  */

        event.preventDefault();

        if (this.appContent.querySelector(".app-month__content-item-context-menu")) {
           this.appContent.querySelector(".app-month__content-item-context-menu").remove();
        };

        const targetData = event.currentTarget.getBoundingClientRect();

        const positionPressedX = event.clientX - targetData.left;
        const positionPressedY = event.clientY - targetData.top;

        const contextMenu = this.classComponentContextMenu_AppMonth.createContextMenu_AppMonthDay(
            this.pressedAppMonthDay = event.target.closest(".app-month__content-item")
        );

        event.currentTarget.append(contextMenu);

        contextMenu.style.cssText = `
            opacity: 1;
            top: ${positionPressedY}px;
            left: ${contextMenu.clientWidth - (contextMenu.clientWidth - positionPressedX)}px;
            z-index: 40;
        `;

        event.target.closest(".app-month__content-item").style.cssText = `
            overflow: visible;
            border: 0.5px solid #884CB2;
            background-color: rgba(136, 76, 178, 0.15);
            overflow: visible;
            z-index: 30;
        `;
    }


    // Отвечают за генерацию самого приложения и его составных частей.
    createBlockItem_AppMonth(classBlockItem, classBlockItemDay, dayNumber, dataAttributes) {
        /*
        Создаёт блок дня месяца и навешивает событие при двойном клике, вызывая при этом
        генерацю приложения - day.
        */

        let blockAppDay = document.createElement("div");
        blockAppDay.setAttribute("class", `${classBlockItem} flex`);

        // Для добавления data-атрибута, чтобы при клике на день записывать значение месяца этого дня
        blockAppDay.setAttribute("data-month", dataAttributes["month"]);
        blockAppDay.setAttribute("data-day", dataAttributes["day"]);

        blockAppDay.insertAdjacentHTML("beforeend", `
            <h4 class="${classBlockItemDay}">${dayNumber}</h4>
        `)

        if (dataAttributes["month"] == ARR_MONTHS[DATE.getMonth()] && dayNumber == DATE.getDate()) {
            blockAppDay.setAttribute("class", `${classBlockItem} app-month-content-item-current-day`);
        };

        this.addEventPressed_Click_AppMonthBlockDay(
            this.blockDay = blockAppDay
        );

        this.appItems.append(blockAppDay);
    }

    renderLastDays_In_LastMonth() {
        /* Записывает дни прошлого месяца.  */

        let numberDays_in_LastMonth = this.getDays_In_Month(
            this.month = DATE_MONTH_CHANGE - 1
        )[0];

        let numberDays_in_LastMonth_Title = this.getDays_In_Month(
            this.month = DATE_MONTH_CHANGE - 1
        )[1];
    
        let start_Of_DayCountdown = numberDays_in_LastMonth - ARR_DAYS.indexOf(numberDays_in_LastMonth_Title);

        for (start_Of_DayCountdown; start_Of_DayCountdown <= numberDays_in_LastMonth; start_Of_DayCountdown++) {
            this.createBlockItem_AppMonth(
                this.classBlockItem = "app-month__content-item",
                this.classBlockItemDay = "app-month__content-item-day app-month-day-pass",
                this.dayNumber = start_Of_DayCountdown,
                this.dataAttributes = {
                    "month": ARR_MONTHS[DATE_MONTH_CHANGE - 1],
                    "day": start_Of_DayCountdown
                }
            );
    
            this.number_RecordedDays++;
        };
    }

    renderDays_In_CurrentMonth() {
        /* Записывает дни текущего месяца.  */
    
        let numberDays_in_CurrentMonth = this.getDays_In_Month(
            this.month = DATE_MONTH_CHANGE
        )[0];
    
        for (let indexDay = 1; indexDay <= numberDays_in_CurrentMonth; indexDay++) {

            this.createBlockItem_AppMonth(
                this.classBlockItem = "app-month__content-item",
                this.classBlockItemDay = "app-month__content-item-day",
                this.dayNumber = indexDay,
                this.dataAttributes = {
                    "month": ARR_MONTHS[DATE_MONTH_CHANGE],
                    "day": indexDay
                }
            );
        };
    
        this.number_RecordedDays += numberDays_in_CurrentMonth;
    };

    renderDays_In_NextMonth() {
        /* Записывает дни следующего месяца.  */

        for (let indexDay = 1; indexDay <= (this.columnsAppItems * this.rowsAppItems) - this.number_RecordedDays; indexDay++) {
            this.createBlockItem_AppMonth(
                this.classBlockItem = "app-month__content-item",
                this.classBlockItemDay = "app-month__content-item-day app-month-day-pass",
                this.dayNumber = indexDay,
                this.dataAttributes = {
                    "month": ARR_MONTHS[DATE_MONTH_CHANGE + 1],
                    "day": indexDay
                }
            );
        };
    }

    renderBlockApp() {
        /* Создаёт главный блок - appMonth.  */

        this.classGenerationAppDay = new AppDay();

        this.checksAppNeedsCreated_FirstLaunch(
            this.forciblyCreate = true
        );

        this.appMonth.setAttribute("class", "app app-month");

        this.appContent.setAttribute("class", "app-month__content");

        this.appItems = document.createElement("div");
        this.appItems.setAttribute("class", "app-month__content-items");

        this.appContent.append(this.appItems);
        this.appMonth.append(this.appContent);

        this.wrapperApp.append(this.appMonth);


        this.measuresHeightApp_addHeightWrapperApp();
    }

    render() {
        /* Рендерит приложение.  */

        this.renderBlockApp();

        this.renderLastDays_In_LastMonth();
        this.renderDays_In_CurrentMonth();
        this.renderDays_In_NextMonth();

        this.addEventPressed_AppMonth_InactiveZone();

        this.iteratesOverDaysAppMonth_AddEvent();

        this.number_RecordedDays = 0;
    }


    // Отвечают за генерацию заметки для выбранного дня.
    createNote_ForItemBlockApp(noteData) {
        /* Создаёт заметку для выбранного дня в календаре.  */

        const note = document.createElement("div");

        if (noteData[3]["month"] != ARR_MONTHS[DATE_MONTH_CHANGE]) {
            note.setAttribute("class", `app-month__content-item-note degree-importance-${noteData[2]["importance"]} flex note-for-past-or-next`);
        } else {
            note.setAttribute("class", `app-month__content-item-note degree-importance-${noteData[2]["importance"]} flex`);
        };

        const noteTitle = document.createElement("h6");
        noteTitle.setAttribute("class", "app-month__content-item-note-title");

        if (noteData[0]["subject"]) {
            noteTitle.insertAdjacentHTML("beforeend", 
                `${noteData[0]["subject"]}<span>:</span>`    
            );
        };

        const noteText = document.createElement("div");
        noteText.setAttribute("class", "app-month__content-item-note-text");
        noteText.insertAdjacentHTML("beforeend", 
            `<p>${noteData[1]["content"]}</p>`    
        );

        note.append(noteTitle);
        note.append(noteText);

        return note;
    }

    createNotesCounter(numberNotes) {
        /* Устанавливает счётчик остальных заметок для блока activeItemBlockApp. Если будет переполнение  */

        const counter = document.createElement("div");
        counter.setAttribute("class", "app-month__content-item-counter-notes");

        counter.insertAdjacentHTML("beforeend", `
            <h4 class="app-month__content-item-counter-notes-number flex">+${numberNotes}</h4>
        `);

        return counter;
    }

    changeScoreNumber_NotesCounter(activeBlockDay, numberScroe) {
        /* Изменяет счётчик остальных заметок.  */

        const counter = activeBlockDay.querySelector(".app-month__content-item-counter-notes-number");
        counter.innerHTML  =`+${numberScroe}`;
    }

    measuresWidthBlock_NoteApp(note) {
        /*
        Измеряет длину заметки - если будет превышено 200px то мы добавляем фиксированную ширину 200px
        для текста и для заголовка 100px (для того чтобы блок не был слишом длинным).
        */

        if (note.offsetWidth >= 240) {
            note.querySelector(".app-month__content-item-note-text > p").style.width = "200px";
        };

        if (note.querySelector(".app-month__content-item-note-title").offsetWidth > 100) {
            note.querySelector(".app-month__content-item-note-title").style.width = "100px";
        };
    }
};


export class AppMonth_CreateNotes extends AppMonth {
    /*
    Класс расширяющий функционал класса - GenerationAppMonth. Создание заметок при смене месяца или его
    генераии.
    */

    createAllNote_SpecifiedMonth() {
        /* Создаёт все заметки при смены месяца, на указанный месяц.  */

        const appMonth = document.querySelector(".app-month");

        Object.keys(NOTES_DATA).forEach((monthNote) => {
            NOTES_DATA[monthNote].forEach((noteDays) => {
                noteDays.forEach((note) => {
                    this.createNote(
                        this.noteData = note,
                        this.appMonth = appMonth
                    );
                });
            });
        });
    }

    createNote(noteData, appMonth) {
        /* Генерация вёрстки блока заметки.  */

        // Берём текущий, прошлый и следующий месяц (для того чтобы не перебирать весь обьект).
        if (noteData["note"][3]["month"] == ARR_MONTHS[DATE_MONTH_CHANGE] == false ||
            noteData["note"][3]["month"] == ARR_MONTHS[DATE_MONTH_CHANGE - 1] == false ||
            noteData["note"][3]["month"] == ARR_MONTHS[DATE_MONTH_CHANGE + 1] == false) {

        } else {
            return;
        }

        const note = super.createNote_ForItemBlockApp(
            this.noteData = noteData["note"]
        );

        if (note) {
            // Находим нужный день для заметки по data-day и по data-month (чтобы не перебирать весь NodeList
            // и находить нужный нам день по сравнению).

            const itemDay_ForNote = appMonth.querySelector(".app-month__content-item"
                                               + `[data-month="${noteData["note"][3]["month"]}"]`
                                               + `[data-day="${noteData["note"][4]["number_day_month"]}"]`);

            if (itemDay_ForNote) {
                itemDay_ForNote.append(note);

                super.measuresWidthBlock_NoteApp(
                    this.note = note
                );

                this.checksWhetherSetNoteCounter(
                    this.noteData = noteData,
                    this.itemDay = itemDay_ForNote,
                    this.note = note
                );              
            };
        };
    }

    checksWhetherSetNoteCounter(noteData, itemDay, note) {
        /* Проверяет нужно ли устанавливать счётчик не вмещаемых заметок.  */

        if (itemDay.querySelector(".app-month__content-item-counter-notes")) {
            itemDay.querySelector(".app-month__content-item-counter-notes-number")
                                                .innerHTML = `+${noteData["note"][6]["counter"]}`;

            note.style.cssText = `
                opacity: 0;
                visibility: hidden;
            `;

            return;
        };

        if (noteData["note"][6]) {

            const counter = super.createNotesCounter(
                this.numberNotes = noteData["note"][6]["counter"]
            );

            itemDay.append(counter);

            note.style.cssText = `
                opacity: 0;
                visibility: hidden;
            `;
        };
    }
};


class ComponentContextMenu_AppMonth {
    /*
    Генерирует контексттное меню при клике на правую кнопку мыши.
    */

    constructor() {
        this.menuState = 0;
        this.lastPressedDay;

        this.classWorkingWithForm = new WorkingWithForm();

        this.addEventClick_InactiveZoneContextMenu = () => {
            /* При нажатии на неактивную зону 'backContextMenu' удаляем контект меню.  */

            event.preventDefault();

            if (!event.target.closest(".app-month__content-item-context-menu")) {

                if (event.type === "contextmenu" && this.menuState === 0) {
                    this.menuState = 1;
                    this.lastPressedDay = event.target.closest(".app-month__content-item");

                    return;
                };

                if (event.type === "contextmenu" || event.keyCode === 27) {
                    setTimeout(() => {
                        this.lastPressedDay.removeAttribute("style");
                        this.lastPressedDay = null;
                    }, TIMEOUT * 1.1);
                };

                this.deleteContextMenu();
                this.removeEventsDocument();
                this.menuState = 0;
            };
        };
    }

    // Вспомогательные методы.
    removeEventsDocument() {
        document.removeEventListener("click",       this.addEventClick_InactiveZoneContextMenu);
        document.removeEventListener("contextmenu", this.addEventClick_InactiveZoneContextMenu);
        document.removeEventListener("keyup",       this.addEventClick_InactiveZoneContextMenu);
    }

    // Отвечают за добавления событий и их обработчиков
    pressedBtnOpenDay() {
        /* Переключает приложение Month на Day.  */

        this.removeEventsDocument();

        new AppDay().pressedAppMonthItemDay();
        this.deleteContextMenu();
    }

    pressedBtnCreateNote() {
        /* Открывает окно создание заметки.  */

        this.deleteContextMenu();

        this.classWorkingWithForm.start(
            event.target.closest(".app-month__content-item"),
            "month"
        );
    }

    // Отвечают за генерарацию компонента.
    createContextMenu_AppMonthDay(pressedAppMonthDay) {
        /* Генерирует контекстное меню для выбранного блока - день, при клике правой кнопки мыши  */

        this.pressedAppMonthDay = pressedAppMonthDay;

        this.backContextMenu = document.createElement("div");
        this.backContextMenu.setAttribute("class", "app-month__content-item-context-menu");

        document.addEventListener("click",       this.addEventClick_InactiveZoneContextMenu);
        document.addEventListener("contextmenu", this.addEventClick_InactiveZoneContextMenu);
        document.addEventListener("keyup",       this.addEventClick_InactiveZoneContextMenu);

        this.backContextMenu.insertAdjacentHTML("beforeend", `
            <div class="app-month__content-item-context-menu-back-btns">
                <div class="app-month__content-item-context-menu-back-btn">
                    <a role="button" class="app-month__content-item-context-menu-btn btn-open-context-menu">Open</a>
                </div>
                <div class="app-month__content-item-context-menu-back-btn">
                    <a role="button" class="app-month__content-item-context-menu-btn btn-create_note-context-menu">Create note</a>
                </div>
            </div>
        `);

        this.backContextMenu.querySelector(".btn-open-context-menu").addEventListener("click", () => {
            this.pressedBtnOpenDay();
        });

        this.backContextMenu.querySelector(".btn-create_note-context-menu").addEventListener("click", () => {
            this.pressedBtnCreateNote();
        });

        return this.backContextMenu;
    }

    deleteContextMenu() {
        /* Удаляет контекст меню.  */

        this.backContextMenu.style.opacity = "0";

        setTimeout(() => {
            this.pressedAppMonthDay.removeAttribute("style");
            this.backContextMenu.remove();
        }, TIMEOUT * 1.1)
    }
};
    