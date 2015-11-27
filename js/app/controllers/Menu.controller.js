

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
			
			// align menu on mid screen
			this.verticalAlign($('.aside-left').find('.links-menu'), $('.aside-left'));
			this.verticalAlignSelection($('.selection-terrans-heroes'));
			this.verticalAlignSelection($('.selection-protoss-heroes'));
			this.verticalAlignSelection($('.selection-zergs-heroes'));

			this.verticalAlignSelection($('.selection-terrans-races'));
			this.verticalAlignSelection($('.selection-protoss-races'));
			this.verticalAlignSelection($('.selection-zergs-races'));

			this.verticalAlignSelection($('.selection-terrans-factions'));
			this.verticalAlignSelection($('.selection-protoss-factions'));
			this.verticalAlignSelection($('.selection-zergs-factions'));

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
				// that.dom.menu.elem.css('background-image', 'url(' + storage.images[chapter.cover].url + ')');

			});

			// Click
			this.dom.menu.circles.click(function (e)
			{
				$('.links-menu').find('a').removeClass('current');
				$('.selection-global').removeClass('visible');

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
			//that.dom.menu.elem.css('background-image', 'url(' + storage.images[chapter.cover].url + ')');

			// Show
			that.dom.menu.elem.addClass('show').removeClass('hide');

			// Menu button update
			that.dom.interface.header.menu.addClass('active');

		};


		// Close

		this.close = function ()
		{

			// Hide
			that.dom.menu.elem.addClass('hide').removeClass('show');
			setTimeout(function (){ that.dom.menu.elem.removeClass('hide'); }, 800);

			// Menu button update
			that.dom.interface.header.menu.removeClass('active');

		};



		// align verticaly menu
		this.verticalAlign = function(element, container) {
			this.height = element.height();
			this.containerHeight = container.height();

			element.css('top', (this.containerHeight - this.height)/2);
		};

		// align selection content verticaly
		this.verticalAlignSelection = function(element) {
			this.height = element.height();
			this.ulHeight = element.find('ul').height();

			element.css('paddingTop', (this.height - this.ulHeight)/2);
		}



	};