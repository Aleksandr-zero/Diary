export const TIMEOUT = 200;

export let CURRENT_APP = "month";
export const changeCurrentApp = (app) => {
	CURRENT_APP = app;
};

export let CURRENT_VISUAL_CONTENT_DAY_NOTES = "pillar";
export const changeCurrentVisualDayNotes = (visual) => {
	CURRENT_VISUAL_CONTENT_DAY_NOTES = visual;
};

export const DATE = new Date();

export let DATE_MONTH_CHANGE = DATE.getMonth();
export const changeMonth = (newIndexDate) => {
	DATE_MONTH_CHANGE = newIndexDate;
};


export const ARR_DAYS = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
];

export const ARR_MONTHS = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];


// Данные о заметках.
export const NOTES_DATA = {
	"January": 	[],
	"February": [],
	"March": 	[],
	"April": 	[],
	"May": 		[],
	"June": 	[],
	"July": 	[],
	"August": 	[],
	"September":[],
	"October": 	[],
	"November": [],
	"December": [],
};

export const ARROW_SWITCHING = `
	<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M6.70998 0.70998C6.31998 0.31998 5.68998 0.31998 5.29998
		0.70998L0.70998 5.29998C0.31998 5.68998 0.31998 6.31998 0.70998 6.70998L5.29998 11.3C5.68998 11.69 6.31998
		11.69 6.70998 11.3C7.09998 10.91 7.09998 10.28 6.70998 9.88998L2.82998 5.99998L6.70998 2.11998C7.09998
		1.72998 7.08998 1.08998 6.70998 0.70998Z" fill="#A3A3A3"/>
	</svg>
`

export const ARROW_ICON_APP_DAY = `
	<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
	width="18px" height="18px" viewBox="0 0 512 512">
		<g transform="translate(0,512) scale(0.1,-0.1)"
			fill="#666666">
			<path d="M2058 4727 c-31 -13 -74 -38 -95 -55 -77 -62 -1882 -1878 -1907 -1920 -38 -61 -60 -154 -52 -225 14
			-132 -40 -73 1014 -1129 795 -796 975-971 1020 -994 78 -39 202 -46 285 -14 89 34 153 90 191 169 28 60 31
			75 31 161 0 165 16 144 -562 729 -274 278 -534 536 -579 575 -45 40 -118 91 -167 116 l-86 45 1837 5 1837 5
			57 23 c81 33 160 108 200 190 30 60 33 75 33 152 -1 70 -5 95 -27 142 -35 76 -99 143 -173 181 l-60 32 -1855 5 -1855 5 95 50
			95 49 576 576 c665 664 634 624 634 795 0 89 -3 106 -28 156 -15 31 -50 78 -77 103 -72 68 -126 89 -235 93 -77 3 -98 0 -147 -20z"/>
		</g>
	</svg>
`;

export const DELETE_ICON_APP_DAY = `
	<svg viewBox="0 0 32 32" fill="#ffffff" height=27px width=24px xmlns="http://www.w3.org/2000/svg">
		<g data-name="Layer 2" id="Layer_2">
			<path d="M20,29H12a5,5,0,0,1-5-5V12a1,1,0,0,1,2,0V24a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V12a1,1,0,0,1,2,0V24A5,5,0,0,1,20,29Z"/>
			<g id="animate-btn-delete">
				<path d="M26,9H6A1,1,0,0,1,6,7H26a1,1,0,0,1,0,2Z"/>
				<path d="M20,9H12a1,1,0,0,1-1-1V6a3,3,0,0,1,3-3h4a3,3,0,0,1,3,3V8A1,1,0,0,1,20,9ZM13,7h6V6a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1Z"/>
			</g>
			<path d="M14,23a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v7A1,1,0,0,1,14,23Z"/>
			<path d="M18,23a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v7A1,1,0,0,1,18,23Z"/>
		</g>
	</svg>
`;

export const ADD_NOTE_ICON_APP_DAY = `
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M16 12H8" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M12 8V16" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M18 20H6C4.895 20 4 19.105 4 18V6C4 4.895 4.895 4 6 4H18C19.105 4 20 4.895 20 6V18C20 19.105 
		19.105 20 18 20Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
`;
