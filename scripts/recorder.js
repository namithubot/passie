document.addEventListener('password-recorded', async (e) => {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(e.detail.password));
	const resultBytes = [...new Uint8Array(digest)];
    const hashedPass = resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
	localStorage.setItem('password', hashedPass);
	document.querySelector('a-scene').exitVR();
	location.href = "/";
});