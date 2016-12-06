"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
$(document).ready(doFunction () {
  clearAllInputs();
  preventInput();
  $.ajax( {
    var name=document.getElementById("ID").value;
    type: "get";
    url: baseSite+"vehicle/info?id="+name;
    datatype: "json";
    success: function (data) {
      if(data.error === false) {
        $("#vehicle-info tbody").empty();
        $("#vehicle-info tbody").append("<tr><td>"+data.vID+"</td><td>"+data.capacity+"</td><td>"+data.rID+"</td></tr>");
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
  document.getElementById("ID").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
})