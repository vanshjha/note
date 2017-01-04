//randome background image
var rand = Math.floor((Math.random() * 4) + 1);
var body = document.getElementById('body');
body.style.backgroundImage= "url('images/"+rand+".jpg')";


//drag & drop
function allowDrop(ev) {
ev.preventDefault();
}

function drag(ev) {
ev.dataTransfer.setData("note", ev.target.id);
}

function drop(ev) {
ev.preventDefault();
var data = ev.dataTransfer.getData("note");
document.getElementById(data).remove();
removeNote(data);
}

//init niceScroll
$(document).ready(
  function() {
    $("html").niceScroll();
  }
);

//init wow js
new WOW().init();
