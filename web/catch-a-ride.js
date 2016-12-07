"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var start=document.getElementById("Starting-Stop-Number").value;
  var end=document.getElementById("Ending-Stop-Number").value;
  clearAllInputs();
  preventInput();
  $.ajax({
    type: "get";
    url: baseSite+"stop/TimeTotal?stop="+start+"&stop="+end;
    datatype: "json";
    success: function (data) {
      data = data.data;
      if(data.error === false) {
        $("#next-stop tbody").empty();
        $("#next-stop tbody").append("<tr><td>"+start+"</td><td>"+end+"</td><td>"+data.Time+"</td></tr>");
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
  document.getElementById("Ending-Stop-Number").value = "";
  document.getElementById("Starting-Stop-Number").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
}
