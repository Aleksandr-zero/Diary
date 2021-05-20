import {
	TIMEOUT,
    DATE,

    ARR_MONTHS,
	NOTES_DATA,

} from "../constants/constants.js";

import { add_DeleteActiveClass_BtnNotice } from "../components/componentNotice.js";

import { NavFooter_CreateNote } from "../toolbars/navFooter.js";

import { addCss_Block } from "../commonTools/generationComponent.js";

import { AppDay_CreateNote } from "../app/appDay.js";


export const setsTime_For_Note = () => {
    /* Устанавливает время для сохранения в NOTES_DATA.  */

    let time;

    if (new Date().getMinutes() <= 9) {
        time = `${new Date().getHours()}:0${new Date().getMinutes()}`;
    } else {
        time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    };

    return time;
};

export const saveDataNote_NOTES_DATA = (activeItemBlockApp, receivedDataFromForm, locationCreateNote) => {
	/* Сохраняет полученные данные о заметке в обьект.  */

	const numberDay = +(activeItemBlockApp.querySelector(".app-month__content-item-day").innerHTML);

	if (NOTES_DATA[activeItemBlockApp.dataset.month][numberDay] == undefined) {
		NOTES_DATA[activeItemBlockApp.dataset.month][numberDay] = [];
	};

	const time = setsTime_For_Note();

	NOTES_DATA[activeItemBlockApp.dataset.month][numberDay].push({
		note: [
			{"subject": `${receivedDataFromForm['subject'].replace(/\s+/g, ' ').trim()}`},
			{"content": `${receivedDataFromForm['content'].replace(/\s+/g, ' ').trim()}`},
			{"importance": `${receivedDataFromForm['importance']}`},
			{"month": activeItemBlockApp.dataset.month},
			{"number_day_month": numberDay},
			{"time": time}
		]
	});

	if (locationCreateNote === "month") {
		new NavFooter_CreateNote(activeItemBlockApp).createNote();

	} else if (locationCreateNote === "day") {
		const lengthDays = NOTES_DATA[activeItemBlockApp.dataset.month][numberDay].length;

		new AppDay_CreateNote(document.querySelector(".app-day__content-items-notes-day"), activeItemBlockApp)
				.createNote_AppDay(
			NOTES_DATA[activeItemBlockApp.dataset.month][numberDay][lengthDays - 1]
		);

		const notesCount = document.querySelectorAll(".app-day__content-note-day").length;

        const lengthNotesData_Note = NOTES_DATA[activeItemBlockApp.dataset.month][numberDay].length;
        if (notesCount > 1) {
            NOTES_DATA[activeItemBlockApp.dataset.month][numberDay][lengthNotesData_Note - 1]["note"]
                                                            .push({"counter": notesCount - 1});
        };
	};

	add_DeleteActiveClass_BtnNotice();
};

export const checkDuplicate_Note_NOTES_DATA = (subject, content, editMode) => {
    /* Проверяет заметку на дубликат.  */

    let currentMonthIndex = ARR_MONTHS.indexOf(ARR_MONTHS[DATE.getMonth()]);

    for (let days in NOTES_DATA[ARR_MONTHS[currentMonthIndex]]) {
        for (let note in NOTES_DATA[ARR_MONTHS[currentMonthIndex]][days]) {

            if (editMode) {
                if ( editMode[0] == NOTES_DATA[ARR_MONTHS[currentMonthIndex]][days][note]["note"][0]["subject"] && 
                     editMode[1] == NOTES_DATA[ARR_MONTHS[currentMonthIndex]][days][note]["note"][1]["content"] ) {
                    continue;
                };
            };

            if ( subject == NOTES_DATA[ARR_MONTHS[currentMonthIndex]][days][note]["note"][0]["subject"] &&
                 content == NOTES_DATA[ARR_MONTHS[currentMonthIndex]][days][note]["note"][1]["content"] ) {

                return true;
            };
        };
    };
};

export const createBlock_DuplicateNoteWarning = () => {
    /* Создаёт блок с предупреждением, что такая заметка уже существует.  */

    const blockWarning = document.createElement("div");
    blockWarning.setAttribute("class", "diary__form-content-warning");

    blockWarning.insertAdjacentHTML("beforeend", `
        <div class="diary__form-content-warning-content">
            <h2 class="diary__form-content-warning-content-title">You already have such a note!</h2>
        </div>
    `);

    addCss_Block(blockWarning);

    document.querySelector(".diary__form-content").prepend(blockWarning);

    setTimeout(() => {
        blockWarning.style.cssText = `
            visibility: hidden;
            opacity: 0;
        `;
    }, 1800);

    setTimeout(() => {
        blockWarning.remove();
    }, 2000);
}


export class WorkingWithForm {
    /*
	Класс для работы с формой.
    */

	constructor() {
		this.form = document.querySelector(".diary__form");

		this.form_BtnAdd = this.form.querySelector(".diary__form-content-back-btn");
        this.form_Inputs = this.form.querySelectorAll(".diary-form-input");
        this.form_BtnsLevel = this.form.querySelectorAll(".diary__form-content-back-btn-level");

		this.receivedDataFromForm = {
            "subject": "",
            "content": "",
            "importance": ""
        };

        this.pressedFormBtnAdd = () => {
            /* При нажатии добавляет заметку на выбранный день (если конечно она существует).  */

            this.checksForContent_FormInput();
            this.checksIfSeveritySensorInstalled_ForNote();

            const isDuplicate = checkDuplicate_Note_NOTES_DATA(
                this.receivedDataFromForm["subject"],
                this.receivedDataFromForm["content"]
            );
            
            if (isDuplicate) {
                createBlock_DuplicateNoteWarning();
                return;
            };

            const runCode = this.checksFieldsForValues();

            if (!runCode) {
            	return;
            };

            this.form_BtnAdd.removeEventListener("click", this.pressedFormBtnAdd);
            this.form_BtnsLevel.forEach((btnLevel) => {
                btnLevel.removeEventListener("click", this.pressedFormBtnLevel);
            });

            this.closeFormAddNew();

            saveDataNote_NOTES_DATA(this.selectedDay, this.receivedDataFromForm, this.locationCreateNote);
        };

        this.pressedFormBtnLevel = () => {
            /*
            При нажатии кнопки, пользователь выбирает важность занятия своей заметки.
            Значение записывается в словарь "receivedDataFromForm".
            */

            if (event.currentTarget.classList.contains("diary-form-btn-level-active")) {
                event.currentTarget.classList.remove("diary-form-btn-level-active");
                this.receivedDataFromForm["importance"] = "normal";

                return;
            };

            this.form_BtnsLevel.forEach((btnLevel) => {
                if (btnLevel.classList.contains("diary-form-btn-level-active")) {
                    btnLevel.classList.remove("diary-form-btn-level-active");
                };
            });
            
            this.receivedDataFromForm["importance"] = event.currentTarget.dataset.importance;

            event.currentTarget.classList.add("diary-form-btn-level-active");
        }

        this.pressed_FormInactiveZone = () => {
            if (!event.target.closest(".diary__form-content")) {
                this.closeFormAddNew();
                this.form_BtnAdd.removeEventListener("click", this.pressedFormBtnAdd);
            };
        };
	}

	checksForContent_FormInput() {
        /*
        Проверяет наличие тескта в полях для заполнения и добавляет значения в словарь
        "receivedDataFromForm".
        */

        this.form_Inputs.forEach((input) => {
            let typeData_ForDictionary = input.dataset.typeForDictionary;
            this.receivedDataFromForm[typeData_ForDictionary] = input.value;
        });
    }

	// Вспомогательные методы.
	cleansUpDataForm() {
        /* Очищает поля и выбранные данные при закрытии формы.  */

        this.form_Inputs.forEach((input) => {
            input.value = "";
            input.classList.remove("diary-form-input-lack-text");
        });

        this.form_BtnsLevel.forEach((btnLevel) => {
            if (btnLevel.classList.contains("diary-form-btn-level-active")) {
                btnLevel.classList.remove("diary-form-btn-level-active");
            };
        });

        Object.keys(this.receivedDataFromForm).forEach((key) => {
            this.receivedDataFromForm[key] = "";
        });
    }

    closeFormAddNew() {
        /* Закрывает форму и очищает в ней поля.  */

        this.form.removeEventListener("click", this.pressed_FormInactiveZone);

        this.form.classList.remove("diary-form-active");

        setTimeout(() => {
            this.cleansUpDataForm();
        }, TIMEOUT);
    }

	checksIfSeveritySensorInstalled_ForNote() {
        /* Проверяет установлен ли степень важности для заметки.  */

        if (this.receivedDataFromForm["importance"] == false) {
            this.receivedDataFromForm["importance"] = "normal";
        };
    }

	// Отвечают за навешивание событий на блоки и их обработчиков.
    addEventPressed_Blcoks() {
        /* Добавляет события нажатия для блоков.  */

        this.form_BtnAdd.addEventListener("click", this.pressedFormBtnAdd);

        this.form_BtnsLevel.forEach((btnLevel) => {
            btnLevel.addEventListener("click", this.pressedFormBtnLevel);
        });
    }

    checksFieldsForValues() {
    	/* Проверяет наличие значений в полях формы.  */

    	if ( !this.form_Inputs[0].value && !this.form_Inputs[1].value ) {
    		this.form_Inputs[0].classList.add("diary-form-input-lack-text");
    		this.form_Inputs[1].classList.add("diary-form-input-lack-text");

    		setTimeout(() => {
    			this.form_Inputs[0].classList.remove("diary-form-input-lack-text");
    			this.form_Inputs[1].classList.remove("diary-form-input-lack-text");
    		}, 2000)

    		return false;
    	};

    	return true;
    }


	start(selectedDay, locationCreateNote) {
		this.selectedDay = selectedDay;
		this.locationCreateNote = locationCreateNote;

		this.form.classList.add("diary-form-active");

		this.addEventPressed_Blcoks();
		this.form.addEventListener("click", this.pressed_FormInactiveZone, true);
	}
};
	