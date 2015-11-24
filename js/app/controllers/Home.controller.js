

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