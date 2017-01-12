var db = openDatabase('notes', '1.0', 'database for notes', 2 * 1024 * 1024),
addBtn = document.getElementById('addBtn');

//create database
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS MYNOTES (id INTEGER PRIMARY KEY ASC, title , note ,data,color)');
});

addBtn.addEventListener('click',clearAlert)

//handle checkbox choose only one
$('input[type="checkbox"]').on('change', function() {
  $('input[type="checkbox"]').not(this).prop('checked', false);
});

//displayAll notes
displayAll();

function clearAlert(){
  document.getElementById('error').style.display ='none';
}

function addNote(){

  var title = document.getElementById('title'),
  note  = document.getElementById('note') ,
  date  = getData() ,
  // NOTE: Not work if use title.value direct inside execute
  title_v = title.value , note_v = note.value ,color  ;

  //get checkbox color
  $("input[name=color]:checked").each( function () {
    color = $(this).val();
  });

  //if empty title or note text
  if(!title_v.trim() || !note_v.trim() ){
    document.getElementById('error').style.display = 'block';
  }else{
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO MYNOTES (title, note ,data,color) VALUES (?, ?, ?, ?)', [title_v,note_v , date,color]);
    });
    document.getElementById('error').style.display ='none';
    $('#myModal').modal('toggle');


    displayLastNote();
  }

  title.value = '';
  note.value ='';

  return false;
}

function displayLastNote() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM MYNOTES ORDER BY id DESC LIMIT 1', [], function (tx, results) {
      var cards = document.getElementById('cards');
      var obj = results.rows.item(0);
      var code =getCard(obj.id,obj.title,obj.note,obj.data,obj.color);
      $('#cards').append(code);
    }, null);
  });
}

function displayAll(){
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM MYNOTES', [], function (tx, results) {
      var len = results.rows.length, i;
      var cards = document.getElementById('cards');
      var code ='';
      for (i = 0; i < len; i++){
        var obj = results.rows.item(i);
        code +=getCard(obj.id,obj.title,obj.note,obj.data,obj.color);
      }
      cards.innerHTML = code;
    }, null);
  });
}

function getCard(id,title,note,date,color){
  return '<div id="'+id+'" class="col-lg-4 col-md-6 col-xs-12 wow bounceInUp" draggable="true" ondragstart="drag(event)">\
  <div class="card" style="background:'+color+';">\
  <div class="title">'+title+'</div>\
  <div class="text">\
  '+note+'\
  </div>\
  <div class="info">data : '+date+' \
  <span class="glyphicon glyphicon-trash icon" onclick="deleteCard('+id+')"></span></div>\
  </div>\
  </div>';
}
function getData(){
  var date   = new Date();
  var month  = date.getMonth()+1;
  var day    = date.getDate();
  var year   = date.getFullYear();
  return day +'/'+month+'/'+year;
}

function deleteCard(id){
  document.getElementById(id).remove();
  removeNote(id);
}

//remove note from database
function removeNote(id){
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM MYNOTES WHERE id = ?', [id]);
  });
}
