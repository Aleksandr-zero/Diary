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
                    transition: all ${TIMEOUT * 4};
                    opacity: 0;
                `;

                this.btnCalendar.classList.remove("nav-btn-calendar-active");

                setTimeout(() => {
                	 this.btnCalendar.style.cssText = `pointer-events: auto`;

                    this.componentCalendar.remove();
                    this.componentCalendar = null;
                }, TIMEOUT);

                document.removeEventListener("click", this.addEventClickInactiveZone_ContentCalendar);
            };
        };
	}

	// Отвечают за добавление событий и их обработчиков.
	pressedBtnSwitchingCalendar(position, indexMonth) {
		/* Переключает комопнент - calendar.  */

		const titleComponent = this.componentCalendar.querySelector(".calendar__content-title");

		if (this.dateMonth == 0 && position === "left") {
            this.dateMonth = 12;
        } else if (this.dateMonth == 11 && position === "right") {
            this.dateMonth = -1;
        };
    
       	titleComponent.classList.add("calendar-title-switching");

        this.dateMonth += indexMonth;

		setTimeout(() => {
			titleComponent.classList.remove("calendar-title-switching");
			titleComponent.innerHTML = ARR_MONTHS[this.dateMonth];
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

	createContentItemsDay() {
		/* Создаёт блок с днями текущего месяца  */

		this.contentItemsDay = document.createElement("div");
		this.contentItemsDay.setAttribute("class", "calendar__content-items");

		this.backContentComponent.append(this.contentItemsDay);
	}

	createContentItemDays() {
		/* Создаёт блок с днями текущего месяца  */

		const numbersDaysCurrentMonth = new Date(2021, this.dateMonth + 1, 0).getDate();
		const currentTitleComponent = this.componentCalendar.querySelector(".calendar__content-title").innerHTML;

		for (let day = 1; day <= numbersDaysCurrentMonth; day++) {
			let classDay = `calendar__content-item`;

			if (day == DATE.getDate() && ARR_MONTHS[DATE.getMonth()] == currentTitleComponent) {
				classDay += " calendar__content-item-active";
			};

			this.contentItemsDay.insertAdjacentHTML("beforeend", `
				<div class="${classDay}">
					<h4 class="calendar__content-item-title">${day}</h4>
				</div>
			`);
		};
	}

	createBtnSwitchingCalendar() {
		/* Создаёт кнопки переключения компонента - calendar.  */

		const backBtnsSwitch = document.createElement("div");
		backBtnsSwitch.setAttribute("class", "calendar__content-back-btn-switch");

		const btnSwitchLeft = document.createElement("a");
		btnSwitchLeft.setAttribute("class", "calendar__content-btn-switch calendar-btn-switch-left");
		btnSwitchLeft.setAttribute("role", "button");
		btnSwitchLeft.insertAdjacentHTML("beforeend", `${ARROW_SWITCHING}`);
		btnSwitchLeft.addEventListener("click", () => { this.pressedBtnSwitchingCalendar("left", -1); });

		const btnSwitchRight = document.createElement("a");
		btnSwitchRight.setAttribute("class", "calendar__content-btn-switch calendar-btn-switch-right");
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
		this.createContentItemsDay();
		this.createContentItemDays();
		this.createBtnSwitchingCalendar();
	}

	render() {
		this.componentCalendar = document.createElement("div");

		this.renderBlockComponent();

		this.btnCalendar.style.cssText = `pointer-events: none`;
		this.btnCalendar.classList.add("nav-btn-calendar-active");
		document.addEventListener("click", this.addEventClickInactiveZone_ContentCalendar);
	}
};
	