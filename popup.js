

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function openNewTab(url){
  var win = window.open(url, '_blank');
  win.focus();
}

function addNameToList(name, tabURL){
  chrome.storage.local.get("nameList", function(nameList){
    console.log("asdsdaf", nameList);
    var listOfNames = nameList.nameList;
    if(!listOfNames) {
      listOfNames = [];
    }
    var found=0;
    for (i = 0; i < listOfNames.length; i++){
      if (listOfNames[i].name == name) {
        found++;
      }
    }
    if (found == 0) {
      listOfNames.push({
        'name': name,
        'tabURL': tabURL
      });
    }
    chrome.storage.local.set({'nameList':listOfNames}, function(){
      console.log("Name array saved: ");
      console.log(listOfNames);
    });
  });
}

function saveTabs(name) {
    var tabURL= [];
    chrome.tabs.query({currentWindow: true}, function(tabs) {
      for (i=0; i<tabs.length; i++){
        tabURL.push(tabs[i].url);
      }
      console.log(tabURL);
    });
    renderStatus(name.toString() + " saved!");
    addNameToList(name, tabURL);
    listOutNames(name);
  }

  function openTabs(name){
    chrome.storage.local.get('nameList', function(callBack){
      for(i = 0; i < callBack.nameList.length; i++){
        if(callBack.nameList[i].name == name){
          for(j = 0; j < callBack.nameList[i].tabURL.length; j++){
            window.open(callBack.nameList[i].tabURL[j]);
          }
        break;
        }
      }
    })
  };

  function deleteSingular(name)
  {
    var index = 0;
    chrome.storage.local.get('nameList', function(callBack){
      var newList = [];
      for(i = 0; i < callBack.nameList.length; i++){
        if(callBack.nameList[i].name != name){
          newList.push(callBack.nameList[i]);
        }
      }
      chrome.storage.local.set({'nameList': newList});
      listOutNames();
    });
  }

  function listOutNames() {
  var ul = document.getElementById("list");
  chrome.storage.local.get("nameList", function(callBack){
    for(i = 0; i < callBack.nameList.length; i++)
    {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(callBack.nameList[i].name + "\n"));
      ul.appendChild(li);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var ul = document.getElementById("list");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode("Sets of Tabs\n"));
  listOutNames();
  document.getElementById("save").addEventListener("click", function(){
    name = document.getElementById("userInput").value;
    document.getElementById("userInput").remove();
    document.getElementById("textTitle").remove();
    document.getElementById("open").remove();
    document.getElementById("save").remove();
    document.getElementById("delete").remove();    
    document.getElementById("clear").remove();
    saveTabs(name);
    document.getElementById("list").remove();
  });

  document.getElementById("open").addEventListener("click", function(){
    name = document.getElementById("userInput").value;
    document.getElementById("userInput").remove();
    document.getElementById("textTitle").remove();
    document.getElementById("open").remove();
    document.getElementById("delete").remove();    
    document.getElementById("save").remove();
    document.getElementById("clear").remove();
    openTabs(name);
    document.getElementById("list").remove();
  });

  document.getElementById("clear").addEventListener("click", function(){
    document.getElementById("userInput").remove();
    document.getElementById("textTitle").remove();
    document.getElementById("open").remove();
    document.getElementById("delete").remove();    
    document.getElementById("save").remove();
    document.getElementById("clear").remove();
    document.getElementById("list").remove();
    var emptyList = [];
    chrome.storage.local.set({"nameList": []}, function(){
      console.log("nameList cleared!");
    });
    renderStatus("All lists cleared!");
  });

  document.getElementById("delete").addEventListener("click", function(){
    var name = document.getElementById("userInput").value;
    document.getElementById("userInput").remove();
    document.getElementById("textTitle").remove();
    document.getElementById("open").remove();
    document.getElementById("save").remove();
    document.getElementById("clear").remove();
    document.getElementById("delete").remove(); 
    document.getElementById("list").remove();
    deleteSingular(name);
    renderStatus(name + " Deleted!");
  });
});