$(document).ready(function() {
  var audio = new Audio();

  var title_list = [];
  var play_list = [];

  var current_song = -1;

  /* Canvas */
  var cx = 250;
  var cy = 150;

  var isDown = false; //flag we use to keep track
  var mx, my;
  var angle = 0;
  var inCircle = false;
  var moving = false;
  var mouseOnCurrent = false;
  var howmuchplay = 0;

  var playCanvas = document.getElementById('Record');
  var output = document.getElementById('angle');
  var ctx = playCanvas.getContext('2d');

  for (i = 0; i < songs.length; i++) {
    title_list.push(songs[i]["title"]);
  }
  console.log(title_list);

  function clearPlaylist() {
    title_list = [];
    $("#playlist").html("");
  }

  $("#search_input").autocomplete({
    minLength: 2,
    source: title_list,
    focus: function(event, ui) {
      $("#search_input").val('')
      $("#search_input").val(ui.item.value)
      return false;
    },
    select: function(event, ui) {
      for (i = 0; i < songs.length; i++) {
        if (ui.item.value == songs[i]["title"]) {
          if (confirm(songs[i]["title"] + "을/를 재생 목록에 추가하시겠습니까?")) {
            document.getElementById("playlist").innerHTML +=
              '<img id="song" data-selector=' + play_list.length + ' src=' + songs[i]["image"] + ' draggable="true" style="border-bottom: 5px solid #fff">';
            play_list.push(songs[i]);
          } else {
            $("#search_input").val('')
          }
        }
      }
      return false;
    }
  });

  // 자동 완성에 앨범 아트 띄우기
  $("#search_input").data("ui-autocomplete")._renderItem = function(ul, item) {
    var $li = $('<li>'),
      $img = $('<img>');
    for (i = 0; i < songs.length; i++) {
      if (item.value == songs[i]["title"]) {
        $img.attr({
          src: songs[i]["image"],
          style: 'width : 80px; height : 80px'
        });
        $li.append('<a href="#">');
        $li.find('a').append($img).append(songs[i]['title'])
      }
    }
    return $li.appendTo(ul);
  };

  $(document).on("dragstart", "#song", function(event) {
    event.originalEvent.dataTransfer.setData("text", $(this).data("selector"));
  });

  $("canvas").on("drop", function(event) {
    var data = event.originalEvent.dataTransfer.getData("text");
    play_song(parseInt(data));
  });

  function play_song(data) {
    for (i = 0; i < play_list.length; i++){
      if (i == data){
        $("[id=song]")[i].style = "border-bottom: 5px solid #ccddff";
      }
      else{
        $("[id=song]")[i].style = "border-bottom: 5px solid #fff";
      }
    }
    
    audio.pause();
    audio = new Audio("./audio/" + play_list[data].title + ".mp3");
    audio.play();
    console.log(play_list[data]);
    current_song = data;
    render(current_song);

    audio.addEventListener("timeupdate", timeUpdate, true);
    audio.addEventListener("ended", function() {
      if (current_song < play_list.length - 1) {
        play_song(current_song + 1);
      }
    });

  }

  // $("#play").click(function() {
  //   audio.play();
  // });
  // $("#pause").click(function() {
  //   audio.pause();
  // });
  // $("#stop").click(function() {
  //   audio.pause();
  //   audio.currentTime = 0;
  //   timeUpdate();
  // });

  clearPlaylist();

  function render(i) {
    if (i == -1) return;
    ctx.clearRect(0, 0, 500, 300);
    ctx.beginPath();
    ctx.rect(0, 0, 500, 300);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'black'; // 레코드 판
    ctx.fill();

    ctx.beginPath();
    var current_angle = (2 * howmuchplay - 0.5) * Math.PI;
    if (current_angle < 0) {
      current_angle += Math.PI * 2;
    }

    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 100, 1.5 * Math.PI, current_angle);
    ctx.closePath();
    //ctx.lineTo(cx, cy);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.27)'; // 재생 바
    ctx.fill(); // or context.fill()
    //ctx.closePath();

    if (inCircle === true) {
      ctx.beginPath();
      var temp_angle = angle - 0.5 * Math.PI;
      if (temp_angle < 0) {
        temp_angle += Math.PI * 2;
      }
      ctx.moveTo(cx, cy);


      if (howmuchplay * 2 * Math.PI < angle) {
        ctx.arc(cx, cy, 100, current_angle, temp_angle);
      } else {
        ctx.arc(cx, cy, 100, temp_angle, current_angle);
      }
      ctx.closePath();
      //ctx.lineTo(cx, cy);
      ctx.fillStyle = 'rgba(190, 42, 68, 0.6)'; // 마우스 위치
      ctx.fill(); // or context.fill()
    }

    if (mouseOnCurrent === true) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(100 * Math.sin(angle) + cx, -100 * Math.cos(angle) + cy);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }

    var album = c.getContext("2d");
    var img = new Image();
    img.src = play_list[i].image;
    album.drawImage(img, 180, 80, 140, 140);

    ctx.beginPath();
    ctx.arc(mx, my, 5, 0, Math.PI * 2, true);
    ctx.closePath();
    if (isDown) {
      ctx.fillStyle = 'rgb(255, 252, 0)';
    } else {
      ctx.fillStyle = 'gray';
    }
    ctx.fill();
  }

  document.onmousemove = function(e) {
    var rect = playCanvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;

    angle = Math.atan2(my - cy, mx - cx);
    angle += Math.PI / 2;
    if (angle < 0) {
      angle += Math.PI * 2;
    }

    var distance = Math.sqrt(Math.pow(mx - cx, 2) + Math.pow(my - cy, 2));

    if (distance < 100 && distance > 60) {
      inCircle = true;
    } else {
      inCircle = false;
      //moving = false;
    }

    if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
      mouseOnCurrent = true;
    } else {
      mouseOnCurrent = false;
    }

    render(current_song);
  }

  $('#Record').on('mousedown', function(e) {
    if (isDown === false) {
      isDown = true;
      console.log(angle);

      if (mouseOnCurrent) {
        moving = true;
      }
      render(current_song);
    }
  });

  $('#Record').on('mouseup', function(e) {
    if (isDown === true) {
      if (moving && inCircle && mouseOnCurrent === false) {
        audio.currentTime = angle * audio.duration / (2 * Math.PI);
      }
      isDown = false;
      moving = false;
      render(current_song);
    }
  });

  $('#test').on('mouseup', function(e) {
    if (isDown === true) {
      if (moving && inCircle && mouseOnCurrent === false) {
        audio.currentTime = angle * audio.duration / (2 * Math.PI);
      }
      isDown = false;
      moving = false;
      render(current_song);
    }
  });


  function timeUpdate() {
    if (current_song == -1) return;
    if (audio.currentTime >= 0) {
      howmuchplay = (audio.currentTime / audio.duration);

      if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
        mouseOnCurrent = true;
      } else {
        mouseOnCurrent = false;
      }
      render(current_song);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  var spinner, center, rotation, ticker, offset, last,
			min, max, angle, reference, pressed, pos, movement,
			velocity, frame, timestamp, timeConstant, point,
			amplitude, target, increments, increment; //that's a whole lot of vars...

	//THIS IS HOW YOU SET THIS UP
	//SETTINGS
	max = 0; //max degrees to rotate after releasing mouse (in autospin mode)
	angle = min = 0; //min speed of rotation
	pressed = false; //is it grabbed? set to true for rotation without grabbing
	timeConstant = 325; //ms dampening in autospin mode, time to snap in snap mode
	target = 0; //target angle to which the animation will spin the element after mouse release
	rotation = 0; //store the current object rotation !!Do NOT manually change unless you REALLY know what you are doing!!
	increments = 10; //in snapping mode, how many increments you want to have
	var snap = true; //snapping mode on/off
	//END SETTINGS
	spinner = document.getElementById('test'); //the object on which this whole thing runs

  spinner.ondragstart = function() { return false; };
	$("#test").position({
    my:        "center",
    at:        "center+10% top+22%",
    of:        $("#Record"),
    collision: "flip"
	})

	rotate(72)

	// var demo = document.getElementById('demo'); //select the element to be used for output
	spinner.addEventListener('finished', function(e){ //listen for when it's done spinning
		var currR = e.detail.currentRotation; //this holds the current angle
		if (currR > 71 && currR < 73) { //attach whatever logic you want
			// demo.innerHTML = "Current angle is " + currR + "! Yey!<br>";
			audio.play();
		} else {
			// demo.innerHTML = "Nothing special for this angle: " + currR + "<br>";
			audio.pause();
		}
	});
	//END SETUP

	//VECTOR FUNCTIONS---------------------------------------------------------------
	function Point(x, y) {
		this.x = x;
		this.y = y;
		this.indicator = document.createElement('div');
		this.rotate = function (center, angle) {
			angle = (angle % Math.PI != 0) ? angle * (Math.PI / 180) : angle;
			var x = this.x - center.x;
			var y = center.y - this.y;
			var dx = x * Math.cos(angle) - y * Math.sin(angle);
			var dy = x * Math.sin(angle) + y * Math.cos(angle);
			return new Point((dx + center.x), (center.y-dy))
		};
		this.see = function (color) {
			color = (color) ? color : 'red';
			this.indicator.setAttribute('class', 'indicator');
			var css = [
				"position: fixed;",
				"background: "+color+";",
				"width: 16px;",
				"height: 16px;",
				"transform: translate(-8px,-8px);",
				"border-radius: 8px"].join(' ');
			this.indicator.style.cssText = css;
			document.body.insertBefore(this.indicator, document.getElementById('demo').nextSibling);
			this.indicator.style.left = this.x + 'px'
			this.indicator.style.top = this.y + 'px';
		};
	}

	/*
	var delta1 = delta(point1, center, true); //angle from x-axis to first point
	var delta2 = delta(point1, center, true); //angle from x-axis to second point
	var angleBetweenVectors = delta2 - delta1; //angle between point vectors
	*/
	function delta(point, around, angle){
		around = (around) ? around : new Point(0,0);
		angle = (angle) ? angle : false;
		if (angle){ //if asked for angle
			var dA;
			var dx = point.x - around.x;
			var dy = around.y - point.y; //in DOM y coords are flipped, so expression must be flipped too
			var rad = Math.atan2(dy,dx);
			var dA = rad * (180/Math.PI);
			return dA;
		}
		//else return difference vector between 2 point and around
		var d = new Point((around.x - point.x),(around.y - point.y));
		return d;
	}

	//get the point of an event e
	$(window).on('mousedown', function(e) {
		console.log(getPos(e));
	});

	function getPos(e) {
		// touch event
		if (e.targetTouches && (e.targetTouches.length >= 1)) {
			return new Point(e.targetTouches[0].clientX,e.targetTouches[0].clientY);
		}
		// mouse event
		return new Point(e.clientX,e.clientY);
	}
	//END VECTOR FUNCTIONS-----------------------------------------------------------

	var bounds = spinner.getBoundingClientRect(); //get CSS bounds of the object
	center = new Point((bounds.left + (spinner.offsetWidth/2)),(bounds.top + (spinner.offsetHeight/2)));
	window.addEventListener('resize', function(e){
		//this center needs to technically be recalculated every time the window is redrawn - like on flow changes or some such.
	//for now I just use resize. I don't know of any working repaint events.
		bounds = spinner.getBoundingClientRect(); //get CSS bounds of the object
		center = new Point((bounds.left + (spinner.offsetWidth/2)),(bounds.top + (spinner.offsetHeight/2)));
	});
	center = new Point((bounds.left),(bounds.top + (spinner.offsetHeight/2)));

	if (typeof window.ontouchstart !== 'undefined') { //if on mobile device
		spinner.addEventListener('touchstart', tap);
	}
	spinner.addEventListener('mousedown', tap);

	//rotate object by angle (flips angle for DOM, this pen works with proper positive angles)
	function rotate(a) {
		if (Math.abs(a)>360) a = a % 360
		spinner.style.transform = 'rotateZ('+(-a)+'deg)';
		rotation = -a;
	}

	//on tap set initial variable values, launch tracker
	function tap(e) {
		pressed = true;
		movement = 0;
		//add listeners
		if (typeof window.ontouchstart !== 'undefined') {
			document.addEventListener('touchmove', spin);
			document.addEventListener('touchend', release);
		}
		document.addEventListener('mousemove', spin);
		document.addEventListener('mouseup', release);
		point = getPos(e); //store point for offset calculations and checking if there has been movement
		offset = delta(point, center, true) + rotation; //angle between current rotaton and the mousedown event point
		if (offset < 0) offset = 360 + offset; //convert to positive angle format
		if (Math.abs(offset)>360) offset = 360 % offset; //convert to 0-360 angle format
		velocity = amplitude = 0; //reset the kinetic variables
		frame = angle; //set the first current frame's angle
		timestamp = Date.now(); //set the first timestamp
		clearInterval(ticker); //clear previous tracker
		if (snap) { //cancel snapping frames if user grabbed before autoadjustment finished
			cancelAnimationFrame(window.snapFrame + 1);
			cancelAnimationFrame(window.snapFrame - 1);
			cancelAnimationFrame(window.snapFrame);
		} //the error margin is there because CPU cycles aren't in sync with monitor refresh rate, so
		//by the time this cancel fires the animation might have completed the frame already or hasn't arrived there yet
		ticker = setInterval(track, 100); //and launch the new tracker

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	//track movement and set velocity (runs every 100 milliseconds)
	function track() {
		var now, elapsed, v;

		now = Date.now();
		elapsed = now - timestamp; //how much time passed since last run of this function
		timestamp = now; //set stamp for the next run
		increment = angle - frame; //difference in angle between last run and now
		frame = angle; //record the frame for next run

		//the greater the delta and the smaller the elapsed time (i.e. angle changed quickly), the bigger v will be
		v = 1000 * increment / (1 + elapsed);
		//calculate velocity based on v. Add old velocity so user can "accelerate" the spinning with multiple flicks
		velocity = 0.5 * v + 0.2 * velocity;
	}

	//perform angle calculations and rotate the object
	function spin(e) {
		pos = getPos(e); //current mouse position
		if (pressed && pos != point) { //run calculations if pressed AND ONLY if there has been some movement
			//the reason for this is the mousemove event seems to fire one anyway after mousedown - even if you keep your mouse stationary
			angle = delta(pos, center, true); //between x-axis from center and position of mouse
			if (angle < 0) angle = 360 + angle;
			if(angle){
				var final = angle - offset;
				if (final < 0) final = 360 + final;
				rotate(final);
				movement++; //this indicates there has been movement - used later for snapping function
			}
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	//on release check for flick-like motion and call autoSpin, if there was
	function release(e) {
		pressed = false;
		clearInterval(ticker);
		if (typeof window.ontouchstart !== 'undefined') {
			document.removeEventListener('touchmove', spin);
		}
		document.removeEventListener('mousemove', spin);
		if (velocity > 10 || velocity < -10) {
			amplitude = 0.5 * velocity;
			amplitude = (amplitude < Math.abs(angle)) ? amplitude : max;
			target = Math.round(angle + amplitude);
			timestamp = Date.now();
			if (snap) { window.snapFrame = requestAnimationFrame(snapTo) }
			else { window.snapFrame = requestAnimationFrame(autoSpin) };
		}
		last = -rotation;
		if (snap) { window.snapFrame = requestAnimationFrame(snapTo) }
		else {
			var finished = new CustomEvent('finished', {
					'view': window,
					'bubbles': true,
					'cancelable': true,
					'detail': {
						currentRotation: -rotation,
						wasMoved: (movement>1) ? true : false
					}
				});
				spinner.dispatchEvent(finished); //emit an event when done
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	//snap rotation after velocity is below threshold
	function snapTo() {
		var elapsed, ease, diff;
		increments = (typeof increments === 'number') ? Math.floor(increments) : 4; //by default snap every 90deg
		var ia = 360 / increments; //increment angle - snapping points should occur "every ia degrees"
		var a = last % ia; //check the distance from last resting point
		if (movement>0) {
			elapsed = Date.now() - timestamp; //time passed since mouse was released
			ease = 1 - Math.exp((-3*elapsed)/timeConstant);
			if(a > ia/2) {
				target = (last - a) + ia;
			}
			else {
				target = last - a;
			}
			diff = target - last;
			if(ease < 0.95){
				rotate(last+diff * ease);
				requestAnimationFrame(snapTo);
			} else {
				rotate(last+diff);
				var finished = new CustomEvent('finished', {
					'view': window,
					'bubbles': true,
					'cancelable': true,
					'detail': {
						currentRotation: -rotation,
						wasMoved: (movement>1) ? true : false
					}
				});
				spinner.dispatchEvent(finished); //emit an event when done
			}
		}
	}

	//if user performed a flick-like motion, simulate inertia
	function autoSpin() {
		var elapsed, delta;
		if (amplitude) { //if user has performed a flick
			elapsed = Date.now() - timestamp; //time passed since mouse was released
			delta = -amplitude * Math.exp(-elapsed / timeConstant);
			if (delta > 0.5 || delta < -0.5) { //smoothly slow the rotation
				rotate(target + delta - offset);
				requestAnimationFrame(autoSpin);
			} else {
				rotate(target - offset);
				var finished = new CustomEvent('finished', {
					'view': window,
					'bubbles': true,
					'cancelable': true,
					'detail': {
						currentRotation: -rotation,
						wasMoved: (movement>1) ? true : false
					}
				});
				spinner.dispatchEvent(finished); //emit an event when done
			}
		}
	}

});
