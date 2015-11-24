

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