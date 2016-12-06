(function () {
    "use strict";
    window.g = {
        mobile: false,
        mobileCSSLoaded: false
    };
    /**
     * Fisher-Yates Shuffle. Code adapted from https://bost.ocks.org/mike/shuffle
     * @param {Array} array - the array to in-place shuffle
     * @returns {Array} - the shuffled array
     */
    function shuffle (array) {
        var counter = array.length;
        while (counter > 0) {
            var index = Math.floor(Math.random() * counter);
            counter--;
            var temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    var tiles = [];
    var tileCounter = 0;
    var night = false;
    for (var i = 0; i < 60; i++) {
        tiles[i] = i;
    }
    shuffle(tiles);
    setInterval(function () {
        if (document.getElementsByTagName("bbsite")[0].scrollTop <= window.innerHeight) {
            var aborted = false;
            do {
                if (tileCounter < 60) {
                    var tile = document.getElementById("innerTileWrapper").children[tiles[tileCounter]].classList;
                    tileCounter++;
                    if (night) {
                        if (tile.contains("hovera")) {
                            tile.toggle("hovera");
                            aborted = false;
                        } else if (tile.contains("hoverb")) {
                            tile.toggle("hoverb");
                            aborted = false;
                        } else if (tile.contains("hoverc")) {
                            tile.toggle("hoverc");
                            aborted = false;
                        } else if (tile.contains("hoverd")) {
                            tile.toggle("hoverd");
                            aborted = false;
                        } else {
                            aborted = true;
                        }
                    } else if (tile.contains("hovera") || tile.contains("hoverb") || tile.contains("hoverc") || tile.contains("hoverd")) {
                        aborted = true;
                    } else {
                        var flipClass = decodeURIComponent("hover%" + (61 + Math.floor(Math.random() * 4)));
                        tile.toggle(flipClass);
                        aborted = false;
                    }
                } else {
                    tileCounter = 0;
                    shuffle(tiles);
                    night = !night;
                    aborted = false;
                }
            } while (aborted);
        }
    }, 2000);
    (function () {
        var elems = document.getElementsByClassName("fwrap");
        for (var i = 0; i < elems.length; i++) {
            elems[i].addEventListener("mouseenter", function (e) {
                var tile = e.target.classList;
                if (night) {
                    if (tile.contains("hovera")) {
                        tile.toggle("hovera");
                    } else if (tile.contains("hoverb")) {
                        tile.toggle("hoverb");
                    } else if (tile.contains("hoverc")) {
                        tile.toggle("hoverc");
                    } else if (tile.contains("hoverd")) {
                        tile.toggle("hoverd");
                    }
                } else if (!tile.contains("hovera") && !tile.contains("hoverb") && !tile.contains("hoverc") && !tile.contains("hoverd")) {
                    tile.toggle(decodeURIComponent("hover%" + (61 + Math.floor(Math.random() * 4))));
                }
            });
        }
    })();
    function resizeListener () { // eslint-disable-line require-jsdoc
        if (window.innerHeight / window.innerWidth < 0.6) {
            document.getElementById("outerTileWrapper").style.width = (Math.ceil(window.innerWidth / 100) * 100) + "px";
        } else {
            document.getElementById("outerTileWrapper").style.width = (Math.ceil(window.innerHeight / 60) * 100) + "px";
        }
        if (window.innerWidth < 713 && !window.g.mobile) {
            window.g.mobile = true;
            if (!window.g.mobileCSSLoaded) {
                var css = document.createElement("link");
                css.setAttribute("rel", "stylesheet");
                css.setAttribute("type", "text/css");
                css.setAttribute("href", "/monorail/mobile.css");
                css.setAttribute("title", "mobile");
                document.getElementsByTagName("head")[0].appendChild(css);
                window.g.mobileCSSLoaded = true;
            } else {
                for (var i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].title === "mobile") {
                        document.styleSheets[i].disabled = false;
                    }
                }
            }
        } else if (window.innerWidth >= 713 && window.g.mobile) {
            window.g.mobile = false;
            for (var i = 0; i < document.styleSheets.length; i++) {
                if (document.styleSheets[i].title === "mobile") {
                    document.styleSheets[i].disabled = true;
                }
            }
        }
    }
    window.addEventListener("resize", resizeListener);
    resizeListener();

    var blinkState = true;
    setInterval(function () {
        var blinks = document.getElementsByClassName("cursor");
        for (var i = 0; i < blinks.length; i++) {
            blinks[i].style.visibility = blinkState ? "visible" : "hidden";
        }
        blinkState = !blinkState;
    }, 1000);
})();
