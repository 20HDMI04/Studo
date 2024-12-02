import { LoginInit } from './login.js';
import { mainPageHandler } from './main-p.js';

document.addEventListener('DOMContentLoaded', async ()=>{
    if (window.location.pathname === "/") {
        LoginInit();
    } else if (window.location.pathname === "/main-page") {
        if (localStorage.getItem("token") === null || localStorage.getItem("token") === undefined) {
            window.location.href = "/";
        }
        mainPageHandler();
    }
});