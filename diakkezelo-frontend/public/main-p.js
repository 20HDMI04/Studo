export async function mainPageHandler() {
	const logout_btn = document.getElementById("logout_btn");
	const welcomename = document.getElementById("welcomename");
	const logname = document.getElementById("logname");

	let res;
	let response1;
	try {
        //real http://127.0.0.1:80/resource/v1/mainpage-resource
        //testing http://localhost:3000/mainpage-resource
		const request = new Request("http://127.0.0.1:80/resource/v1/mainpage-resource", {
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token"),
			},
		});
		res = await fetch(request);
		if ((await res.status) == 401) {
            //real http://127.0.0.1:80/auth/v1/refresh
            //testing http://127.0.0.1:3097/refresh
			const requestref = new Request("http://127.0.0.1:80/auth/v1/refresh", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("refresh"),
				},
				body: JSON.stringify({ refreshToken: localStorage.getItem("refresh") }),
			});
			let refresh = await fetch(requestref);
			let responseRefresh = await refresh.json();
			if (responseRefresh.error != null || responseRefresh.error != undefined) {
				localStorage.removeItem("token");
				localStorage.removeItem("refresh");
				window.location.href = "/";
			}
			localStorage.removeItem("token");
			localStorage.setItem("token", responseRefresh.token);
            //real http://127.0.0.1:80/resource/v1/mainpage-resource
            //testing http://localhost:3000/mainpage-resource
			const requestretry = new Request(
				"http://127.0.0.1:80/resource/v1/mainpage-resource",
				{
					headers: {
						"Content-Type": "application/json",
						authorization: localStorage.getItem("token"),
					},
				}
			);
			res = await fetch(requestretry);
            console.log("belépett a retrybe");
		}
		response1 = await res.json();
		Init(response1);
	} catch (error) {
		console.log(error, "error");
	}

	async function Init(response1) {
        console.log(response1);
		welcomename.textContent = await response1.data.Teacher_Name;
		logname.textContent = await response1.data.Teacher_Name;
        if(response1.data.Teacher_Name == null || response1.data.Teacher_Name == undefined) {
            welcomename.textContent = await response1.data.Student_Name;
            logname.textContent = await response1.data.Student_Name;
        }
		logout_btn.addEventListener("click", async () => {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh");
			window.location.href = "/";
		});
	}
}
