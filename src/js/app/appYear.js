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
	getTitle_LastDay_FirstDay(indexMonth) {
		/* Получает индекс первого дня в указанном месяце.  */
		let titleFirstDay = ARR_DAYS[new Date(DATE.getFullYear(), indexMonth, 0).getDay() + 1];

		if (!titleFirstDay) {
			titleFirstDay = ARR_DAYS[0];
		};

		return ARR_DAYS.indexOf(titleFirstDay);
	}

	measuresHeightApp_addHeightWrapperApp() {
		this.wrapperApp.style.height = `${this.appYear.offsetHeight}px`;
	}

	// Отвечают за генерацию приложения.
	createContentAppYear() {
		/* Создаёт контент для приложения.  */

		this.appYearContent = document.createElement("div");
		this.appYearContent.setAttribute("class", "app-year__content");

		this.appYear.append(this.appYearContent);
	}

	createTitleAppYear() {
		/* Создаёт заголовок для приложения.  */

		this.appYearContent.insertAdjacentHTML("beforeend", `
			<h2 class="app-year__content-title">${DATE.getFullYear()}</h2>
		`);
	}

	createBlockMonth() {
		/* Создаёт блок месяц.  */

		const blockMonthItems = document.createElement("div");
		blockMonthItems.setAttribute("class", "app-year__content-items")

		ARR_MONTHS.forEach((month) => {
			const blockMonth = document.createElement("div");
			blockMonth.setAttribute("class", "app-year__content-item");

			blockMonth.insertAdjacentHTML("beforeend", `
				<h2 class="app-year__content-item-title">${month}</h2>
			`);

			this.createBlockSectionDaysMonth(
				this.block = blockMonth
			);

			this.createItemsDays(
				this.block = blockMonth,
				this.indexMonth = ARR_MONTHS.indexOf(month)
			);

			blockMonthItems.append(blockMonth);
		});

		this.appYearContent.append(blockMonthItems);
	}

	createBlockSectionDaysMonth(block) {
		/* Создаёт секцию дней для месяца.  */

		const sectionDaysBack = document.createElement("div");
		sectionDaysBack.setAttribute("class", "app-year__content-item-section-days");

		ARR_DAYS.forEach((day) => {
			sectionDaysBack.insertAdjacentHTML("beforeend", `
				<h4 class="app-year__content-item-section-day">${day.substring(0, 3)}</h4>
			`);
		});

		block.append(sectionDaysBack);
	}

	createItemsDays(block, indexMonth) {
		/* Создаёт дни для месяца.  */

		const indexDayOnWhichMonthBegins = this.getTitle_LastDay_FirstDay(
			this.indexMonth = indexMonth
		);

		let indexDay = 0;
		let indexDayWrite = 1;
		const numbersDaysCurrentMonth = new Date(2021, indexMonth + 1, 0).getDate();

		const itemsDays = document.createElement("div");
		itemsDays.setAttribute("class", "app-year__content-item-days");

		for (let day = 0; day < numbersDaysCurrentMonth + indexDayOnWhichMonthBegins; day++) {

			if (indexDayOnWhichMonthBegins > indexDay) {
				itemsDays.insertAdjacentHTML("beforeend", `
					<div class="app-year__content-item-day app-year-day-pass">
						<h4 class="app-year__content-item-day-title">Text</h4>
					</div>
				`);

				indexDay++;
				continue;
			};

			itemsDays.insertAdjacentHTML("beforeend", `
				<div class="app-year__content-item-day">
					<h4 class="app-year__content-item-day-title">${indexDayWrite}</h4>
				</div>
			`);

			indexDayWrite++;
		};

		block.append(itemsDays);
	}


	renderBlockApp() {
		/* Рендерит главный блок и его составные части.  */

		this.wrapperApp.append(this.appYear);

		this.createContentAppYear();

		this.createTitleAppYear();
		this.createBlockMonth();
	}

	render() {
		this.appYear = document.createElement("div");
		this.appYear.setAttribute("class", "app app-year");

		this.renderBlockApp();
		this.measuresHeightApp_addHeightWrapperApp();
	}
};
