

	var Annex = function (doc, callbacks)
	{




		/* VARIABLES */


		// Reference

		var that = this;

		this.doc = doc;

		this.callbacks = callbacks;


		// DOM

		this.dom = this.doc.dom;

		this.dom.annex = {
			elem: null,
			back: null,
			continue: null,
			previous: null,
			next: null,
			slider: {
				container: null,
				slides: new Array(),
			}
		};


		// Properties

		this.model = null;
		this.index = null;

		this.slider = {
			current: 0,
			total: null,
		};







		/* METHODS */


		// Init

		this.init = function (annex)
		{

			// Model
			this.model = annex;
			this.slider.total = this.model.pictures.length;

			// Index
			this.index = this.doc.chapter.timestamps[this.model.timestamp];

			// DOM
			this.dom.annex.elem = $(storage.templates.diaporama.template);
			this.dom.annex.back = this.dom.annex.elem.find('.btn-back');
			this.dom.annex.continue = this.dom.annex.elem.find('.btn-continue');
			this.dom.annex.previous = this.dom.annex.elem.find('.btn-previous');
			this.dom.annex.next = this.dom.annex.elem.find('.btn-next');
			this.dom.annex.slider.container = this.dom.annex.elem.find('.page-annexe-slider');

			// Special case : 1 pic
			if(this.slider.total == 1){ this.dom.annex.previous.addClass('disabled'); this.dom.annex.next.addClass('disabled'); this.dom.annex.continue.addClass('show'); }

			// Slider events
			this.dom.annex.previous.click(function (e){ e.preventDefault(); that.previous(); });
			this.dom.annex.next.click(function (e){ e.preventDefault(); that.next(); });

			// Back events
			this.dom.annex.back.click(function (e){ e.preventDefault(); if(that.callbacks.onLeave){ that.callbacks.onLeave(); } });
			this.dom.annex.continue.click(function (e){ e.preventDefault(); if(that.callbacks.onLeave){ that.callbacks.onLeave(); } });

			// Init slides
			this.initSlide(0);

		};

		this.initSlide = function (index)
		{

			// Slide
			this.dom.annex.slider.slides[index] = $('<div class="slide"></div>');

			// Slide content
			if(this.model.pictures[index].comment)
			{
				this.dom.annex.slider.slides[index].addClass('slide-content').append($('<p>' + that.model.pictures[index].comment + '</p>'));
			}

			// Image
			var image = new Image();
			//var src = 'storage/' + this.model.pictures[index].url;
			var src = 'assets/storage/chapters/' + this.model.pictures[index].url;
			image.onload = function ()
			{
				// Insert in slide
				that.dom.annex.slider.slides[index].css('background-image', 'url(' + src + ')');

				// Append slide
				that.dom.annex.slider.container.append(that.dom.annex.slider.slides[index]);
				
				// Manage next slide
				if(index < that.slider.total - 1){ that.initSlide(index+1); }
				else{ that.callbacks.onLoaded(); }

			};
			image.src = 'assets/storage/chapters/' + this.model.pictures[index].url;

		};


		// Transitions

		this.show = function ()
		{

			// Append
			this.dom.content.append(this.dom.annex.elem);

			// Transition
			this.dom.annex.elem.addClass('show');
			setTimeout(function (){ that.dom.annex.previous.addClass('disabled'); }, 1000);

			// Title
			this.doc.chapter.dom.pellets[this.doc.chapter.timestamps[this.model.timestamp]].addClass('selected').removeClass('unselected');

		};

		this.hide = function ()
		{

			// Transition
			this.dom.annex.elem.addClass('hide').removeClass('show');

			// Remove markers
			this.dom.interface.timeline.progress.docs.elem.find('a.active.selected').addClass('unselected').removeClass('selected');

		};


		// Slider

		this.previous = function ()
		{

			if(this.slider.current > 0)
			{
				// Move slides
				this.dom.annex.slider.slides[this.slider.current].css('transform', 'translateX(100%)');
				this.dom.annex.slider.slides[this.slider.current-1].css('transform', 'translateX(0)');

				// Update slider properties
				this.slider.current--;

				// Update button state
				if(this.slider.current > 0){ this.dom.annex.previous.addClass('enabled').removeClass('disabled'); }else{ this.dom.annex.previous.addClass('disabled').removeClass('enabled'); }
				if(this.slider.current < this.slider.total - 1){ this.dom.annex.next.addClass('enabled').removeClass('disabled'); }else{ this.dom.annex.next.addClass('disabled').removeClass('enabled'); }
			}

		};

		this.next = function ()
		{

			if(this.slider.current + 1 < this.slider.total)
			{
				// Move slides
				this.dom.annex.slider.slides[this.slider.current].css('transform', 'translateX(-100%)');
				this.dom.annex.slider.slides[this.slider.current+1].css('transform', 'translateX(0)');

				// Update slider properties
				this.slider.current++;

				// Update button state
				if(this.slider.current > 0){ this.dom.annex.previous.addClass('enabled').removeClass('disabled'); }else{  his.dom.annex.previous.addClass('disabled'); }
				if(this.slider.current < this.slider.total - 1){ this.dom.annex.next.removeClass('disabled'); }else{  this.dom.annex.next.addClass('disabled').removeClass('enabled'); }
				if(this.slider.current == this.slider.total - 1){ this.dom.annex.continue.addClass('show'); } 
			}

		};




	};


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


	


	/* STORAGE */

	var storage = {
		templates: {},
		images: {},
		videos: {}
	};


	var chapters = {
		summary: null,
		episodes: new Array()
	};





	/* LAUNCH */
	
	$(document).ready(function ()
	{

		// Create doc
		var app = new App($('body'));

		// Init
		app.load({
			css: [
				'stylesheets/app.css'
			],
			js: [
				'js/app/models/Summary.model.js',
				'js/app/models/Chapter1.model.js',
				'js/app/models/Chapter2.model.js',
				'js/app/models/Chapter3.model.js',
				'js/app/models/Chapter4A.model.js',
				'js/app/models/Chapter4B.model.js',
				'js/app/models/Chapter5.model.js',
				'js/app/models/Chapter6A.model.js',
				'js/app/models/Chapter6B.model.js',
				'js/app/models/Chapter6C.model.js',
				'js/app/models/Chapter7.model.js'
			],
			templates: [
				{ name: 'header', url: 'js/app/views/header.template.html?i=10', load: true },
				{ name: 'timeline', url: 'js/app/views/timeline.template.html', load: true },
				{ name: 'home', url: 'js/app/views/home.template.html?i=2', load: true },
				{ name: 'menu', url: 'js/app/views/menu.template.html?i=12', load: true },
				{ name: 'personna', url: 'js/app/views/personna.template.html', load: false },
				{ name: 'next', url: 'js/app/views/next.template.html', load: false },
				{ name: 'diaporama', url: 'js/app/views/diaporama.template.html', load: true },
				{ name: 'finish', url: 'js/app/views/finish.template.html?i=3', load: true },
			],
			images: [
				{ name: 'cover_chapitre_1', url: 'assets/storage/chapters/1/cover_chapitre_1.jpg' },
				{ name: 'cover_chapitre_2', url: 'assets/storage/chapters/2/cover_chapitre_2.jpg' },
				{ name: 'cover_chapitre_3', url: 'assets/storage/chapters/3/cover_chapitre_3.jpg' },
				{ name: 'cover_chapitre_4A', url: 'assets/storage/chapters/4A/cover_chapitre_4A.jpg' },
				{ name: 'cover_chapitre_4B', url: 'assets/storage/chapters/4B/cover_chapitre_4B.jpg' },
				{ name: 'cover_chapitre_5', url: 'assets/storage/chapters/5/cover_chapitre_5.jpg' },
				{ name: 'cover_chapitre_6A', url: 'assets/storage/chapters/6A/cover_chapitre_6A.jpg' },
				{ name: 'cover_chapitre_6B', url: 'assets/storage/chapters/6B/cover_chapitre_6B.jpg' },
				{ name: 'cover_chapitre_6C', url: 'assets/storage/chapters/6C/cover_chapitre_6C.jpg' },
				{ name: 'cover_chapitre_7', url: 'assets/storage/chapters/7/cover_chapitre_7.jpg' }
			]
		},
		function ()
		{
			
			// Init
			app.init();

		});


	});



	/* CHAPTER */


	var Chapter = function (doc, callbacks)
	{




		/* VARIABLES */


		// Reference

		var that = this;

		this.doc = doc;

		this.callbacks = callbacks;


		// DOM

		this.dom = this.doc.dom;

		this.dom.chapter = {
			elem: null,
			media: null,
		};

		this.dom.media = null;

		this.dom.choice = {
			elem: null,
			container: null,
			chapterMark: null,
			chapterTitle: null,
			launch: null
		};

		this.dom.pellets = new Array();


		// Chapter

		this.model = null;
		this.timestamps = new Array();


		// State

		this.is = {
			video: true,
			playing: false,
			pausing: false,
			finished : false,
		};

		this.time = {
			total: null,
			current: 0,
			progress: null
		};


		// Timeout

		this.interval = null;







		/* METHODS */


		// Init

		this.init = function (chapter)
		{

			// Config
			this.model = chapter;

			// Fill DOM Chapter
			this.dom.chapter.elem = $('<div class="page page-chapter page-chapter-video showed"></div>');
			this.dom.chapter.media = $('<video width="' + this.doc.app.dimensions.window.width + '" height="' + this.doc.app.dimensions.window.height + '"></video>');
			this.dom.chapter.media.append('<source src="' + ('assets/storage/chapters/' + this.model.video) + '" type="video/mp4"></source>');
			this.dom.media = this.dom.chapter.media.get(0);
			this.dom.media.load();
			this.dom.chapter.media = $(this.dom.chapter.media).addClass('page-chapter-media');
			this.dom.chapter.elem.append(this.dom.chapter.media);
			this.dom.media.oncanplay = function ()
			{
				that.initAfterLoad();
			};

		};

		this.initAfterLoad = function ()
		{

			// Manage time
			this.time.total = parseInt(this.dom.media.duration) + 1;
			this.time.progress = this.doc.app.dimensions.timeline.height/this.time.total;

			// Update interface
			this.dom.interface.timeline.chapterMark.html(this.model.number);

			// Annexes
			for(i in this.model.assets)
			{
				// Add timestamp
				this.timestamps[this.model.assets[i].timestamp] = i;

				// Add pellet
				this.dom.pellets[i] = $('<a href="#" data-index="' + i + '"><span><span>' + this.model.assets[i].title + '</span></span></a>');
				this.dom.pellets[i].css('bottom', this.model.assets[i].timestamp*this.time.progress + 20);
				this.dom.pellets[i].click(function (e)
				{
					// Manage event
					e.preventDefault();
					e.stopPropagation();

					// Previous annex
					if(that.doc.annex)
					{ 
						// Remove previous
						that.doc.annex.hide(); 
						that.doc.annex = null;

						// Play chapter
						setTimeout(function ()
						{
							that.dom.content.find('.page-annexe.hide').remove(); 
						}
						, 1000); 
					}

					// Next annex
					that.doc.launchAnnex(that.model.assets[$(this).attr('data-index')]);
					
				});
				this.dom.interface.timeline.progress.docs.elem.append(this.dom.pellets[i]);
			}

			// Events
			this.dom.chapter.media.click(function (e)
			{
				e.preventDefault();
				e.stopPropagation();
				if(!that.is.finished)
				{
					if(that.is.paused){ that.play(); }
					else{ that.pause(); }
				}
			});

			// Fill DOM Choice
			if(this.model.index < chapters.episodes.length - 1)
			{
				var next = chapters.episodes[this.model.index+1];
				this.dom.choice.elem = $(storage.templates.next.template).css('background-image', 'url(' + storage.images[next.cover].url + ')');
				this.dom.choice.container = this.dom.choice.elem.find('.page-container');
				this.dom.choice.chapterTitle = this.dom.choice.container.find('.chapter-title');
				this.dom.choice.chapterTitle.html(next.title);
				this.dom.choice.launch = this.dom.choice.container.find('.btn-launch');
				this.dom.choice.launch.click(function (e)
				{
					// Prevent default
					e.preventDefault();

					// Remove previous chapter
					that.hide();

					// Add next chapter
					that.doc.launch(next.index);

				});
			}

			// Play
			this.play();	

		};


		// Show

		this.show = function ()
		{

			// Append
			this.dom.content.append(this.dom.chapter.elem);

			// Title
			this.dom.interface.header.title.chapterName.html(this.model.title);
			this.dom.interface.header.title.chapterMark.html('Chapitre ' + this.model.number);
			this.dom.interface.header.title.elem.addClass('show').removeClass('hide');

		};


		// Hide

		this.hide = function ()
		{

			// Remove video
			this.dom.chapter.elem.remove();

			// Remove pellets
			var pellets = this.dom.interface.timeline.progress.docs.elem.find('a');
			pellets.remove();

			// Transition Screen Next
			if(this.dom.choice.elem)
			{
				this.dom.choice.elem.addClass('hide').removeClass('show');
			}

		};


		// Media

		this.play = function ()
		{

			if(!this.is.playing)
			{
				// Play media
				this.dom.media.play();

				// Update state
				this.is.playing = true;
				this.is.paused = false;

				// Launch interval
				this.interval = setInterval(this.update, 1000);
			}

		};

		this.pause = function ()
		{

			// Pause media
			this.dom.media.pause();

			// Update state
			this.is.playing = false;
			this.is.paused = true;

			// Clear interval
			clearInterval(this.interval);

		};

		this.seek = function (position)
		{

			// Get time
			var time = position/that.doc.app.dimensions.timeline.height*that.time.total;

			// Update media
			that.dom.media.currentTime = time;

			// Update timeline
			that.time.current = parseInt(time);
			var progress = that.time.current*that.time.progress;
			that.dom.interface.timeline.progress.track.bar.height(progress);

			// Update pellets
			for(i in this.timestamps)
			{
				if(i < time){ this.dom.pellets[this.timestamps[i]].addClass('active'); }
			}

		};


		// Timeline

		this.update = function ()
		{

			if(that.time.current < that.time.total)
			{
				// Update time
				that.time.current++;

				// Progress
				var progress = that.time.current*that.time.progress;
				that.dom.interface.timeline.progress.track.bar.height(progress);

				// Check annexes
				if(that.timestamps[that.time.current])
				{
					var elem = that.dom.pellets[that.timestamps[that.time.current]].addClass('active').addClass('selected');
					setTimeout(function (){ elem.addClass('unselected').removeClass('selected'); }, 4000);
				}
			}
			else
			{
				// Clear interval
				clearInterval(that.interval);

				// Update states
				that.is.playing = false;
				that.is.paused = false;
				that.is.finished = true;

				// Finish chapter
				that.finish();
			}

		};


		// Finish

		this.finish = function ()
		{

			// Add finish choice
			if(this.model.index < chapters.episodes.length - 1)
			{
				this.dom.content.append(this.dom.choice.elem);
				this.dom.choice.elem.addClass('show');
				this.dom.interface.timeline.progress.track.bar.css('height', '100%');
			}
			else
			{
				if(this.callbacks.onDocFinish){ this.callbacks.onDocFinish(); }
			}

			// Titles
			this.dom.interface.header.title.elem.addClass('hide').removeClass('show');

		};



	};


	/* DOC */

	var Doc = function (app, callbacks)
	{




		
		/* VARIABLES */


		// Reference
		
		var that = this;

		this.app = app;

		this.callbacks = callbacks;


		// DOM

		this.dom = this.app.dom;

		this.dom.finish = {
			elem: null,
			container: null,
			title: null,
			text: null,
			explore: null,
		};


		// State

		this.state = {
			chapter: null,
			annexe: null,
		};

		this.chapter = null;

		this.annex = null;









		/* METHODS */


		// Init

		this.init = function ()
		{

					

		};


		// Launch

		this.launch = function (chapter)
		{

			// Create chapter
			if(chapters.episodes[chapter].type == 'video')
			{
				// New chapter
				this.chapter = new Chapter(this, {
					onDocFinish: function (){ that.finish(); }
				});
				this.chapter.init(chapters.episodes[chapter]);
				this.chapter.show();
				this.state.chapter = chapter;

				// Unfold timeline
				setTimeout(function (){ that.dom.interface.timeline.elem.addClass('unfold').removeClass('fold').removeClass('folded'); }, 500);
			}
			else
			{
				// New personna
				this.chapter = new Personna(this, {
					onDocFinish: function (){ that.finish(); }
				});
				this.chapter.init(chapters.episodes[chapter]);
				this.chapter.show();
				this.state.chapter = chapter;

				// Fold timeline
				setTimeout(function (){ that.dom.interface.timeline.elem.addClass('fold').removeClass('unfold'); }, 500);
			}

			// Update app
			if(!this.app.is.launched){ this.app.is.launched = true; }

		};


		// Annex

		this.launchAnnex = function (annex)
		{

			// Pause chapter
			if(this.chapter && this.chapter.is.playing){ this.chapter.pause(); }

			// New annex
			this.annex = new Annex(this, {
				onLoaded: function ()
				{
					// Show annex
					that.annex.show();

					// Add marker
					that.dom.interface.timeline.progress.docs.elem.find('a.active[data-index=' + that.annex.index +']').addClass('selected').removeClass('unselected');
				},
				onLeave: function ()
				{
					// Title
					var last = that.annex;
					that.chapter.dom.pellets[that.chapter.timestamps[that.annex.model.timestamp]].addClass('unselected').removeClass('selected');
					setTimeout(function (){ that.chapter.dom.pellets[that.chapter.timestamps[last.model.timestamp]].removeClass('unselected'); }, 400);

					// Hide annex
					that.annex.hide();
					that.annex = null;

					// Play chapter
					setTimeout(function ()
					{
						if(!that.chapter.is.finished){ that.chapter.play(); }
						that.dom.content.find('.page-annexe.hide').remove(); 
					}
					, 1000);
				}
			});
			this.annex.init(annex); 

		};


		// Finish

		this.finish = function ()
		{

			// Fill DOM
			this.dom.finish.elem = $(storage.templates.finish.template);
			this.dom.finish.container = this.dom.finish.elem.find('.page-container');
			this.dom.finish.title = this.dom.finish.elem.find('.page-title');
			this.dom.finish.text = this.dom.finish.elem.find('.page-text');
			this.dom.finish.explore = this.dom.finish.elem.find('.btn-explore');

			// Explore
			this.dom.finish.explore.click(function (e)
			{
				e.preventDefault();
				that.app.menu.open(); 
				that.app.is.menu = true; 
			});

			// Show
			this.dom.content.append(this.dom.finish.elem);
			this.dom.finish.elem.addClass('show');

		};



	};


	/* HOME */


	var Home = function (app, events)
	{


		/* VARIABLES */


		// Reference

		var that = this;

		this.app = app;


		// DOM

		this.dom = app.dom;

		this.dom.page = {
			elem: null,
			title: null,
			text: null,
			launch: null
		};


		// Events

		this.events = events;








		/* METHODS */


		// Init

		this.init = function ()
		{

			// DOM
			this.dom.page.elem = $(storage.templates.home.template);
			this.dom.page.title = this.dom.page.elem.find('.page-home-title');
			this.dom.page.text = this.dom.page.elem.find('.page-home-text');
			this.dom.page.launch = this.dom.page.elem.find('.btn-launch');

			// Launch event
			this.dom.page.launch.click(function (e)
			{
				// Prevent default
				e.preventDefault();

				// Launch event
				that.events.onLaunch();

				// Remove home page
				that.dom.page.elem.addClass('hide').removeClass('show');
				setTimeout(function () { that.dom.page.elem.remove(); }, 1000);
			});

		};


		// Show

		this.show = function ()
		{

			// Append
			this.dom.content.append(this.dom.page.elem);

			// Transition
			this.dom.page.elem.addClass('show');

		};


		// Hide

		this.hide = function (animation)
		{

			// Default values
			if(typeof animation == "undefined"){ animation = true; }

			// Transition
			if(animation){ this.dom.page.elem.addClass('hide').removeClass('show'); }

			// Remove
			if(animation){ setTimeout(function (){ that.dom.page.elem.remove(); }, 1000); }
			else{ that.dom.page.elem.remove(); }

		};





	};


	/* MENU */


	var Menu = function (app, callbacks)
	{




		/* VARIABLES */


		// Reference

		var that = this;

		this.app = app;

		this.callbacks = callbacks;


		// DOM

		this.dom = app.dom;

		this.dom.menu = {
			elem: null,
			container: null,
			svg: null,
			circles: null,
			hover: {
				elem: null,
				name: null,
				introduction: null
			},
			fullscreen: null
		};


		// State

		this.is = {
			open: false
		};







		/* METHODS */


		// Init

		this.init = function ()
		{

			// DOM
			this.dom.menu.elem = $(storage.templates.menu.template);
			this.dom.content.append(this.dom.menu.elem);
			this.dom.menu.container = this.dom.menu.elem.find('.page-container');
			this.dom.menu.svg = this.dom.menu.container.find('svg');
			this.dom.menu.hover.elem = this.dom.container.find('.page-menu-hover');
			this.dom.menu.hover.name = this.dom.menu.hover.elem.find('.chapter-name');
			this.dom.menu.hover.introduction = this.dom.menu.hover.elem.find('.chapter-introduction');
			this.dom.menu.fullscreen = this.dom.menu.elem.find('.btn-full-screen');


			// Add circles
			var element = '';
			for (var i = 0; i < chapters.summary.length; i++){
				element += '<div class="menu-element">';
				for (var j = 0; j < chapters.summary[i].length; j++){
					element += '<span data-level="' + i + '" data-index="' + j + '" class="circle">'+chapters.summary[i][j].number+'</span>';
				}
				element += '</div>';
			}
			this.dom.menu.circles = $(element);
			this.dom.menu.container.append(this.dom.menu.circles);
			this.dom.menu.circles = this.dom.menu.circles.parent().find('.circle');

			// Add paths
			var elementPosition  = {},
				previousPosition = {},
				offset = this.dom.menu.circles.width()/2;
			for (var i = 0; i < this.dom.menu.circles.length; i++)
			{
				if (i == 0){
					previousPosition.right = $(this.dom.menu.circles[i]).position().left + offset;
					previousPosition.top   = $(this.dom.menu.circles[i]).position().top + offset;
				}
				else
				{
					elementPosition.left  = $(this.dom.menu.circles[i]).position().left + offset;
					elementPosition.top   = $(this.dom.menu.circles[i]).position().top + offset;

					var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
					    newLine.setAttribute('x1', previousPosition.right);
					    newLine.setAttribute('y1', previousPosition.top);
					    newLine.setAttribute('x2', elementPosition.left);
					    newLine.setAttribute('y2', elementPosition.top);

				    this.dom.menu.svg.append(newLine);

				    if (!$(this.dom.menu.circles[i]).parent().is($(this.dom.menu.circles[i+1]).parent())){
					    previousPosition.right = elementPosition.left;
					    previousPosition.top   = elementPosition.top;
				    }
				    else {
				    	var j 			 = i,
				    		nextPosition = false;

				    	while (j < this.dom.menu.circles.length){
				    		if (!$(this.dom.menu.circles[i]).parent().is($(this.dom.menu.circles[j]).parent())){
				    			nextPosition = [$(this.dom.menu.circles[j]).position().left + offset, $(this.dom.menu.circles[j]).position().top + offset];
				    			break;
				    		}

				    		j++;
				    	}

			    		if (nextPosition){
							var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
							    newLine.setAttribute('x1', elementPosition.left);
							    newLine.setAttribute('y1', elementPosition.top);
							    newLine.setAttribute('x2', nextPosition[0]);
							    newLine.setAttribute('y2', nextPosition[1]);

						    this.dom.menu.svg.append(newLine);
			    		}
				    }
				}
			}

			// Menu hover
			this.dom.menu.hover.elem.css('width', chapters.summary.length*100);

			// Fullsrceen
			// this.dom.menu.fullscreen.click(function (e)
			// {
			// 	// Prevent default
			// 	e.preventDefault();

			// 	// Check fullscreen
			// 	if(that.app.is.fullscreen)
			// 	{
			// 		alert('suppression fullscreen');
			// 	}
			// 	else
			// 	{
			// 		var docElm = document.documentElement;
			// 		if (docElm.requestFullscreen) {
			// 		    docElm.requestFullscreen();
			// 		}
			// 		else if (docElm.mozRequestFullScreen) {
			// 		    docElm.mozRequestFullScreen();
			// 		}
			// 		else if (docElm.webkitRequestFullScreen) {
			// 		    docElm.webkitRequestFullScreen();
			// 		}
			// 	}
			// });

			// Mouseover
			this.dom.menu.circles.mouseover(function (e)
			{
				e.preventDefault();
				var chapter = chapters.summary[$(this).attr('data-level')][$(this).attr('data-index')];
				that.dom.menu.hover.name.html(chapter.title);
				that.dom.menu.hover.introduction.html(chapter.introduction);
				that.dom.menu.elem.css('background-image', 'url(' + storage.images[chapter.cover].url + ')');

			});

			// Click
			this.dom.menu.circles.click(function (e)
			{
				// Prevent default
				e.preventDefault();

				// Remove current page
				that.app.page.hide(false);

				// Close menu
				that.close();
				that.app.is.menu = false;

				// Remove annex
				if(that.app.doc.annex)
				{
					that.app.doc.annex.dom.annex.elem.remove();
					that.app.doc.annex = null;
				}

				// Remove finish screen
				if(that.dom.finish.elem)
				{
					that.dom.finish.elem.remove();
				}

				// Launch chapter
				var chapter = chapters.summary[$(this).attr('data-level')][$(this).attr('data-index')];
				if(that.app.doc && (!that.app.doc.chapter || (that.app.doc.chapter && that.app.doc.chapter.model.index != chapter.index)))
				{
					// Remove previous chapter
					if(that.app.doc.chapter)
					{
						// Hide
						that.app.doc.chapter.hide();

						// Clear interval
						if(!that.app.doc.chapter.is.finished)
						{
							clearInterval(that.app.doc.chapter.interval);
						}
					}

					// Launch new chapter
					that.app.doc.launch(chapter.index);
				}
				else
				{
					// Relaunch chapter
					if(that.app.doc.chapter){ that.app.doc.chapter.play(); }
				}
			});

		};


		// Open

		this.open = function (index)
		{

			// Reinit
			var chapter = null;
			chapter = chapters.summary[0][0];
			that.dom.menu.hover.name.html(chapter.title);
			that.dom.menu.hover.introduction.html(chapter.introduction);
			that.dom.menu.elem.css('background-image', 'url(' + storage.images[chapter.cover].url + ')');

			// Show
			that.dom.menu.elem.addClass('show').removeClass('hide');

			// Menu button update
			that.dom.interface.timeline.menu.addClass('active');

		};


		// Close

		this.close = function ()
		{

			// Hide
			that.dom.menu.elem.addClass('hide').removeClass('show');
			setTimeout(function (){ that.dom.menu.elem.removeClass('hide'); }, 800);

			// Menu button update
			that.dom.interface.timeline.menu.removeClass('active');

		};




	};


	/* CHAPTER */


	var Personna = function (doc, callbacks)
	{




		/* VARIABLES */


		// Reference

		var that = this;

		this.doc = doc;

		this.callbacks = callbacks;


		// DOM

		this.dom = this.doc.dom;

		this.dom.chapter = {
			elem: null,
			background: null,
			name: null,
			location:null,
			description: null,
			continue: null
		};

		this.dom.choice = {
			elem: null,
			container: null,
			chapterMark: null,
			chapterTitle: null,
			launch: null
		};


		// Chapter

		this.model = null;


		// State

		this.is = {
			personna: true
		};







		/* METHODS */


		// Init

		this.init = function (chapter)
		{

			// Config
			this.model = chapter;
			
			// Fill DOM
			this.dom.chapter.elem = $(storage.templates.personna.template);
			this.dom.chapter.background = this.dom.chapter.elem.find('.background').css('background-image', 'url(' + storage.images[this.model.cover].url + ')');
			this.dom.chapter.name = this.dom.chapter.elem.find('.personna-name').html(this.model.name);
			this.dom.chapter.location = this.dom.chapter.elem.find('.personna-location').html(this.model.location);
			this.dom.chapter.description = this.dom.chapter.elem.find('.personna-description').html(this.model.description);
			this.dom.chapter.continue = this.dom.chapter.elem.find('.btn-continue');

			// Continue
			this.dom.chapter.continue.click(function (e)
			{
				e.preventDefault();
				that.finish();
			});

			// Fill DOM Choice
			if(this.model.index < chapters.episodes.length - 1)
			{
				var next = chapters.episodes[this.model.index+1];
				this.dom.choice.elem = $(storage.templates.next.template).css('background-image', 'url(' + storage.images[next.cover].url + ')');
				this.dom.choice.container = this.dom.choice.elem.find('.page-container');
				this.dom.choice.chapterTitle = this.dom.choice.container.find('.chapter-title');
				this.dom.choice.chapterTitle.html(next.title);
				this.dom.choice.launch = this.dom.choice.container.find('.btn-launch');
				this.dom.choice.launch.click(function (e)
				{
					// Prevent default
					e.preventDefault();

					// Remove previous chapter
					that.hide();

					// Add next chapter
					that.doc.launch(next.index);

				});
			}	

		};


		// Show

		this.show = function ()
		{

			// Append
			this.dom.content.append(this.dom.chapter.elem);

			// Timeline
			//setTimeout(function (){ that.dom.interface.timeline.elem.addClass('unfold').removeClass('fold').removeClass('folded'); }, 500);

			// Title
			this.dom.interface.header.title.chapterName.html(this.model.title);
			this.dom.interface.header.title.chapterMark.html('Chapitre ' + this.model.number);
			this.dom.interface.header.title.elem.addClass('show').removeClass('hide');

		};


		// Hide

		this.hide = function ()
		{

			// Remove video
			this.dom.chapter.elem.remove();

			// Transition Screen Next
			if(this.dom.choice.elem)
			{
				this.dom.choice.elem.addClass('hide').removeClass('show');
			}

		};


		// Finish

		this.finish = function ()
		{

			// Add finish choice
			if(this.model.index < chapters.episodes.length - 1)
			{
				this.dom.content.append(this.dom.choice.elem);
				this.dom.choice.elem.addClass('show');
				this.dom.interface.timeline.progress.track.bar.css('height', '100%');
			}
			else
			{
				if(this.callbacks.onDocFinish){ this.callbacks.onDocFinish(); }
			}

			// Titles
			this.dom.interface.header.title.elem.addClass('hide').removeClass('show');

		};


	};