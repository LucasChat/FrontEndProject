
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
				'js/app/models/Chapter4.model.js',
				'js/app/models/Chapter5.model.js',
				'js/app/models/Chapter6.model.js',
				'js/app/models/Chapter7.model.js',
				'js/app/models/Chapter8.model.js',
				'js/app/models/Chapter9.model.js',
				'js/app/models/Chapter10.model.js',
				'js/app/models/Chapter11.model.js',
				'js/app/models/Chapter12.model.js',
				'js/app/models/Chapter13.model.js',
				'js/app/models/Chapter14.model.js',
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
