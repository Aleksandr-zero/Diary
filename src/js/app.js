import { AppMonth } from "./app/appMonth.js";
import { ComponentNotice } from "./component/componentNotice.js";
import { ComponentSearch } from "./component/componentSearch.js";
import { NavHeader } from "./toolbars/navHeader.js";
import { NavFooter } from "./toolbars/navFooter.js";

const appClass = new AppMonth(true);
appClass.render();

const classComponentNotice = new ComponentNotice();
const classComponentSearch = new ComponentSearch();

const navHeaderClass = new NavHeader();
const navFooterClass = new NavFooter();
