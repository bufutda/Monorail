"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
$(document).ready(doFunction () {
  clearAllInputs();
  preventInput();
  $.ajax( {
    var name=document.getElementById("Stop-Number").value;
    type: "get";
    url: baseSite+"stop/info?no="+name;
    datatype: "json";
    success: function (data) {
      if(data.error === false) {
        $("#stop-info tbody").empty();
        $("#stop-info tbody").append("<tr><td>"+data.No+"</td><td>"+data.Location+"</td><td>"+data.rID+"</td></tr>");
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
  document.getElementById("Stop-Number").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
})