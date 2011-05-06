new function() {

	var eachInitNeon = function(elem) {
		atom.dom(elem).replaceNeon();
	};

	var userAgentDetection = function(browser) {
		return navigator.userAgent.indexOf(browser) != -1;
	};

	var rand = function(from, to) {
		return Number.random(from, to);
	}

	var userAgent = function(shadowsSrc) {
		return userAgentDetection('Chrome')
			? shadowsSrc.chrome
			: userAgentDetection('Firefox')
				? shadowsSrc.firefox
				: userAgentDetection('Opera')
					? shadowsSrc.opera
					: shadowsSrc.chrome;
	};

	var generateNeon = function($elem) {

		$elem.html($elem.text().replace(/./g , '<span>$&</span>'));

		$elem.find('*').each(function(elem) {
			var $elem = atom.dom(elem);
			var rgb = [rand(10, 255), rand(10, 255), rand(10, 255)];
			$elem.css('color', 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')');
			if(rand(0, 10) == 10) {
				$elem.attr('data-neon-params', 'blinks');
			}
		});

		return $elem;

	};

	atom.implement(atom.dom, {

		initNeon: function () {

			atom.dom("[data-neon='basic']")
				.each(eachInitNeon);

			atom.dom("[data-neon='custom']")
				.find('*')
				.each(eachInitNeon);

			generateNeon(atom.dom("[data-neon='auto']"))
				.find('*')
				.each(eachInitNeon);
		},

		replaceNeon: function () {
			var $elem = this;
			var padding = parseInt(($elem.css('padding')) + parseInt($elem.css('margin'))) || 50;
			var text = $elem.text();
			var config = {
				width     : parseInt($elem.css('width')) + padding * 2,
				height    : parseInt($elem.css('height')) + padding * 2,
				fontFamily: $elem.css('font-family'),
				color     : $elem.css('color'),
				fontSize  : $elem.css('font-size'),
				padding   : padding,
				text      : text,
				blinks    : $elem.attr('data-neon-params') == 'blinks'
			};

			var canvasPosition = $elem.attr('data-neon') != 'basic'
				? {
					top : -config.padding + 'px',
					left: -config.padding + 'px'
				}
				: {top: 0, left: 0};

			atom.dom()
				.create('span')
					.addClass('neonLayer')
					.text(text)
					.css({
						color  : 'rgba(0, 0, 0, 0)',
						margin : 0
					})
					.appendTo($elem.html('')
						.css({
							color  : 'rgba(0, 0, 0, 0)',
							margin : 0
						})
					);

			atom.dom() // todo: is it real to aapend it to before atom.dom() ?
				.create('canvas')
					.appendTo($elem)
					.drawContent(config)
					.parent()
						.css(canvasPosition);
			return $elem;
		},


		drawContent: function(config) {

			config = atom.extend({
				fontFamily : 'Neon_Regular',
				fontSize   : '60px',
				color      : '#fff',
				colorOff   : '#444',
				shadowOff  : '#000',
				text       : 'Neon_Light',
				blinks     : false
			}, config);
			var $elem = this;
			LibCanvas.extract();

			var width      = config.width,
				height     = config.height,
				fontSize   = config.fontSize,
				fontFamily = config.fontFamily,
				color      = config.color,
				colorOff   = config.colorOff,
				shadowOff  = config.shadowOff,
				padding    = config.padding,
				text       = config.text,
				blinks     = config.blinks;

			var em = function(factor) {
				return factor * parseInt(fontSize);
			};

			var Neon = atom.Class({
				Implements: [Drawable],


				draw: function () {
					var ctx = this.libcanvas.ctx;
					var shadowsSrc = {
						chrome: {
							0: {blur: 0.1},
							1: {blur: 0.6, alpha: 0.4},
							2: {blur: 0.8, alpha: 0.6},
							3: {blur: 1.0, alpha: 0.8},
							4: {blur: 1.4}
						},
						firefox: {
							0: {blur: 0.1},
							1: {blur: 0.6},
							2: {blur: 0.8},
							3: {blur: 1.0},
							4: {blur: 0,   alpha: 0}
						},
						opera: {
							1: {blur: 0.8, alpha: 0.4},
							2: {blur: 1.5, alpha: 0.6},
							3: {blur: 3.0, alpha: 0.8},
							4: {blur: 6.0}
						}
					};
					var shadows = atom.extend(shadowsSrc.chrome, userAgent(shadowsSrc));
					if(this.on) {
						for(var i in shadows) {
							ctx.fillText(text, padding, 55 + padding);
							ctx.font           = fontSize + ' ' + fontFamily;
							ctx.fillStyle      = color;
							ctx.globalAlpha    = shadows[i].alpha || 1;
							ctx.shadowBlur     = em(shadows[i].blur);
							ctx.shadowOffsetX  = 0;
							ctx.shadowOffsetY  = 0;
							ctx.shadowColor    = color;
							ctx.restore();
						}
					}
					ctx.fillText(text, padding, 55 + padding);
					ctx.font           = fontSize + ' ' + fontFamily;
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

			if(blinks) {
				var switcher = function() {
					neonText.on = !neonText.on;
					libcanvas.update();
					switcher.delay(rand(100, 1500));
				};
				switcher();
			}
			else
				neonText.on = true;
			return $elem;
		}

	});
};