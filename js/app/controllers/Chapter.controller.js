

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