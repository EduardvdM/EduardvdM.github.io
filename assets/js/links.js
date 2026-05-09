document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('a[href]').forEach(function (link) {
		var href = link.getAttribute('href');
		if (href && (href.startsWith('http') || href.toLowerCase().endsWith('.pdf'))) {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		}
	});
});
