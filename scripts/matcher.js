document.addEventListener('password-recorded', async (e) => {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(e.detail.password));
	const resultBytes = [...new Uint8Array(digest)];
    const hashedPass = resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
	const storedPass = localStorage.getItem('password');
	document.dispatchEvent(new CustomEvent('match-result', { result: hashedPass === storedPass }));
	console.log(hashedPass === storedPass);
	if (hashedPass === storedPass) {
		console.log('correct password');
		document.querySelector('a-scene').exitVR();
		location.href = "/";
	} else {
		console.log('wrong password');
	}
});

document.addEventListener('password-recorded-spatial', async (e) => {
	const storedPass = localStorage.getItem('password_spatial');
	const dataPoints = storedPass.split(',');
	const enteredDataPoints = e.detail.password.split(',');
	let matched = false;
	if (dataPoints.length === enteredDataPoints.length) {
		if(dataPoints.every((dp, i) => {
			const [ hand, intensity, angle ] = dp.split('|');
			const [ ehand, eintensity, eangle ] = enteredDataPoints[i].split('|');
			return ehand === hand
				&& eintensity === intensity
				&& (parseFloat(eangle) - parseFloat(angle) < 0.2);
		})) {
			matched = true;
		}
	}
	document.dispatchEvent(new CustomEvent('match-result', { result: matched }));
	console.log(matched);
	if (matched) {
		console.log('correct password');
		document.querySelector('a-scene').exitVR();
		location.href = "/";
	} else {
		console.log('wrong password');
	}
});
