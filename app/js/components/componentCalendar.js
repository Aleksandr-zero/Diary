import {
    TIMEOUT,
    DATE,

    ARR_DAYS,
    ARR_MONTHS,

    ARROW_SWITCHING

} from "../constants/constants.js";

import { addCss_Block } from "../commonTools/generationComponent.js";


export class ComponentCalendar {
    /*
	Класс реализующий компонент - Calendar
    */

	constructor() {
		this.backBtnCalendar = document.querySelector(".nav-header__content-back-btn-calendar");
		this.btnCalendar = document.querySelector(".nav-header__content-btn-calendar");

		this.dateMonth = DATE.getMonth();

		this.addEventClickInactiveZone_ContentCalendar = () => {
            /* При клике на неактивную зону удаляет компонент.  */

            if ( !event.target.closest(".calendar") && !event.target.closest(".nav-header__content-back-btn-calendar") ) {

                this.componentCalendar.style.cssText = `
                    opacity: 0;
                `;

                this.btnCalendar.classList.remove("nav-btn-calendar-active");

                setTimeout(() => {

                    this.componentCalendar.remove();
                    this.componentCalendar = null;
                }, TIMEOUT);

                document.removeEventListener("click", this.addEventClickInactiveZone_ContentCalendar);
            };
        };
	}

	// Вспомогательные методы.
	getTitle_FirstDay() {
		/* Получает индекс первого дня в указанном месяце.  */
		let titleFirstDay = ARR_DAYS[new Date(DATE.getFullYear(), this.dateMonth, 0).getDay() + 1];

		if (!titleFirstDay) {
			titleFirstDay = ARR_DAYS[0];
		};

		return ARR_DAYS.indexOf(titleFirstDay);
	} 

	// Отвечают за добавление событий и их обработчиков.
	pressedBtnSwitchingCalendar(position, indexMonth) {
		/* Переключает комопнент - calendar.  */

		const titleComponent = this.componentCalendar.querySelector(".calendar__content-title");
		const sectionDaysCompoentn = this.componentCalendar.querySelector(".calendar__content-section-days");

		if (this.dateMonth == 0 && position === "left") {
            this.dateMonth = 12;
        } else if (this.dateMonth == 11 && position === "right") {
            this.dateMonth = -1;
        };
    
       	titleComponent.classList.add("calendar-title_section-days-switching");
       	sectionDaysCompoentn.classList.add("calendar-title_section-days-switching");

        this.dateMonth += indexMonth;

		setTimeout(() => {
			titleComponent.classList.remove("calendar-title_section-days-switching");
			titleComponent.innerHTML = ARR_MONTHS[this.dateMonth];

			sectionDaysCompoentn.classList.remove("calendar-title_section-days-switching");
		}, TIMEOUT);

		this.changeComponentCalendar();
	}

	changeComponentCalendar() {
		/* Изменяет месяц на прошлый или следующий.  */

		this.contentItemsDay.classList.add("calendar-items-day-switching");

		setTimeout(() => {
			this.contentItemsDay.remove();

			this.createContentItemsDay();
			this.createContentItemDays();
		}, TIMEOUT);
	}


	// Отвечают за генерацию компонент.
	createBackContentComponent() {
		/* Генерирует главный блок компонента.  */

		this.componentCalendar.setAttribute("class", "calendar");
		addCss_Block(
            this.componentCalendar
        );

		this.backContentComponent = document.createElement("div");
		this.backContentComponent.setAttribute("class", "calendar__content");

		this.componentCalendar.append(this.backContentComponent)

		this.backBtnCalendar.append(this.componentCalendar);
	}

	createComponentTitle() {
		/* Создаёт заголовок компонента.  */

		this.backContentComponent.insertAdjacentHTML("beforeend", `
			<h4 class="calendar__content-title">${ARR_MONTHS[DATE.getMonth()]}</h4>
		`);
	}

	createComponentSetcionDays() {
		/* Создаёт секцию дней.  */

		const blockSectionDays = document.createElement("div");
		blockSectionDays.setAttribute("class", "calendar__content-section-days flex");

		ARR_DAYS.forEach((day) => {
			blockSectionDays.insertAdjacentHTML("beforeend", ` 
				<h2 class="calendar__content-section-days-title">${day.substring(0, 3)}</h2>
			`);
		});

		this.backContentComponent.append(blockSectionDays);
	}

	createContentItemsDay() {
		/* Создаёт блок с днями текущего месяца  */

		this.contentItemsDay = document.createElement("div");
		this.contentItemsDay.setAttribute("class", "calendar__content-items");

		this.backContentComponent.append(this.contentItemsDay);
	}

	createContentItemDays() {
		/* Создаёт блок с днями текущего месяца  */

		const indexDayOnWhichMonthBegins = this.getTitle_FirstDay();
		let indexDay = 0;
		let indexDayWrite = 1;

		const numbersDaysCurrentMonth = new Date(2021, this.dateMonth + 1, 0).getDate();
		const currentTitleComponent = this.componentCalendar.querySelector(".calendar__content-title").innerHTML;

		for (let day = 1; day <= numbersDaysCurrentMonth + indexDayOnWhichMonthBegins; day++) {

			if (indexDayOnWhichMonthBegins > indexDay) {
				this.contentItemsDay.insertAdjacentHTML("beforeend", `
					<div class="calendar__content-item flex calendar-item-pass">
						<h4 class="calendar__content-item-title">Text</h4>
					</div>
				`);

				indexDay++;
				continue;
			};

			let classDay = `calendar__content-item flex`;

			if (indexDayWrite == DATE.getDate() && ARR_MONTHS[DATE.getMonth()] == currentTitleComponent) {
				classDay += " calendar-item-active";
			};

			this.contentItemsDay.insertAdjacentHTML("beforeend", `
				<div class="${classDay}">
					<h4 class="calendar__content-item-title">${indexDayWrite}</h4>
				</div>
			`);

			indexDayWrite++;
		};
	}

	createBtnSwitchingCalendar() {
		/* Создаёт кнопки переключения компонента - calendar.  */

		const backBtnsSwitch = document.createElement("div");
		backBtnsSwitch.setAttribute("class", "calendar__content-back-btn-switch flex");

		const btnSwitchLeft = document.createElement("a");
		btnSwitchLeft.setAttribute("class", "calendar__content-btn-switch flex calendar-btn-switch-left");
		btnSwitchLeft.setAttribute("role", "button");
		btnSwitchLeft.insertAdjacentHTML("beforeend", `${ARROW_SWITCHING}`);
		btnSwitchLeft.addEventListener("click", () => { this.pressedBtnSwitchingCalendar("left", -1); });

		const btnSwitchRight = document.createElement("a");
		btnSwitchRight.setAttribute("class", "calendar__content-btn-switch flex calendar-btn-switch-right");
		btnSwitchRight.setAttribute("role", "button");
		btnSwitchRight.insertAdjacentHTML("beforeend", `${ARROW_SWITCHING}`);
		btnSwitchRight.addEventListener("click", () => { this.pressedBtnSwitchingCalendar("right", 1); });

		backBtnsSwitch.append(btnSwitchLeft, btnSwitchRight)

		this.backContentComponent.append(backBtnsSwitch);
	}

	renderBlockComponent() {
		/* Рендерит главный блок и его составные части  */

		this.createBackContentComponent();
		this.createComponentTitle();
		this.createComponentSetcionDays();
		this.createContentItemsDay();
		this.createContentItemDays();
		this.createBtnSwitchingCalendar();
	}

	render() {
		this.componentCalendar = document.createElement("div");

		this.renderBlockComponent();

		this.btnCalendar.classList.add("nav-btn-calendar-active");
		document.addEventListener("click", this.addEventClickInactiveZone_ContentCalendar);
	}
};
