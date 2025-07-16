(function () {
	if (typeof document === 'undefined') return;

	const lang = document.cookie
		.split('; ')
		.find(row => row.startsWith('lang='))
		?.split('=')[1];

	if (!lang) return;

	const url = new URL(window.location.href);
	const params = url.searchParams;

	if (!params.has('lang')) {
		params.set('lang', lang);
		window.location.replace(url.toString());
	}
})();
