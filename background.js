async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

const addWebRequestListener = (url) => {
	chrome.webRequest.onCompleted.addListener(
		function (details) {
			console.log(`New request from ${details.initiator}`);
			console.log(details);
		},
		// { urls: ['<all_urls>'] },
		{ urls: [`*://${url}/*`] },
		['responseHeaders']
	);
};

const onChangeTab = async (activeInfo) => {
	const { id, url, title, favIconUrl } = await getCurrentTab();
	if (!url) return; // Early return if url is undefined (happens on opening a new tab)
	const { hostname } = new URL(url);

	console.log('Tab changed');
	console.log(`Current url: ${url}`);
	console.log(`Hostname: ${hostname}`);
	if (hostname) {
		addWebRequestListener(hostname);
	}
};

chrome.tabs.onActivated.addListener((activeInfo) => {
	onChangeTab(activeInfo);
});
