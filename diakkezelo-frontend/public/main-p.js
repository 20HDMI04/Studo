export async function mainPageHandler(){
    const logout_btn = document.getElementById('logout_btn');
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    const welcomename = document.getElementById('welcomename');
    const logname = document.getElementById('logname');
    const request = new Request("http://localhost:3000/mainpage-resource", {
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        }
    });
    let res = await fetch(request);
    let response1 = await res.json();
    welcomename.textContent = response1.data.Student_Name;
    logname.textContent = response1.data.Student_Name;
    logout_btn.addEventListener('click', async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href = "/";
    });
}