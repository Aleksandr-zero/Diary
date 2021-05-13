import {
	TIMEOUT,

	NOTES_DATA,
} from "../constants/constants.js";

import { add_DeleteActiveClass_BtnNotice } from "../component/componentNotice.js";

import { NavFooter_CreateNote } from "./navFooter.js";

import { GenerationAppDay_CreateNote } from "../app/appDay.js";


export const saveDataNote_NOTES_DATA = (activeItemBlockApp, receivedDataFromForm, locationCreateNote) => {
	/* Сохраняет полученные данные о заметке в обьект.  */

	const numberDay = +(activeItemBlockApp.querySelector(".app-month__content-item-day").innerHTML);

	if (NOTES_DATA[activeItemBlockApp.dataset.month][numberDay] == undefined) {
		NOTES_DATA[activeItemBlockApp.dataset.month][numberDay] = [];
	};

	let time;

	if (new Date().getMinutes() <= 9) {
		time = `0${new Date().getMinutes()}`;
	} else {
		time = `${new Date().getHours()}:${new Date().getMinutes()}`;
	};

	NOTES_DATA[activeItemBlockApp.dataset.month][numberDay].push({
		note: [
			{"subject": `${receivedDataFromForm['subject']}`},
			{"content": `${receivedDataFromForm['content']}`},
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

		new GenerationAppDay_CreateNote(document.querySelector(".app-day__content-items-notes-day"), activeItemBlockApp)
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


export class WorkingWithForm {
    /*
	Класс для работы с формой.
    */

	constructor(selectedDay, locationCreateNote) {
		this.form = document.querySelector(".calendar__form");

		this.form_BtnAdd = this.form.querySelector(".calendar__form-content-back-btn");
        this.form_Inputs = this.form.querySelectorAll(".calendar-form-input");
        this.form_BtnsLevel = this.form.querySelectorAll(".calendar__form-content-back-btn-level");

		this.receivedDataFromForm = {
            "subject": "",
            "content": "",
            "importance": ""
        };

        this.pressedFormBtnAdd = () => {
            /* При нажатии добавляет заметку на выбранный день (если конечно она существует).  */

            this.form_BtnAdd.removeEventListener("click", this.pressedFormBtnAdd);

            this.closeFormAddNew();

            this.checksForContent_FormInput();
            this.checksIfSeveritySensorInstalled_ForNote();

            saveDataNote_NOTES_DATA(selectedDay, this.receivedDataFromForm, locationCreateNote);
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
            input.classList.remove("calendar-form-input-lack-text");
        });

        this.form_BtnsLevel.forEach((btnLevel) => {
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

        this.form.classList.remove("calendar-form-active");

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
            btnLevel.addEventListener("click", () => { this.pressedFormBtnLevel(); })
        });
    }

    addEventPressed_FormInactiveZone() {
        /* Добавления события на форму - при нажатии на неактивную зону, форма закрывается.  */

        this.form.addEventListener("click", (event) => {
            if (!event.target.closest(".calendar__form-content")) {
                this.closeFormAddNew();
            };
        });
    }

    pressedFormBtnLevel() {
        /*
        При нажатии кнопки, пользователь выбирает важность занятия своей заметки.
        Значение записывается в словарь "receivedDataFromForm".
        */

        this.form_BtnsLevel.forEach((btnLevel) => {
            if (btnLevel.classList.contains("calendar-form-btn-level-active")) {
                btnLevel.classList.remove("calendar-form-btn-level-active");
            };
        });
        
        this.receivedDataFromForm["importance"] = event.currentTarget.dataset.importance;

        event.currentTarget.classList.add("calendar-form-btn-level-active");
    }


	start() {
		this.form.classList.add("calendar-form-active");

		this.addEventPressed_Blcoks();
		this.addEventPressed_FormInactiveZone();
	}
};
	