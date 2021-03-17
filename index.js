$("a").attr("href", "https://www.bing.com");
alert("Things are about to be changed");

$("h1").text("JS Code Editor");

var x = true;
$("button").click(function () {
  if (x == true) {
    $("h1").css("color", "#9b3675");
    x = false;
  } else {
    $("h1").css("color", "#ff7171");
    x = true;
  }
});

//For executing the code
$(".btn").click(function () {
  var js = editor.getValue(); //http://codemirror.net/doc/manual.html#getValue
  var s = document.createElement("script");
  s.textContent = js; //inne
  document.body.appendChild(s);
});


//O/P handeling console.log
(function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }
})();