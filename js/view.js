import { handler_click } from "../main";
let V = {};

let all = document.querySelector(".all");
all.addEventListener("change", handler_click);

export { V };