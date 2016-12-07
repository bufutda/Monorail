"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var name=document.getElementById("Stop-Number").value;
  clearAllInputs();
  preventInput();
  $.ajax( {
    type: "get",
    url: baseSite+"stop/prev?no="+name,
    datatype: "json",
    success: function (data) {
      data = data.data;
      if(data.error === false) {
        $("#prev-stop tbody").empty();
        $("#prev-stop tbody").append("<tr><td>"+data.No+"</td><td>"+data.Location+"</td><td>"+data.rID+"</td></tr>");
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
  document.getElementById("Stop-Number").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
}
