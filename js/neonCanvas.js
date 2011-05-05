new function() {

	var eachInitNeon = function($elem) {
		console.log($elem);
		this.replaceNeon();
	};

	var userAgentDetection = function(browser) {
		return navigator.userAgent.indexOf(browser) != -1;
	};

	var userAgent = function(shadowsSrc) {
		return userAgentDetection('Chrome')
			? shadowsSrc.chrome
			: userAgentDetection('Firefox')
				? shadowsSrc.firefox
				: userAgentDetection('Opera')
					? shadowsSrc.opera
					: shadowsSrc.chrome;
	};

	atom.implement(atom.dom, {

		initNeon: function () {

			var blinksParam = "[data-neon-params='blinks']";

			atom.dom("[data-neon='basic']")
				.each(eachInitNeon);

			/*atom.dom("[data-neon='custom']")
				.find('*')
				.each(eachInitNeon);

			generateNeon(atom.dom("[data-neon='auto']"))
				.find('*')
				.each(eachInitNeon);*/
		},

		replaceNeon: function () {
			var $elem = this;
			var css = {
				width      : $elem.elems[0].offsetWidth,
				height     : $elem.elems[0].offsetHeight,
//				fontFamily : $elem.elems[0].fontFamily,
//				fontSize   : $elem.elems[0].fontSize,
//				color      : $elem.elems[0].color,
				padding    : 50//$elem.style('padding') + $elem.style.margin
			};
			var text = $elem.html();
			$elem
				.html('<span>'+text+'</span>')
				.css({
					color  : 'rgba(0, 0, 0, 0)',
					margin : 0,
					padding: css.padding
				});

			var config = atom.extend({
				width : css.width + css.padding * 2,
				height: css.height + css.padding * 2,
				text  : text
			}, css);
			atom.dom()
				.create('canvas')
				.appendTo($elem)
				.drawContent(config);
			return $elem;
		},


		drawContent: function(config) {

			config = atom.extend({
				fontFamily : 'Neon_Regular',
				fontSize   : 60,
				color      : '#fff',
				colorOff   : '#444',
				shadowOff  : '#000',
				text       : 'Neon_Light'
			}, config);
			var $elem = this;
			LibCanvas.extract();

			var width      = 472,
				height     = 160,
				fontSize   = config.fontSize,
				fontFamily = config.fontFamily,
				color      = config.color,
				colorOff   = config.colorOff,
				shadowOff  = config.shadowOff,
				padding    = config.padding,
				text       = config.text;

			var em = function(factor) {
				return factor * fontSize;
			};

			var Neon = atom.Class({
				Implements: [Drawable],


				draw: function () {
					var ctx = this.libcanvas.ctx;
					var shadowsSrc = {
						chrome: {
							0: {blur: 0.1, alpha: 1},
							1: {blur: 0.6, alpha: 0.4},
							2: {blur: 0.8, alpha: 0.6},
							3: {blur: 1.0, alpha: 0.8},
							4: {blur: 1.4, alpha: 1}
						},
						firefox: {
							0: {blur: 0.1, alpha: 1},
							1: {blur: 0.6, alpha: 1},
							2: {blur: 0.8, alpha: 1},
							3: {blur: 1.0, alpha: 1},
							4: {blur: 0,   alpha: 0}
						},
						opera: {
							1: {blur: 0.8, alpha: 0.4},
							2: {blur: 1.5, alpha: 0.6},
							3: {blur: 3.0, alpha: 0.8},
							4: {blur: 6.0, alpha: 1}
						}
					};
					var shadows = atom.extend(shadowsSrc.chrome, userAgent(shadowsSrc));
//					atom.log(shadows);
					if(this.on) {
						for(var i in shadows) {
							ctx.fillText(text, padding, 55 + padding);
							ctx.font           = fontSize + 'px ' + fontFamily;
							ctx.fillStyle      = color;
							ctx.globalAlpha    = shadows[i].alpha;
							ctx.shadowBlur     = em(shadows[i].blur);
							ctx.shadowOffsetX  = 0;
							ctx.shadowOffsetY  = 0;
							ctx.shadowColor    = color;
							ctx.restore();
						}
					}
					ctx.fillText(text, padding, 55 + padding);
					ctx.font           = fontSize + 'px ' + fontFamily;
					ctx.fillStyle      = colorOff;
					ctx.globalAlpha    = 1;
					ctx.shadowBlur     = em(0.1);
					ctx.shadowOffsetX  = em(0.02);
					ctx.shadowOffsetY  = em(0.02);
					ctx.shadowColor    = shadowOff;
					ctx.restore();
				}

			});

			var libcanvas = new LibCanvas($elem)
				.size({
					width : width,
					height: height
				}, true)
				.start();


			var neonText = new Neon();
			libcanvas.addElement(neonText);
			neonText.on = true;
			/*var switcher = function() {
			  neonText.on = !neonText.on;
			  libcanvas.update();
			  switcher.delay( Number.random(100, 1500) );
			};

			switcher();*/
			return $elem;
		}

	});
};