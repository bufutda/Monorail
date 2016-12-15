"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
$(document).ready(function () {
  preventInput();
  $.ajax( {
    type: "get",
    url: baseSite+"route/all",
    datatype: "json",
    success: function (data) {
      if(data.error === false) {
        $("#route-info tbody").empty();
        data = data.data;
        for(var i = 0; i < data.length; i++) {
          $("#route-info tbody").append("<tr><td>"+data[i].rID+"</td><td>"+data[i].Start+"</td><td>"+data[i].End+"</td><td>"+data[i].Num_Stops+"</td></tr>");
        }
      } else {
      onError();
    }
  },
  complete:function(){
    allowInput();
  }
});
});
function onError () {
  $("body").prepend("An error has occurrd.<br><br><br><br>")
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
}
