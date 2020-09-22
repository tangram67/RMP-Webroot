// Lazy image loader
// https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video
function setLazyImageLoader() {
	// Start on DOM fully loaded...
	var lazyLoaderActive = false;
	var lazyImages = [].slice.call(document.querySelectorAll("img.lazy-loader"));
	if (lazyImages.length > 0) {
		if ("IntersectionObserver" in window) {
			// Using intersection observer
			console.log('[lazyloader.js] Using intersection observer for ' + lazyImages.length.toString() + ' elements.');
			var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						var lazyImage = entry.target;
						lazyImage.src = lazyImage.dataset.src;
						// lazyImage.srcset = lazyImage.dataset.srcset;
						lazyImage.classList.remove("lazy-loader");
						lazyImageObserver.unobserve(lazyImage);
					}
				});
			});

			lazyImages.forEach(function(lazyImage) {
				lazyImageObserver.observe(lazyImage);
			});
		} else {
			// Using event handlers (the most compatible way)
			console.log('[lazyloader.js] Using event handlers for ' + lazyImages.length.toString() + ' elements.');
			function lazyImageLoader() {
				if (lazyLoaderActive === false) {
					lazyLoaderActive = true;

					setTimeout(function() {
						lazyImages.forEach(function(lazyImage) {
							if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
								lazyImage.src = lazyImage.dataset.src;
								// lazyImage.srcset = lazyImage.dataset.srcset;
								lazyImage.classList.remove("lazy-loader");

								lazyImages = lazyImages.filter(function(image) {
									return image !== lazyImage;
								});

								if (lazyImages.length === 0) {
									document.removeEventListener("scroll", lazyImageLoader);
									window.removeEventListener("resize", lazyImageLoader);
									window.removeEventListener("orientationchange", lazyImageLoader);
								}
							}
						});

						lazyLoaderActive = false;
					}, 200);
				}
			};

			document.addEventListener("scroll", lazyImageLoader);
			window.addEventListener("resize", lazyImageLoader);
			window.addEventListener("orientationchange", lazyImageLoader);

			// Call once on page loaded
			setTimeout(lazyImageLoader, 200);
		}
	} else {
		console.log('[lazyloader.js] No lazy objects found.');
	}
}

