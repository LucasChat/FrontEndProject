<!DOCTYPE html>
<html lang="en">


<head>

	<!-- METAS -->

	<meta charset="UTF-8">
	<title>Starcraft 2</title>


	<!-- STYLES -->
	
	<style>
		html, body{ width:100%; height:100%; margin:0; padding:0; border:none;}
		main{ position:absolute; top:0; left:0; width:100%; height:100%; overflow: hidden; }
		.loader{ position:absolute; top:0; left:0; width:100%; height:100%; background-image:url(assets/medias/images/couverture.jpg); background-size:cover; background-position:center; background-repeat: no-repeat; -webkit-filter:grayscale(1); -moz-filter:grascale(1); -o-filter:grayscale(1); -ms-filter:grayscale(1); filter:grayscale(100); -webkit-transition:all 0.3s ease; transition:all 0.3s ease;}
		.loader-content{ box-sizing:border-box; position:absolute; top:50%; left:50%; width:150px; height:200px; margin-top:-100px; margin-left:-75px; padding:20px; }
		.loader-content .starcraft-text{ display: block; width:100%; height:auto; padding-bottom:30px; }
		.loader-content .loader-percentage{ display: block; text-align:center; font-family:Gotham, Helvetica; color:#FEFEFE; font-size:25px; margin-top:-5px; }
		.loader-content .loader-percentage:after{ content:'%'; font-size:20px; margin-left:5px; }
		.loader-content svg{ position:absolute; top:0; left:0; }
		.loader-content svg rect{ transition: all 0.3s ease; }
	</style>

</head>


<body>


	<main class="main">
	
		<div class="loader">
			<div class="loader-content">
				<img class="starcraft-text" src="assets/medias/images/logo_text_starcraft.png" alt="logo">
				<span class="loader-percentage">00</span>
				<svg width="150" height="200"><rect class="loader-stroke" x="0" y="0" width="150" height="200" stroke="#FEFEFE" stroke-width="8" stroke-dasharray="700" stroke-dashoffset="700" fill="transparent"/></svg>
			</div>
		</div>

	</main>

	
</body>


</html>


<!-- SCRIPTS -->

<script src="js/dist/vendor.js"></script>
<script src="js/dist/app.js"></script>