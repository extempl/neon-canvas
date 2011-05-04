<!DOCTYPE html>
<html>
<head>
    <title>Demo - neon effect</title>
    <link href="/css/basic.css" rel="stylesheet">
    <link href="/css/colors.css" rel="stylesheet">
	<link href="/css/demo.css" rel="stylesheet">
	<link href="css/neon.css" rel="stylesheet">
	<script type="text/javascript" src="js/atom.js"></script>
    <script type="text/javascript" src="js/libcanvas.js"></script>
<!--    <script type="text/javascript" src="js/jquery.neon.js"></script>-->
</head>
<body>
	<header>
		<p class="preface">This is the demo of <a href="https://github.com/extempl/neon">Neon font libCanvas plugin</a></p>
	</header>
	<fieldset class="main-block">
		<legend>Source</legend>
		<h1 data-neon>Neon Light</h1>
	</fieldset>
	<fieldset class="main-block">
		<legend>Test</legend>
		<canvas id="neon_test"></canvas>
	</fieldset>
<!--	<script src="js/ui-core.js"></script>-->
	<script>
		new function () {

			LibCanvas.extract();

			var Neon = atom.Class({
				Implements: [Drawable],

				get style () {
					return this.on ? {
							shadow  : { shadowBlur: 40, shadowColor: '#fff' },
							text: '#fff',
							family: 'Neon_Regular'
						} : {
							shadow  : { shadowBlur: 3, shadowColor: '#000' },
							text: '#444',
							family: 'Neon_Regular'
						}
				},

				draw: function () {
					var ctx = this.libcanvas.ctx, style = this.style;
					ctx
					.save()
						.set(style.shadow)
						.text({
							text: 'Neon Light',
							color  : style.text,
							size   : 60,
							family : style.family
						})
					.restore();
				}
			});

			var libcanvas = new LibCanvas('#neon_test')
				.size({
					width : 382,
					height: 90
				}, true)
				.start();


			var neonText = new Neon();
			libcanvas.addElement(neonText);


			var rand = Number.random;

			setInterval(function() {
				neonText.on = !neonText.on;
				console.log(neonText.on);
			}, rand(1000, 15000));
		}
	</script>
	<!--<fieldset class="main-block">
		<legend>Basic</legend>
		<h1 data-neon="basic">Neon Light</h1>
	</fieldset>
	<fieldset class="main-block">
		<legend>Basic with blinking</legend>
		<h1 data-neon="basic" data-neon-params="blinks">Neon Light</h1>
	</fieldset>
	<fieldset class="main-block">
		<legend>Custom</legend>
		<h1 data-neon="custom">
			<span style="color:#f00; text-shadow:0 0  .1em rgba(255, 0, 0, .6),0 0  .6em rgba(255, 0, 0, .2), 0 0 1.2em rgba(255, 0, 0, .4), 0 0 1.8em rgba(255, 0, 0, .6), 0 0 2.4em rgba(255, 0, 0, .8), .02em .02em  .1em rgba(0, 0, 0, 1)"><span style="color:#f00" data-neon-params="blinks">N</span>eon</span>
			<span style="color:#00f; text-shadow:0 0  .1em rgba(0, 0, 255, .6),0 0  .6em rgba(0, 0, 255, .2), 0 0 1.2em rgba(0, 0, 255, .4), 0 0 1.8em rgba(0, 0, 255, .6), 0 0 2.4em rgba(0, 0, 255, .8), .02em .02em  .1em rgba(0, 0, 0, 1)">Li<span style="color:#0f0">g</span>ht</span>
		</h1>
	</fieldset>
	<fieldset class="main-block">
		<legend>Auto generates</legend>
		<h1 data-neon="auto">Neon Light</h1>
	</fieldset>-->
</body>
</html>