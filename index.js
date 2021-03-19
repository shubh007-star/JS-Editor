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
});
editor.setSize("1366", "600");


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
