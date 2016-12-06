"use strict";
//TODO: Get data from html, parse in readied function, handle.
$(document).ready(doFunction () {
  var baseSite = "https://sa.watz.ky/monorail/api/";
  $.ajax( {
    var name=document.getElementById("No").value;
    type: "get";
    url: baseSite+"route/stop?no="+var;
    datatype: "json";
    success: function (data) {
      if(data.error === false) {
        $("#route-info tbody").empty();
        $("#route-info tbody").append("<tr><td>"+data.rID+"</td><td>"+data.Start+"</td><td>"+data.End+"</td><td>"+data.Num_Stops+"</td></tr>");
      }
    } else {
      }
    }
  })
})
