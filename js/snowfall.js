(function () {
	var currentSnowfall = null;
	var setcontainer = document.getElementById('container');
	var img = document.getElementById('image');
	var header = document.getElementById('header');
	var startButton = document.getElementById('start');
	var settingsButton = document.getElementById('openset');
	var backgroundChangers = document.getElementsByClassName('background-changer');
	var soundPlayer = document.getElementsByClassName('track');
	var muter = document.getElementById('stop-track');

	var tracks = [
		'sound/let_it_snow.ogg',
		'sound/jingle_bells.ogg',
		'sound/last_christmas.ogg',
		'sound/marsh_world.ogg'
	];

	var snowfall = function() {
		//canvas init
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		//canvas dimensions
		var W = window.innerWidth;
		var H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		
		//snowflake particle
		var mp = document.getElementById("amount").value;
		var particles = [];
		for(var i = 0; i < mp; i++)
		{
			particles.push({
				x: Math.random()*W, //x-coordinate
				y: Math.random()*H, //y-coordinate
				r: Math.random()*3, //radius
				d: Math.random()*mp //density
			})
		}
		//Draw the flakes
		var draw = function() {
			ctx.clearRect(0, 0, W, H);
			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

			for(var i = 0; i < mp; i++)
			{
				var p = particles[i];
				ctx.moveTo(p.x, p.y);
				ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
			}
			ctx.fill();
			update();
		}
		
		//Function to move the snowflakes
		var angle = 0;
		var update = function()	{
			angle += 0.01;
			for(var i = 0; i < mp; i++)
			{
				var p = particles[i];
				//Updating X and Y coordinates
				//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
				p.y += Math.cos(angle+p.d) + 1 + p.r/2;
				p.x += Math.sin(angle) * 2;
				
				//Sending flakes back from the top when it exits
				if(p.x > W+5 || p.x < -5 || p.y > H)
				{
					if(i%3 > 0) //66.67% of the flakes
					{
						particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
					}
					else
					{
						//If the flake is exitting from the right
						if(Math.sin(angle) > 0)
						{
							//Enter from the left
							particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
						}
						else
						{
							//Enter from the right
							particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
						}
					}
				}
			}
		}

		var speed = 40 - document.getElementById("speed").value; // invert value

		//animation loop
		currentSnowfall = setInterval(draw, speed);
	};

	var clear = function() {
		clearInterval(currentSnowfall);
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect( 0, 0, canvas.width, canvas.height);
	}


	var letItSnow = function() {
		clear();
		setcontainer.style.height = '80px';
		img.style.display = "block";
		header.style.display = "block";
		snowfall();
	}

	//	For 'Settings' button. It opens settins container
	var openSet = function() {
		img.style.display = "none";
		header.style.display = "none";
		setcontainer.style.height = '330px';
		clear();
	}

	var play = function(path) {
		return function () {
			audio.src = path;
			audio.autoplay = true;
		    audio.loop = true;
		}
	};

	var toggleMute = function() {
		audio.muted = !audio.muted;
	}

	var background = function (color) {
		return function () {
			document.getElementById('snowfall').style.background = color;
		}
	}

	startButton.addEventListener('click', letItSnow);
	settingsButton.addEventListener('click', openSet);
	muter.addEventListener('click', toggleMute);

	Array.from(backgroundChangers).forEach(function (changer) {
		var dataBg = changer.getAttribute('data-bg');
		changer.addEventListener('click', background(dataBg));
	});

	Array.from(soundPlayer).forEach(function (player, i) {
		player.addEventListener('click', play(tracks[i]));
	});
})();
