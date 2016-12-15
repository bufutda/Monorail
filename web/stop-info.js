"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var name=document.getElementById("Stop-Number").value;
  preventInput();
  $.ajax( {
    type: "get",
    url: baseSite+"stop/info?no="+name,
    datatype: "json",
    success: function (data) {
        if(data.error === false) {
        $("#stop-table tbody").empty();
        data = data.data;
        $("#stop-table tbody").append("<tr><td>"+data[0].No+"</td><td>"+data[0].Location+"</td><td>"+data[0].rID+"</td></tr>");
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
