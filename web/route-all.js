"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
$(document).ready(function () {
  preventInput();
  $.ajax( {
    type: "get";
    url: baseSite+"route/all";
    datatype: "json";
    success: function (data) {
      if(data.error === false) {
        $("#route-info tbody").empty();
        for(var i = 0; i < data.length; i++;) {
          $("#route-info tbody").append("<tr><td>"+data.rID+"</td><td>"+data.Start+"</td><td>"+data.End+"</td><td>"+data.Num_Stops+"</td></tr>");
        }
      }
    }  else {
      onError();
    }
  },
  complete:function(){
    allowInput();
  })
}
function onError () {
  $("body").prepend("An error has occurrd.<br><br><br><br>")
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
})