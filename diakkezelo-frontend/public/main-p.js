export async function mainPageHandler() {
	const logout_btn = document.getElementById("logout_btn");
	const welcomename = document.getElementById("welcomename");
	const logname = document.getElementById("logname");

	let res;
	let response1;
	try {
		const request = new Request("http://localhost:3000/mainpage-resource", {
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token"),
			},
		});
		res = await fetch(request);
		if ((await res.status) == 401) {
			const requestref = new Request("http://localhost:3097/refresh", {
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
			const requestretry = new Request(
				"http://localhost:3000/mainpage-resource",
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
		logout_btn.addEventListener("click", async () => {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh");
			window.location.href = "/";
		});
	}
}
