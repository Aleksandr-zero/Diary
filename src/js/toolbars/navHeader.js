import {
    TIMEOUT,
    DATE,

    CURRENT_APP,
    changeCurrentApp,
    changeMonth,

    ARR_DAYS,
    ARR_MONTHS

} from "../constants/constants.js";

import {
    AppMonth,
    AppMonth_CreateNotes,
} from "../app/appMonth.js";

import { AppDay } from "../app/appDay.js";


export class NavHeader {
    /*
    Класс реализующий функциональность верхней панели инструментов (связано с датами).
    */

    constructor() {
        this.classAppMonth = new AppMonth(false);
        this.classAppMonth_CreateNotes = new AppMonth_CreateNotes();

        this.navHeader = document.querySelector("#nav-header");

        this.btnHeaderDate = this.navHeader.querySelector(".nav-header__content-btn-date > p");

        this.btnHeaderMonthLeft = this.navHeader.querySelector(".nav-header-btn-month-left");
        this.btnHeaderMonthRight = this.navHeader.querySelector(".nav-header-btn-month-right");
        this.contentBtnMonth = this.navHeader.querySelector(".nav-header__content-back-btn-month-content > p");

        this.btnsHeaderSwitchingApp = this.navHeader.querySelectorAll(".nav-header__content-btn-item-link");

        this.dateMonth = DATE.getMonth();
        this.todayIsDay = document.querySelector(".app-month-content-item-current-day");

        this.setsCurrentMonth_BtnHeaderDate();
        this.addEventBtnHeaderMonts();
        this.addEventBtnsHeader_SwitchingApp();
    }

    setsCurrentMonth_BtnHeaderDate() {
        /* Устанавливает текущий месяц на кнопку для показа всех месяцев и для перечисления их.  */

        let strDate = `${ARR_DAYS[DATE.getDay()]}, ${ARR_MONTHS[DATE.getMonth()].substring(0, 3)} ${DATE.getDate()}, ${DATE.getFullYear()}`;
        this.btnHeaderDate.innerHTML = strDate;

        this.contentBtnMonth.innerHTML = ARR_MONTHS[DATE.getMonth()];
    }

    addEventBtnHeaderMonts() {
        /* Навешивает события клика на кнопки смены месяца.  */

        this.btnHeaderMonthLeft.addEventListener("click", () => {
            this.pressedBtnMonth(-1, "left");
        });

        this.btnHeaderMonthRight.addEventListener("click", () => {
            this.pressedBtnMonth(1, "right");
        });
    }

    addEventBtnsHeader_SwitchingApp() {
        /* Добавляет собития при нажатии на кнопки для смены приложение (год, месяц и день).  */

        this.btnsHeaderSwitchingApp.forEach((btnSwitch) => {
            btnSwitch.addEventListener("click", () => { this.pressedBtnSwitchingApp(); })
        })
    }

    pressedBtnSwitchingApp() {
        /* При клике меняет приложение.  */

        const classGenerationAppDay = new AppDay();

        this.btnsHeaderSwitchingApp.forEach((btnSwitch) => {
            if (btnSwitch.classList.contains("nav-header-btn-swicth-active")) {
                btnSwitch.classList.remove("nav-header-btn-swicth-active");
            };
        });

        event.currentTarget.classList.add("nav-header-btn-swicth-active");

        const currentApp = document.querySelector(`.app-${CURRENT_APP}`);
        currentApp.classList.add("switching-app");

        if (CURRENT_APP === "month") {
            setTimeout(() => {

                currentApp.remove();
                classGenerationAppDay.render(this.todayIsDay);
                classGenerationAppDay.blocksBtnsHeaderMonth();

            }, TIMEOUT * 1.25);

        } else if (CURRENT_APP === "day") {
            setTimeout(() => {
                currentApp.remove();

                this.classAppMonth.render();
                this.classAppMonth_CreateNotes.createAllNote_SpecifiedMonth();

                classGenerationAppDay.blocksBtnsHeaderMonth();
                classGenerationAppDay.hides_appearsBlock_SectionDays();

            }, TIMEOUT * 1.25);
        }

        changeCurrentApp(event.currentTarget.dataset.appSwitch);
    }

    pressedBtnMonth(indexMonth, position) {
        /* Меняет месяц.  */

        this.app = document.querySelector(".app-month");

        if (this.dateMonth == 0 && position == "left") {
            this.dateMonth = 12;
        } else if (this.dateMonth == 11 && position == "right") {
            this.dateMonth = -1;
        };
    
        this.contentBtnMonth.classList.add("btn-month-content-active");
    
        // Меняет месяц на кнопке.
        this.dateMonth += indexMonth;

        setTimeout(() => {
            changeMonth(this.dateMonth)
    
            this.contentBtnMonth.innerHTML = ARR_MONTHS[this.dateMonth];
    
            this.contentBtnMonth.classList.remove("btn-month-content-active");

        }, TIMEOUT / 1.25);

        this.changeMonth_App();
    };


    changeMonth_App() {
        /* Заменяет месяц приложения при нажатии на кнопку (btnHeaderMonthLeft; btnHeaderMonthRight).  */

        this.app.classList.add("switching-app");
        
        setTimeout(() => {
            this.app.remove();
            this.classAppMonth.render();

            this.app = document.querySelector(".app-month");

            this.classAppMonth_CreateNotes.createAllNote_SpecifiedMonth();

        }, TIMEOUT * 1.25);
    }
}
