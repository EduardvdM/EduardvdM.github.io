// Site behaviour: external links and header parallax. No libraries needed.
(function () {

	// Open external links and PDFs in a new tab, and tell screen reader users.
	// Download links (like the one on the CV page) are left alone so they save the file instead.
	document.querySelectorAll('a[href]:not([download])').forEach(function (link) {
		var href = link.getAttribute('href');
		if (!/^https?:/i.test(href) && !/\.pdf$/i.test(href)) return;
		link.setAttribute('target', '_blank');
		link.setAttribute('rel', 'noopener noreferrer');
		var label = link.getAttribute('aria-label');
		if (label) {
			link.setAttribute('aria-label', label + ' (opens in a new tab)');
		} else {
			var note = document.createElement('span');
			note.className = 'sr-only';
			note.textContent = ' (opens in a new tab)';
			link.appendChild(note);
		}
	});

	// Gentle parallax on the header image, skipped for visitors who prefer reduced motion
	var head = document.querySelector('.parallax');
	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (head && !reduceMotion) {
		var ticking = false;
		window.addEventListener('scroll', function () {
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(function () {
				var width = window.innerWidth;
				var speed = width < 375 ? 10 : width < 768 ? 3.2 : width < 992 ? 1.8 : 0.8;
				head.style.backgroundPosition = 'center calc(var(--head-pos-y) - ' + (window.pageYOffset / speed) + 'px)';
				ticking = false;
			});
		}, { passive: true });
	}

	// Fade section titles, theme cards, papers and experience entries in as they scroll into view; items
	// that appear together follow one another slightly. Skipped for reduced motion, and each item animates once.
	var revealItems = document.querySelectorAll('#main .section-title, .to-top, .theme-card, .about-inner, .research-list > li, .experience-list > li, .data-card, .resource-card, .stat-tile, .fieldwork-card, .timeline > li, .gallery, .card-group, .pebble-game, .fieldwork-finding, .fieldwork-design, .fieldwork-cta, .home-fieldwork');
	if (revealItems.length && 'IntersectionObserver' in window && !reduceMotion) {
		var observer = new IntersectionObserver(function (entries) {
			var shown = 0;
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.style.setProperty('--reveal-delay', Math.min(shown, 5) * 0.08 + 's');
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
				shown++;
			});
		}, { rootMargin: '0px 0px -40px 0px' });
		revealItems.forEach(function (item) {
			item.classList.add('reveal');
			observer.observe(item);
		});
	}

	// Enlarged view of a photo or card, shared by the gallery and the card sections
	var lightbox = null;
	function getLightbox() {
		if (lightbox) return lightbox;
		lightbox = document.createElement('dialog');
		lightbox.className = 'lightbox';
		lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">' +
			'<svg class="icon" aria-hidden="true" focusable="false"><use href="/assets/images/icons.svg#icon-xmark"></use></svg></button>' +
			'<figure><img alt=""><figcaption></figcaption></figure>';
		document.body.appendChild(lightbox);
		lightbox.querySelector('.lightbox-close').addEventListener('click', function () { lightbox.close(); });
		lightbox.addEventListener('click', function (event) { if (event.target === lightbox) lightbox.close(); });
		return lightbox;
	}
	function openLightbox(src, alt, caption) {
		var box = getLightbox();
		box.querySelector('img').src = src;
		box.querySelector('img').alt = alt || '';
		box.querySelector('figcaption').textContent = caption || '';
		box.showModal();
	}

	// Fieldwork gallery: three photos at a time (two on tablets, one on phones) that move on every few seconds.
	// Arrows step through and the middle button pauses; hovering or focusing inside also pauses, and nothing moves
	// on its own for visitors who prefer reduced motion. Without JavaScript the row simply scrolls sideways.
	document.querySelectorAll('.gallery').forEach(function (gallery) {
		var track = gallery.querySelector('.gallery-track');
		var slides = track.children;
		var toggle = gallery.querySelector('.gallery-toggle');
		var index = 0;
		var timer = null;
		var paused = reduceMotion;
		var holding = false;

		var dialog = getLightbox();

		gallery.classList.add('gallery--js');
		gallery.querySelector('.gallery-controls').hidden = false;

		function perView() {
			return parseInt(getComputedStyle(gallery).getPropertyValue('--per-view'), 10) || 1;
		}
		function show(i) {
			var last = Math.max(0, slides.length - perView());
			index = i > last ? 0 : (i < 0 ? last : i);
			track.style.transform = 'translateX(' + (-index * 100 / perView()) + '%)';
			for (var s = 0; s < slides.length; s++) {
				slides[s].inert = s < index || s >= index + perView();
			}
		}
		function schedule() {
			clearInterval(timer);
			if (!paused && !holding && !document.hidden && !dialog.open) {
				timer = setInterval(function () { show(index + 1); }, 5000);
			}
		}
		function setPaused(value) {
			paused = value;
			toggle.classList.toggle('is-paused', paused);
			toggle.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
			schedule();
		}

		gallery.querySelector('.gallery-prev').addEventListener('click', function () { show(index - 1); schedule(); });
		gallery.querySelector('.gallery-next').addEventListener('click', function () { show(index + 1); schedule(); });
		toggle.addEventListener('click', function () { setPaused(!paused); });
		gallery.addEventListener('mouseenter', function () { holding = true; schedule(); });
		gallery.addEventListener('mouseleave', function () { holding = false; schedule(); });
		gallery.addEventListener('focusin', function () { holding = true; schedule(); });
		gallery.addEventListener('focusout', function (event) {
			if (!gallery.contains(event.relatedTarget)) { holding = false; schedule(); }
		});
		document.addEventListener('visibilitychange', schedule);
		window.addEventListener('resize', function () { show(index); });

		// Swipe on touch screens
		var touchX = null;
		track.addEventListener('touchstart', function (event) { touchX = event.touches[0].clientX; }, { passive: true });
		track.addEventListener('touchend', function (event) {
			if (touchX === null) return;
			var moved = event.changedTouches[0].clientX - touchX;
			if (Math.abs(moved) > 40) { show(index + (moved < 0 ? 1 : -1)); schedule(); }
			touchX = null;
		});

		gallery.addEventListener('click', function (event) {
			var button = event.target.closest('.gallery-open');
			if (!button) return;
			openLightbox(button.getAttribute('data-src'), button.getAttribute('data-alt'), button.getAttribute('data-caption'));
			schedule();
		});
		dialog.addEventListener('close', schedule);

		show(0);
		setPaused(paused);
	});

	// Vignette cards: switch between the English and Kimeru versions
	document.querySelectorAll('.card-lang').forEach(function (section) {
		var toggle = section.querySelector('.lang-toggle');
		var buttons = toggle.querySelectorAll('button');
		toggle.hidden = false;
		buttons.forEach(function (button) {
			button.addEventListener('click', function () {
				section.setAttribute('data-lang', button.getAttribute('data-lang'));
				buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
			});
		});
	});

	// Cards and photos outside the gallery open in the enlarged view, in the language currently shown
	document.addEventListener('click', function (event) {
		var button = event.target.closest('.card-open');
		if (!button) return;
		var section = button.closest('[data-lang]');
		var lang = section ? section.getAttribute('data-lang') : 'en';
		openLightbox(button.getAttribute('data-src-' + lang) || button.getAttribute('data-src-en'),
			button.getAttribute('data-alt'), button.getAttribute('data-caption'));
	});

})();
