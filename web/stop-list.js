"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var name=document.getElementById("Route-Number").value;
  preventInput();
  $.ajax( {
    type: "get",
    url: baseSite+"route/stops?id="+name,
    datatype: "json",
    success: function (data) {
      if(data.error === false) {
        $("#stop-list tbody").empty();
        data = data.data;
        for(var i = 0; i < data.length; i++) {
          $("#stop-list tbody").append("<tr><td>"+data[i].No+"</td><td>"+data[i].Location+"</td><td>"+data[i].rID+"</td></tr>");
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
  document.getElementById("Route-Number").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
}
