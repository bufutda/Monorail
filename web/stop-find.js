"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
$(document).ready(doFunction () {
  clearAllInputs();
  preventInput();
  $.ajax( {
    var name=document.getElementById("Query").value;
    type: "get";
    url: baseSite+"stop/find?q="+name;
    datatype: "json";
    success: function (data) {
      if(data.error === false) {
        $("#prev-stop tbody").empty();
        for(var i = 0; i < data.length; i++) {
          $("#prev-stop tbody").append("<tr><td>"+data.No+"</td><td>"+data.Location+"</td><td>"+data.rID+"</td></tr>");
        }
      }
    } else {
      onError();
    }
  },
  complete:function(){
    allowInput();
  })
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
})
