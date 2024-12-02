import { styler } from '../styler.js';
export function LoginInit() {
const mode = Object.freeze({
    STUDENT: 'student',
    TEACHER: 'teacher'
});

let currentMode = mode.STUDENT;
const signin_btn = document.getElementById('signin');
function init() {
    styler();
    document.getElementById("set1").addEventListener("click", function() {
        currentMode = mode.STUDENT;
        address.placeholder = "Om ID";
        address.type = "number";
    });
    document.getElementById("set2").addEventListener("click", function() {
        const address = document.getElementById('address');
        currentMode = mode.TEACHER;
        address.placeholder = "Teacher ID";
        address.type = "text";
    });
}

async function logIn() {
    const data_forlogin = {
        user : String(document.getElementById('address').value),
        password : String(document.getElementById('password').value),
        mode : currentMode
    }
    if(currentMode === mode.TEACHER) {
        if(!data_forlogin.user.includes("@")) {
            console.log("You are unauthorized to login as a teacher");
            return;
        }
    }
    //http://127.0.0.1:80/auth/v1/login
    const request = new Request("http://127.0.0.1:3097/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_forlogin),
        Accept: 'application/json'
      });
      
    let res = await fetch(request);
    let response1 = await res.json();
    console.log(response1);
    if(response1.error == null || response1.error == undefined) {
        localStorage.setItem("token", response1.token);
        localStorage.setItem("refresh", response1.refresh);
        window.location.href = "/main-page";
        }
    }
    init();
    signin_btn.addEventListener('click', logIn);
}
