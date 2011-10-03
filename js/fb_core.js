$(document).ready(function () {
    console.log("here");
    setTimeout(init, 5000);
});

function init() {
    console.log("Inited");
    var innr = "  function makeArr() {      var retArr = [];      var lst =  AvailableList.getAvailableIDs();      var lnt = lst.length;      for (var i = 0; i < lnt; i++) {          var st = AvailableList.get(lst[i]);          if (st == AvailableList.ACTIVE || st == AvailableList.IDLE) {              retArr.push(lst[i]);          }      }      return retArr;  }    function logArr(arr){    var lnt = arr.length;    for(var i = 0; i < lnt; i++){    console.log(ChatUserInfos[arr[i]].name);    }}function update(id) {    var myButton = document.getElementById('RL_FB_EXT');    var personObject = new Object();    personObject.logo = ChatUserInfos[id].thumbSrc;    personObject.text = ChatUserInfos[id].name;    myButton.value = JSON.stringify(personObject);    $(myButton).click();}  var RLBuddyList = makeArr();  function sub() {      var cur = makeArr();      var lnt = cur.length;      for (var i = 0; i < lnt; i++) {          if (RLBuddyList.indexOf(cur[i]) < 0) {              update(cur[i]);              break;              }      }                    RLBuddyList = makeArr();  }  Arbiter.subscribe('buddylist/availability-changed', sub);  ";
  
    var scrpt = document.createElement('script');
    scrpt.type = "text/javascript";
    scrpt.innerHTML = innr;

    var butt = document.createElement('input');
    butt.style.display = 'none';
    butt.type = 'button';
    butt.id = 'RL_FB_EXT';
    butt.value = '';

    var bod = document.getElementsByTagName('body')[0];

    $(butt).click(handler);

    bod.appendChild(butt);

    var hd = document.getElementsByTagName("Head")[0];
    hd.appendChild(scrpt);
}

function handler() {
    var obj = JSON.parse(document.getElementById('RL_FB_EXT').value);
    console.log(obj.logo);
    chrome.extension.sendRequest({
        action: 'notify',
        type : 'Facebook',
        text: {
            logo : obj.logo,
            text : obj.text
        }});
}
