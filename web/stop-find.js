"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var name=document.getElementById("Query").value;
  preventInput();
  $.ajax( {
    type: "get",
    url: baseSite+"stop/find?q="+name,
    datatype: "json",
    success: function (data) {
      if(data.error === false) {
        $("#prev-stop tbody").empty();
        data = data.data;
        for(var i = 0; i < data.length; i++) {
          $("#prev-stop tbody").append("<tr><td>"+data[i].No+"</td><td>"+data[i].Location+"</td><td>"+data[i].rID+"</td></tr>");
        }
      } else {
      onError();
    }
  },
  complete:function(){
    allowInput();
  }
});
}
function onError () {
  clearAllInputs();
  $("body").prepend("An error has occurrd.<br><br><br><br>")
}
function clearAllInputs () {
  document.getElementById("Query").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
}
