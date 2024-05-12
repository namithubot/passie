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
