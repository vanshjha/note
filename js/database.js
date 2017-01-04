var addBtn = document.getElementById('add');
var db = openDatabase('notes', '1.0', 'database for notes', 2 * 1024 * 1024);

db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS MYNOTES_1 (id INTEGER PRIMARY KEY ASC, title , note ,data)');
});

addBtn.addEventListener('click',addNote);
displayAll();

function addNote(){
  var title = document.getElementById('title'),
      note  = document.getElementById('note') ,
      date  = getData() ,
      // NOTE: Not work if use title.value direct inside execute
      title_v = title.value , note_v = note.value ;

  db.transaction(function (tx) {
     tx.executeSql('INSERT INTO MYNOTES_1 (title, note ,data) VALUES (?, ?, ?)', [title_v,note_v , date]);
  });

  title.value = '';
  note.value ='';

  $('#myModal').modal('toggle');
  displayAll();
}

function removeNote(id){
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM MYNOTES_1 WHERE id = ?', [id]);
  });
}

function displayAll(){
  db.transaction(function (tx) {
   tx.executeSql('SELECT * FROM MYNOTES_1', [], function (tx, results) {
      var len = results.rows.length, i;
      var cards = document.getElementById('cards');
      var code ='';
      for (i = 0; i < len; i++){
        var obj = results.rows.item(i);
        code +=getCard(obj.id,obj.title,obj.note,obj.data);
      }
      cards.innerHTML = code;
   }, null);
});
}

function getCard(id,title,note,date){
  return '<div id="'+id+'" class="col-lg-4 col-md-6 col-xs-12 wow bounceInUp" draggable="true" ondragstart="drag(event)">'
  +'<div class="panel panel-default">'
  +'<div class="panel-heading">'+title+'</div>'
  +'<div class="panel-body"><pre>'
  +note
  +'</pre><hr>'
  +'Data : '+date +'| <span class="glyphicon glyphicon-trash icon" onclick="deleteCard('+id+')"></span>'
  +'</div></div></div>';
}
function getData(){
   var date   = new Date();
   var month  = date.getMonth()+1;
   var day    = date.getDay()+1;
   var year   = date.getFullYear();
   return day +'/'+month+'/'+year;
}
function deleteCard(id){
  document.getElementById(id).remove();
  removeNote(id);
  displayAll();
}
