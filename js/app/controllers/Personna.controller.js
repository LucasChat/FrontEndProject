

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