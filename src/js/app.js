import { GenerationAppMonth } from "./app/appMonth.js";
import { GenerationComponentNotice } from "./component/componentNotice.js";
import NavHeader from "./toolbars/navHeader.js";
import NavFooter from "./toolbars/navFooter.js";

const appClass = new GenerationAppMonth(true);
appClass.render();

const classGenerationComponentNotice = new GenerationComponentNotice();

const navHeaderClass = new NavHeader();
const navFooterClass = new NavFooter();
