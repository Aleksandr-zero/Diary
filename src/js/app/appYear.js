import {
    NOTES_DATA,
    TIMEOUT,
    DATE,

    CURRENT_APP,
    changeCurrentApp,

    DATE_MONTH_CHANGE,

    ARR_DAYS,
    ARR_MONTHS,

} from "../constants/constants.js";


export class AppYear {
    /*
	Класс реализующий приложение - Year.
    */

	constructor() {
		this.wrapperApp = document.querySelector(".wrapper-app");
	}

	// Вспомогательные методы.

	// Отвечают за добавление событий и их обработчиков>

	// Отвечают за генерацию приложения.
	renderBlockApp() {
		/* Рендерит главный блок и его составные части.  */

		this.wrapperApp.append(this.appYear);
	}

	render() {
		this.appYear = document.createElement("div");
		this.appYear.setAttribute("class", "app app-year");

		this.renderBlockApp();
	}
};
