$(document).ready(function () {
    var canvas = $("#myCanvas");
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();
    var traffic = new Array();
    var lines = new Array();
    var carCounter = 0;
    var gameStarted = true;
    var context = canvas.get(0).getContext("2d");
    var timer = 0;
    var lineTimer = 0;
    var playerName = "";
    var currentScore = 0;

    var moveRight = false;
    var moveLeft = false;
    var moveUp = false;
    var moveUp = false;

    // reads image out of html
    var racer = document.getElementById("racer");
    $("#racer").hide();
    var pearcar = document.getElementById("pearcar");
    $("#pearcar").hide();
    var lemoncar = document.getElementById("lemoncar");
    $("#lemoncar").hide();
    var mangocar = document.getElementById("mangocar");
    $("#mangocar").hide();
    var strawberrycar = document.getElementById("strawberrycar");
    $("#strawberrycar").hide();
    var crash = document.getElementById("crash");
    $("#crash").hide();


    function setPlayer(playerName, force_overwrite) {
        // force_overwrite defaults to 'false' if not given
        force_overwrite = force_overwrite || false;

        // if no playerName is given, default to 'SlothRacer' :)
        playerName = playerName || "SlothRacer";

        var player = localStorage.getItem(playerName);

        // try if the player already exist
        if (player == "" || player == null) {
            // just store a empty jsonified array in there
            localStorage.setItem(playerName, JSON.stringify([]));
        }

        // if force_overwrite is 'true' it will overwrite the player
        if (force_overwrite) {
            localStorage.setItem(playerName, JSON.stringify(""));
        }
    }


    function getPlayerScores(playerName) {
         return JSON.parse(localStorage.getItem(playerName));
    }


    function updatePlayerScore(playerName, score) {
        var playerScores = getPlayerScores(playerName);

        playerScores.push(score);

        localStorage.setItem(playerName, JSON.stringify(playerScores));
    }

    // sets the old playername upon pageload if available
    function setOldPlayername() {
        var inputUsername = document.getElementById("inputUsername");

        if (localStorage.length > 0) {
            inputUsername.value = localStorage.key(localStorage.length-1);
        } else {
            console.log("No previous player found.");
        }

    }

    var Player = function(x, y, moveRight, moveLeft, moveUp, moveDown) {
        this.x = x;
        this.y = y;
        this.moveRight = moveRight;
        this.moveLeft = moveLeft;
        this.moveUp = moveUp;
        this.moveDown = moveDown;
    }

    var Opponent = function(x, y, speed, type, width, height) {
        // if not passed, they are 0
        width = width || 0;
        height = height || 0;

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.type = type;
        this.width = width;
        this.height = height;
    }

    var Line = function(x, y) {
        this.x = x;
        this.y = y;
    }

    // generates new traffic
    function generateCar() {

        // checks if there are already enough traffic
        if (carCounter < 15) {
            // creating random variables
            var x = Math.random()*(canvasWidth-350)+150;

            var y = -100;
            var speed = Math.random()*5+10;
            var type = Math.random()*5;

            // raise the counter for every created object
            carCounter++;

            // push into array
            traffic.push(new Opponent(x, y, speed, type));
        }
    };

    function generateLine() {
        // generates a row speed lines
        lines.push(new Line(250, -50));
        lines.push(new Line(350, -50));
        lines.push(new Line(450, -50));
        lines.push(new Line(550, -50));
    };

    // creates racer in the center of the bottom
    var player = new Player(canvasWidth/2-35, canvasHeight-233, false, false, false, false);

    function drawBackground() {
        // gradient green background
        var grd = context.createLinearGradient(0, 0, 0, canvasHeight);
        grd.addColorStop(0,"darkgreen");
        grd.addColorStop(1,"green");
        context.fillStyle = grd;
        context.fillRect(0,0, canvasWidth, canvasHeight);


        // create street
        context.fillStyle = "grey";
        context.fillRect(100,0,canvasWidth-200, canvasHeight);
        context.fillStyle = "darkgrey";
        context.fillRect(150,0,canvasWidth-300, canvasHeight);
    };

    function writeGameOver() {
        // write game over
        context.font="150px Amatic SC";
        context.fillStyle = "red";
        context.fillText("GAME", 290, 280);
        context.fillText("OVER!", 290, 410);

        // write score
        context.font="75px Amatic SC";
        context.fillStyle = "blue";
        context.fillText("Your Score: " + currentScore, 240, 480);
    };

    // animation
    function startGame() {
        if (gameStarted) {
            window.setTimeout(startGame, 20);
            timer = timer + 20;
            lineTimer = lineTimer + 20;
            currentScore = currentScore + 20; // score in milliseconds

            // update the current score on the html5 page
            document.getElementById("currentscore").innerHTML = currentScore;

            context.clearRect(0, 0, canvasWidth, canvasHeight);

            // creating green gradient background and grey street
            drawBackground();

            // creating street lines
            for (var j = 0; j < lines.length; j++) {
                var l = lines[j];
                l.y = l.y+5;
                context.fillStyle = "white";
                context.fillRect(l.x, l.y, 5, 50);
            }

            // uses image to draw your car
            context.drawImage(racer, player.x, player.y);

            // drawing all traffic
            for (var i = 0; i < traffic.length; i++){

                var opponent = traffic[i];

                // dirty bug fix - sometimes it occures that opponent is undefined
                // and the game stops to work
                if(!opponent) {
                    console.log(opponent);
                    continue;
                }

                // drawing opponent with random color
                if (opponent.type < 2) {
                    // store the car's width and height in the opponent's object
                    opponent.width = pearcar.width;
                    opponent.height = pearcar.height;

                    // draw the car/opponent
                    context.drawImage(pearcar, opponent.x, opponent.y);

                } else if (opponent.type > 2 && opponent.type < 3) {
                    opponent.width = lemoncar.width;
                    opponent.height = lemoncar.height;
                    context.drawImage(lemoncar, opponent.x, opponent.y);
                } else if (opponent.type > 3 && opponent.type < 4) {
                    opponent.width = mangocar.width;
                    opponent.height = mangocar.height;
                    context.drawImage(mangocar, opponent.x, opponent.y);
                } else if (opponent.type > 4) {
                    opponent.width = strawberrycar.width;
                    opponent.height = strawberrycar.height;
                    context.drawImage(strawberrycar, opponent.x,opponent.y);
                }

                // moving traffic with random speed
                opponent.y = opponent.y + opponent.speed;

                // collision detection
                if(opponent.y+(opponent.height-25) > player.y && opponent.x+(opponent.width-35) > player.x && opponent.x < player.x+(opponent.width-35)) {
                    console.log("HIT!");
                    console.log("Car color: " + opponent.type);
                    gameStarted = false;
                    context.drawImage(crash, player.x, player.y-20);
                    console.log("Score: " + currentScore);

                    updatePlayerScore(playerName, currentScore);

                    writeGameOver();

                    var restartGameButton = document.getElementById("restartGameButton");
                    restartGameButton.disabled = false;

                    console.log("LocalStorage Player: " + getPlayerScores(playerName).toString());
                }

                // deletes car under the canvasHeight
                if (opponent.y > canvasHeight) {
                    delete traffic[i];
                    traffic.splice(0,1);
                    carCounter--;
                }
            }

            // creates every 0.5 second a new row Lines
            if (lineTimer == 500) {
                lineTimer = 0;
                generateLine();
            }

            // creates every 0.5 seconds a new car
            if (timer == 500) {
                timer = 0;
                generateCar();
            }

            // moves the player
            if (player.moveRight == true && player.x < canvasWidth-200) {
                player.x = player.x+20;
                player.moveRight = false;
            } else if (player.moveLeft == true && player.x > 150) {
                player.x = player.x-20;
                player.moveLeft = false;
            } else if (player.moveUp == true && player.y > 0) {
                player.y = player.y-20;
                player.moveUp = false;
            } else if (player.moveDown == true && player.y < canvasHeight-racer.height) {
                player.y = player.y+20;
                player.moveDown = false;
            } else if (player.moveDown == false && player.y < canvasHeight-racer.height) {
                player.y = player.y+3;
            }

        }
    };

    function getLocation() {
        // solved with the help of this blog: http://www.raymondcamden.com/2013/3/5/Simple-Reverse-Geocoding-Example
        // and the sheet on pingpong
        // for a list of types see the google maps api docs: https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                var geocoder = new google.maps.Geocoder();
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                var latlng = new google.maps.LatLng(lat, lng);

                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    var result = results[0];
                    var country = '';
                    var city = '';

                    for (var i = 0, len = result.address_components.length; i < len; i++) {
                        var ac = result.address_components[i];

                        if (ac.types.indexOf('locality') >= 0) {
                            city = ac.long_name;
                        }

                        if (ac.types.indexOf('country') >= 0) {
                            country = ac.long_name;
                        }

                    }
                    console.log(city + ", " + country);

                    document.getElementById("geolocation").innerHTML = city + ", " + country
                });
            });
        }
    }

    function playMusic(status) {
        // nyancat audio file is taking from wikipedia
        nyanCat = new Audio('nyan_cat.ogg');
        nyanCat.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        nyanCat.play();
    }

    drawBackground();
    setOldPlayername();
    playMusic();

    $('#restartGame').submit(function(e) {
        e.preventDefault();

        var restartGameButton = document.getElementById("restartGameButton");

        if (gameStarted) {
            gameStarted = false;
        }

        traffic = [];
        lines = [];
        carCounter = 0;
        gameStarted = true;
        timer = 0;
        lineTimer = 0;
        currentScore = 0

        // update the players score
        updatePlayerScore(playerName, currentScore);

        gameStarted = true;

        restartGameButton.disabled = true;

        startGame();
    });

    $('#startGame').submit(function(e){
        e.preventDefault();

        var usernameForm = document.getElementById("username");
        var inputUsername = document.getElementById("inputUsername");
        var startGameButton = document.getElementById("startGameButton");

        playerName = inputUsername.value;

        // disable name changes for now
        inputUsername.disabled = true;
        startGameButton.disabled = true;
        // start the game
        gameStarted = true;

        console.log("game started");

        // store the playername in the localStorage
        setPlayer(playerName);

        // now that we have a player in the localStorage, we can try to get
        // the highest score from the player
        var highScore = getPlayerScores(playerName).sort(
            function(a, b) {
                return b-a;
            }
        )[0];

        if (highScore) {
            document.getElementById("highscore").innerHTML = highScore;
        }

        // start
        startGame();
    });

    // key recognition
    $(window).keydown(function(e) {
        var arrowRight = 39;
        var arrowLeft = 37;
        var arrowUp = 38;
        var arrowDown = 40;
        var keyCode = e.keyCode;

        if (keyCode == arrowRight) {
            player.moveRight = true;
        } else if(keyCode == arrowLeft) {
            player.moveLeft = true;
        } else if (keyCode == arrowUp) {
            player.moveUp = true;
        } else if (keyCode == arrowDown) {
            player.moveDown = true;
        };
    });

    // mobile phone controls via device orientation / tilt
    // see the following links for more information about detecting the device orientation:
    // - https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation
    // - http://www.html5rocks.com/en/tutorials/device/orientation/
    if (window.DeviceOrientationEvent) {
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function(eventData) {
            // gamma is the left-to-right tilt in degrees, where right is positive
            var tiltLR = Math.round(eventData.gamma);

            console.log("Tilt: " + tiltLR);

            if(tiltLR > 0) {
                player.moveRight = true;
            } else if(tiltLR < 0) {
                player.moveLeft = true;
            }

        }, false);
    }

    getLocation();

});
