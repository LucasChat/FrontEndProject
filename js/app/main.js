var App = function(){

	this.mouseX = 0;
	this.mouseY = 0;

	this.rectX = 0;

	this.isLoaded = false;

	this.currentFrame = null;

	this.ratio = 1280 / 960;

	this.canvas = $('#scene');
	this.context = this.canvas[0].getContext('2d');

	this.images = [];

	this.imagesToLoad = {};

	this.imgBase = 'assets/images/e-golf_1280x960_360_000';

	for( var i = 0; i <= 360; i++ ){

		this.imagesToLoad[ 'frame-' + i ] = this.getImgPath( i );

	}

	console.log(this.imagesToLoad);

	this.init();

};

App.prototype.getImgPath = function(i) {
		
	var prefix = '';

	if( i < 100 ){
		prefix += '0';
	}

	if( i < 10 ){
		prefix += '0';
	}

	return this.imgBase + prefix + i + '.jpg';

};

App.prototype.init = function() {
	
	this.resize();

	$(window).on('mousemove', $.proxy(this.onMouseMove, this));
	$(window).on('resize', $.proxy(this.resize, this));

	this.loader = new Loader();

	this.loader.addImages(this.imagesToLoad);

	this.loader._onComplete.add(this.onLoaderComplete, this);

	console.log( this.imagesToLoad );

	this.loader.start();

};

App.prototype.onLoaderComplete = function() {
	
	console.log( 'images loaded' );

	var self = this;

	$.each( this.imagesToLoad, function(id, url){

		self.images.push( self.loader.queue.getResult( id ) );

	});

	console.log( this.images );

	this.isLoaded = true;

	// TweenMax.to( this.mouseX, 1, {
	// 	v: 100,
	// 	yoyo: true,
	// 	repeat: -1,
	// 	ease: Quart.easeOut
	// });

};

App.prototype.update = function() {

	var frame = this.getFrame();

	if ( typeof frame != 'undefined' && frame != this.currentFrame ){

		this.clear();

		this.draw( frame );

		console.log( 'draw image', frame );

		this.currentFrame = frame;

	}

};

App.prototype.clear = function() {
	
	this.resize();

};

App.prototype.draw = function( img ) {
	
	this.context.drawImage( img, 0, 0, this.videoW, this.videoH );	

};

App.prototype.getFrame = function() {
	
	var index = Math.floor( this.mouseX / 100 * this.images.length );

	return this.images[ index ];

};


App.prototype.resize = function() {
	
	this.width = $(window).width();
	this.height = $(window).height();

	this.videoW = this.width;
	this.videoH = this.width / this.ratio;

	if ( this.videoH < this.height ){

		this.videoH = this.height;
		this.videoW = this.videoH * this.ratio;

	}

	$(this.canvas).css({
		width: this.videoW,
		height: this.videoH
	});

	this.canvas[0].width = this.videoW;
	this.canvas[0].height = this.videoH; 	

	console.log( this.videoW, this.videoH );

	this.currentFrame = null;
};

App.prototype.onMouseMove = function(e) {
		
	this.mouseX = e.clientX / this.width * 100;
	this.mouseY = e.clientY / this.height * 100;

	// console.log( this.mouseX + '%' );

	TweenMax.to( '#cursor', 0.3, {
		left: this.mouseX + '%',
		top: this.mouseY + '%',
		ease: Quart.easeOut
	});

};

$(document).ready(function(){

	app = new App();

  (function raf(){
    app.update();
    window.requestAnimationFrame(raf);
  })();

});