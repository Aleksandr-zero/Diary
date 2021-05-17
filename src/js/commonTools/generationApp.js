export const hides_appearsBlock_SectionDays = () => {
	/* Скрывает блок - sectionDay.  */

	const currentApp = document.querySelector(".app-day");
	const sectionDays = document.querySelector(".section-days");

	if (currentApp || document.querySelector(".app-year")) {
		sectionDays.classList.add("section-days-pass");
		return;
	};

	sectionDays.classList.remove("section-days-pass");
}


export const blocksBtnsHeaderMonth = () => {
	/* Блокирует кнопки переключатели месяцев.  */

	const navHeader_BtnMonth = document.querySelectorAll(".nav-header__content-btn-month");
	const currentApp = document.querySelector(".app");

	if (!currentApp.classList.contains("app-month") || currentApp.classList.contains("switching-app")) {
		navHeader_BtnMonth.forEach((btnMonth) => {
			btnMonth.classList.add("nav-header-content-btn-month-pass");
		});
	} else {
		navHeader_BtnMonth.forEach((btnMonth) => {
			btnMonth.classList.remove("nav-header-content-btn-month-pass");
		});
	};
}