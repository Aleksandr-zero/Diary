import {
	TIMEOUT
} from "../constants/constants.js";


export const addCss_Block = (block) => {
	/* Добавляет стили для плавной анимации поялвния блока.  */

	block.style.cssText = ` 
		visibility: hidden;
		opacity: 0;
	`;

	setTimeout(() => {
		block.style.cssText = ` 
			visibility: visible;
			opacity: 1;
		`;
	}, 0);
};
