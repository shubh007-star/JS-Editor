// initialize the content of the text editor to some Javascript
$("#editor").text(`function echo(m) {\n\treturn m;\n}\nconsole.log(echo("Hello World"));`);

// initialize the editor environment using the CodeMirror library
//refer CodeMirror documentation
var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "javascript",
  theme: "dracula",
  lineNumbers: true,
  smartIndent: true,
  matchBrackets: true,
  closebrackets: true,
  autoCloseBrackets: true,
  showCursorWhenSelecting: true,
  keyMap: "sublime",

  //For autocomplete more, more code at the bottom
  extraKeys: {"Ctrl-Space": "autocomplete"},
  mode: {name: "javascript", globalVars: true},

});
editor.setSize("100%", "100%");


// Override default console functions for our custom Dev Console
// in order to print all our outputs in our integrated console instead of the chrome dev tools console
(function() {
  // store default console functionality before changing them
  default_log = console.log;
  default_clear = console.clear;
  default_error = console.error;
  default_warn = console.warn;

  console.log = function(...args) {
    for (let arg of args) {
      if (typeof arg == 'object') {
        $("#console").append((JSON && JSON.stringify ? JSON.stringify(arg, undefined, 2) : arg) + ' ');
      } else {
        $("#console").append(arg + ' ');
      }
    }
    // Console prompt
    $("#console").append('\n&raquo;  ');

    // So console is always scrolled to the bottom
    $("#console").get(0).scrollTop = $("#console").get(0).scrollHeight;

    // Allow the default console action to happen
    default_log(...args)
  }
  console.error = function(e) {

    $("#console").append("Error: " + e);

    // Console prompt
    $("#console").append('\n&raquo;  ');

    // So console is always scrolled to the bottom
    $("#console").get(0).scrollTop = $("#console").get(0).scrollHeight;

    // Allow the default console action to happen
    default_error(e)
  }
  console.warn = function(w) {
    $("#console").append("Warning: " + w);

    // Console prompt
    $("#console").append('\n&raquo;  ');

    // So console is always scrolled to the bottom
    $("#console").get(0).scrollTop = $("#console").get(0).scrollHeight;

    // Allow the default console action to happen
    default_warn(w)
  }
  console.clear = function() {
    // Console prompt
    $("#console").html("&raquo;  ");
    // Allow the default console action to happen
    default_clear();
  }
  clear = console.clear;
})();

// For our custom clear and execute shortcuts Ctrl-Enter and Ctrl-I
function kbd(e) {
  if (e.key === "i") console.clear();
  if (e.key === "Enter") eval(editor.getValue());
}

window.addEventListener('keydown', function(e) {
  if (e.key === "Control") window.addEventListener('keydown', kbd);
});
window.addEventListener('keyup', function(e) {
  if (e.key === "Control") window.removeEventListener('keydown', kbd);
})
// For phones and devices without a control key
$("[action]").get(0).addEventListener('click', function() {
  eval(editor.getValue());
});
$("[action]").get(1).addEventListener('click', function() {
  console.clear();
});


//JS autocomplete documentation @Codemirror autocomplete feature
if (typeof Promise !== "undefined") {
  var comp = [
    ["here", "hither"],
    ["asynchronous", "nonsynchronous"],
    ["completion", "achievement", "conclusion", "culmination", "expirations"],
    ["hinting", "advise", "broach", "imply"],
    ["function","action"],
    ["provide", "add", "bring", "give"],
    ["synonyms", "equivalents"],
    ["words", "token"],
    ["each", "every"],
  ]

  function synonyms(cm, option) {
    return new Promise(function(accept) {
      setTimeout(function() {
        var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
        var start = cursor.ch, end = cursor.ch
        while (start && /\w/.test(line.charAt(start - 1))) --start
        while (end < line.length && /\w/.test(line.charAt(end))) ++end
        var word = line.slice(start, end).toLowerCase()
        for (var i = 0; i < comp.length; i++) if (comp[i].indexOf(word) != -1)
          return accept({list: comp[i],
                         from: CodeMirror.Pos(cursor.line, start),
                         to: CodeMirror.Pos(cursor.line, end)})
        return accept(null)
      }, 100)
    })
  }

  var editor2 = CodeMirror.fromTextArea(document.getElementById("synonyms"), {
    extraKeys: {"Ctrl-Space": "autocomplete"},
    lineNumbers: true,
    lineWrapping: true,
    mode: "text/x-markdown",
    hintOptions: {hint: synonyms}
  })
}

// experiment
var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});
var input = document.getElementById("select");
function selectTheme() {
  var theme = input.options[input.selectedIndex].textContent;
  editor.setOption("theme", theme);
  location.hash = "#" + theme;
}
var choice = (location.hash && location.hash.slice(1)) ||
             (document.location.search &&
              decodeURIComponent(document.location.search.slice(1)));
if (choice) {
  input.value = choice;
  editor.setOption("theme", choice);
}
CodeMirror.on(window, "hashchange", function() {
  var theme = location.hash.slice(1);
  if (theme) { input.value = theme; selectTheme(); }
});
