

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