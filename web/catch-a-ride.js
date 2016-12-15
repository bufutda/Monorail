"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var start=document.getElementById("Starting-Stop-Number").value;
  var end=document.getElementById("Ending-Stop-Number").value;
  preventInput();
  $.ajax({
    type: "get",
    url: baseSite+"stop/TimeTotal?start="+start+"&stop="+end,
    datatype: "json",
    success: function (data) {
      if(data.error === false) {
        data = data.data;
        $("#next-stop tbody").empty();
        var date = (new Date(data)).toString();
        $("#next-stop tbody").append("<tr><td>"+start+"</td><td>"+end+"</td><td>"+date+"</td></tr>");
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
