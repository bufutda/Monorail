"use strict";
var baseSite = "https://sa.watz.ky/monorail/api/";
function doFunction () {
  var origin=document.getElementById("origin").value;
  var desc=document.getElementById("desc").value;
  var date=document.getElementById("date").value;
  var startTime=document.getElementById("start").value;
  var start=new Date(date+" "+startTime);
  var endTime=document.getElementById("end").value;
  var end=new Date(date+" "+endTime);
  var stop=document.getElementById("stop").value;
  var meta=document.getElementById("meta").value;
  preventInput();
  $.ajax( {
    type: "get",
    url: baseSite+"delay/add?type=accident&origin="+origin+"&desc="+desc+"&start="+start.getTime()+"&end="+end.getTime()+"&stop="+stop="&meta="+meta,
    datatype: "json",
    success: function (data) {
      if(data.error === false) {
        alert("Delay added!");
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
  document.getElementById("origin").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("date").value = "";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("stop").value = "";
  document.getElementById("meta").value = "";
}
function preventInput() {
  $("#inputPrevention").show();
}
function allowInput() {
  $("#inputPrevention").hide();
}
