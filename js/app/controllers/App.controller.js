

	/* APP */


	var App = function (container)
	{



		/* VARIABLES */


		// Reference

		var that = this;


		// Interface

		this.dom = {};

		this.dom.container = container;

		this.dom.content = container.find('.main');

		this.dom.loader = {
			container: null,
			elem: null,
			percentage: null,
			stroke: null
		};

		this.dom.interface = {
			header: {
				elem: null,
				logo: null,
				title: {
					elem: null,
					chapterName: null,
					chapterMark: null
				}
			},
			timeline: {
				elem: null,
				container: null,
				menu: null,
				chapterMark: null,
				progress: {
					elem: null,
					track: {
						elem: null,
						bar: null
					},
					docs: {
						elem: null,
						marks: null
					}
				}
			}
		};


		// Dimensions

		this.dimensions = {
			window: {
				width: $(window).width(),
				height: $(window).height()
			},
			timeline: {
				height: null,
				top: null
			}
		};


		// Status

		this.is = {
			loading: false,
			ready: false,
			menu: false,
			launched: false,
			fullscreen: false,
			active: true,
		};

		this.page = null;

		this.menu = null;


		// Activity timer

		this.activity = null;





		
		/* METHODS */


		// Load

		this.load = function (assets, callback)
		{

			// Start loading
			this.is.loading = true;

			// Fill DOM
			this.dom.loader.container = this.dom.container.find('.loader');
			this.dom.loader.elem = this.dom.loader.container.find('.loader-content');
			this.dom.loader.percentage = this.dom.loader.elem.find('.loader-percentage');
			this.dom.loader.stroke = this.dom.loader.elem.find('.loader-stroke');

			// Load css
			for(i in assets.css){ $('head').append('<link rel="stylesheet" type="text/css" href="' + assets.css[i] + '" />'); that.updateLoader(0 + (((i+1)*5)/assets.images.length)); }

			// Load js
			this.loadScript(assets, 0, callback);

		};

		this.loadScript = function (assets, index, callback)
		{
			if(assets.js.length > 0)
			{
				$.getScript(assets.js[index], function (res, status)
				{	
					that.updateLoader(5 + (((index+1)*15)/assets.images.length));
					if(index+1 >= assets.js.length){ that.loadTemplates(assets, 0, callback); }
					else{ that.loadScript(assets, index+1, callback); }
				});
			}
			else{ that.loadTemplates(assets, 0, callback); }

		};

		this.loadTemplates = function (assets, index, callback)
		{

			// Check templates
			if(assets.templates.length > 0)
			{
				// Load template
				$.ajax(
				{
					type: 'GET',
					url: assets.templates[index].url,
					dataType: 'html',
					success: function (data)
					{
						// Update loader
						that.updateLoader(20 + (((index+1)*30)/assets.images.length));

						// Append to templates
						storage.templates[assets.templates[index].name] = {
							name: assets.templates[index].name,
							url: assets.templates[index].url,
							template: data
						};

						// Check next loading
						if(index+1 >= assets.templates.length){ that.loadImages(assets, 0, callback); }
						else{ that.loadTemplates(assets, index+1, callback); }
					}
				});
			}
			else{ that.loadImages(assets, 0, callback); }

		};

		this.loadImages = function (assets, index, callback)
		{

			// Check images
			if(assets.images.length > 0)
			{
				// Load image
				var image = new Image();
				image.onload = function ()
				{
					// Update loader
					that.updateLoader(50 + (((index+1)*50)/assets.images.length));

					// Store image
					storage.images[assets.images[index].name] = { name: assets.images[index].name, url: assets.images[index].url, elem: image };

					// Manage next loading
					if(index+1 >= assets.images.length){ setTimeout(function (){ if(callback){ callback(); } }, 400); }
					else{ that.loadImages(assets, index+1, callback); }
				};
				image.src = assets.images[index].url;
			}
			else{ setTimeout(function (){ if(callback){ callback(); } }, 400); }

		};

		this.updateLoader = function (percentage)
		{

			// Update percentage
			this.dom.loader.percentage.html(Math.round(percentage));

			// Update stroke
			this.dom.loader.stroke.css('stroke-dashoffset', 700 - 700*percentage*0.01);

			// Update filter
			//this.dom.loader.container//.css('webkitFilter', 'grayscale(' + (1 - percentage*0.01) + ')')
				//.css('mozFilter', 'grayscale(' + (1 - percentage*0.01) + ')')
				//.css('oFilter', 'grayscale(' + (1 - percentage*0.01) + ')')
				//.css('msFilter', 'grayscale(' + (1 - percentage*0.01) + ')')
				//.css('filter', 'grayscale(' + (1 - percentage*0.01) + ')');

		};


		// Init

		this.init = function ()
		{

			if(!this.is.ready)
			{
				// Home
				this.page = new Home(this, 
				{
					onLaunch: function (){ that.doc.launch(0); }
				});
				this.page.init();

				// Header
				this.dom.interface.header.elem = $(storage.templates.header.template);
				this.dom.interface.header.logo = this.dom.interface.header.elem.find('.header-logo');
				this.dom.interface.header.title.elem = this.dom.interface.header.elem.find('.header-title');
				this.dom.interface.header.title.chapterName = this.dom.interface.header.title.elem.find('.header-chapter-name');
				this.dom.interface.header.title.chapterMark = this.dom.interface.header.title.elem.find('.header-chapter-mark');
				this.dom.container.append(this.dom.interface.header.elem);

				// Timeline
				this.dom.interface.timeline.elem = $(storage.templates.timeline.template);
				this.dom.interface.timeline.container = this.dom.interface.timeline.elem.find('.timeline-container');
				this.dom.interface.timeline.menu = this.dom.interface.timeline.elem.find('.timeline-menu-button');
				this.dom.interface.timeline.chapterMark = this.dom.interface.timeline.elem.find('.timeline-chapter-mark');
				this.dom.interface.timeline.progress.elem = this.dom.interface.timeline.elem.find('.timeline-progress');
				this.dom.interface.timeline.progress.track.elem = this.dom.interface.timeline.progress.elem.find('.timeline-progress-track');
				this.dom.interface.timeline.progress.track.bar = this.dom.interface.timeline.progress.track.elem.find('.timeline-progress-bar');
				this.dom.interface.timeline.progress.docs.elem = this.dom.interface.timeline.progress.elem.find('.timeline-progress-docs');
				this.dom.container.append(this.dom.interface.timeline.elem);
				this.dom.interface.timeline.elem.addClass('fold');
				this.dimensions.timeline.height = this.dimensions.window.height - 160;
				this.dimensions.timeline.top = 80;
				this.dom.interface.timeline.progress.elem.click(function (e)
				{
					e.preventDefault();
					if(that.doc && that.doc.chapter && that.doc.chapter.is.playing)
					{
						that.doc.chapter.seek(Math.abs(e.clientY - that.dimensions.timeline.top - that.dimensions.timeline.height));
					}
				});

				// Doc
				this.doc = new Doc(this, {});
				this.doc.init();

				// Menu
				this.menu = new Menu(this, {});
				this.menu.init();
				this.dom.interface.timeline.menu.click(function (e)
				{
					if(that.is.menu)
					{
						// Close menu
						that.menu.close(); 
						that.is.menu = false;

						// Relaunch chapter
						if(that.doc && that.doc.chapter && !that.doc.chapter.is.finished){ that.doc.chapter.play(); } 
					}
					else
					{
						// Open menu
						that.menu.open(); 
						that.is.menu = true; 

						// Pause chapter
						if(that.doc && that.doc.chapter){ that.doc.chapter.pause(); }
					}
				});

				// Transition
				this.dom.loader.container.addClass('loaded');
				this.dom.interface.header.elem.addClass('show');
				this.dom.interface.timeline.elem.addClass('show');
				this.page.show();

				// State
				this.is.ready = true;

				// Activity
				that.activity = setTimeout(function (){ that.changeActivity(); }, 3000);
				$(window).mousemove(function (e)
				{
					that.changeActivity(true);
					clearTimeout(that.activity);
					that.activity = setTimeout(function (){ that.changeActivity(false); }, 3000);
				});
			}

		};


		// Change activity

		this.changeActivity = function (show)
		{

			if(!show)
			{
				if(this.doc && this.doc.chapter && this.doc.chapter.is.playing)
				{
					this.dom.interface.header.elem.addClass('hide').removeClass('show');
				}
				else
				{
					clearTimeout(this.activity);
					this.activity = setTimeout(function (){ that.changeActivity(false); }, 3000);
				}
			}
			else
			{
				this.dom.interface.header.elem.addClass('show').removeClass('hide');	
			}

		};


	};


	
