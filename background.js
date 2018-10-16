
var i=0;
var tax=0;
var myresultArray = [];
var Categories=[];

var running=false;
var CompanyArray=[];

chrome.browserAction.onClicked.addListener(function(tab) {
    tax=tab.id;
    console.log(tab)
    if (!running) {
        running=true;
        chrome.browserAction.setIcon({path:"/images/play.jpg"});
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            if(changeInfo.url&&tabId==tax){
                console.log(changeInfo.url)
                chrome.browserAction.setIcon({path:"/images/pause.png"});
                if (changeInfo.url.indexOf("https://www.jba.asn.au/members/?category")==0){//scrap conpanies links
                console.log("scrap conpanies links")
                    chrome.tabs.executeScript(tax,{file: "/javascripts/getcompanies.js"},receiveCompanies);
                
                }
                
                else if (changeInfo.url.indexOf("https://www.jba.asn.au/members/?subcategory")==0){  //scrap conpanies data
                    chrome.tabs.executeScript(tax,{file: "/javascripts/getcompanydata.js"},receiveCompanydata);
                } 
                else if(changeInfo.url.indexOf("https://www.jba.asn.au/members/")==0){//scrape categories
                        chrome.tabs.executeScript(tax,{file: "/javascripts/categories.js"},receiveCategories);
                    }
                    
                else{alert("please Help")}
            }
        });     
    }else{
        running=false;
        tax=0;
        chrome.browserAction.setIcon({path:"/images/play.jpg"});
        console.log(JSON.stringify(CompanyArray));
        download("export.csv",convert(CompanyArray))
        CompanyArray=[];

    }
    
});

indexcategory=0;
indexCompany=0;
function receiveCompanydata(data){
    CompanyArray[indexCompany]["email"]=data[0].email;
    CompanyArray[indexCompany]["address"]=data[0].address;
    CompanyArray[indexCompany]["phone"]=data[0].phone,
    CompanyArray[indexCompany]["website"]=data[0].website;
    
    indexCompany++
    if (indexcategory<CompanyArray.length){
        chrome.tabs.update( tax, {url: CompanyArray[indexCompany].link}, )
    }
    else{//we got all the 
        running=false;
        tax=0;
        chrome.browserAction.setIcon({path:"/images/play.jpg"});
        console.log(JSON.stringify(CompanyArray));
        download("export.csv",convert(CompanyArray))
        CompanyArray=[];
    }
}

function receiveCategories(resultsArray){
	console.log(resultsArray)
    for (var i = 0; i < resultsArray[0].length; i++) {
    	Categories.push(resultsArray[0][i]);
    }  
    getnext();    
}
function getnext(){
    chrome.tabs.update( tax, {url: Categories[indexcategory].link}, )
}
function receiveCompanies(data){
    for (var i = 0; i < data[0].length; i++) {
        x={
            "name":data[0][i].name,
            "link":data[0][i].link,
            "categorie":Categories[indexcategory].name,
            "email":"",
            "address":"",
            "phone":"",
            "website":"",
            "photo":data[0][i].photo
        }
    	CompanyArray.push(x);
    }  
    indexcategory++
    if (indexcategory<Categories.length){        
    //if (indexcategory<3){
        getnext();
    }
    else{//we got all the 
        chrome.tabs.update( tax, {url: CompanyArray[indexCompany].link}, )
    }
}


//tabs.executeScript() returns the results of the executed script
//  in an array of results, one entry per frame in which the script
//  was injected.
function receiveText(resultsArray){
	console.log(resultsArray.length)
    for (var i = 0; i < resultsArray[0].length; i++) {
    	myresultArray.push(resultsArray[0][i]);
    }  
    
}

function convert(json) {
    
    // Find the largest element
    var largestEntry = 0;
    var header;
    for(var i=0; i<json.length; i++){
        if (!Object.keys) {
            Object.keys = function(obj) {
                var keys = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        keys.push(i);
                    }
                }
                return keys;
            };
        }
        if(Object.keys(json[i]).length > largestEntry){
            largestEntry = Object.keys(json[i]).length;
            header = Object.keys(json[i]);
        }
    };
    // Assemble the header
    var convertedjson = "";
    if (typeof Array.prototype.forEach != 'function') {
        Array.prototype.forEach = function(callback){
          for (var i = 0; i < this.length; i++){
            callback.apply(this, [this[i], i, this]);
          }
        };
    }
    header.forEach(function(heading){
        if(convertedjson != "") {
            convertedjson += ",";
        }
        convertedjson += "\"";
        convertedjson += heading
        convertedjson += "\"";
    });
    convertedjson += "\r\n";
    // Iterate through the header for all elements
    json.forEach(function(entry){
        header.forEach(function(heading){
            convertedjson += "\"";
            convertedjson += (entry[heading] || "");
            convertedjson += "\"";
            convertedjson += ",";
        });
        convertedjson = convertedjson.substring(0, convertedjson.length - 1);
        convertedjson += "\r\n";
    });
    return(convertedjson);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


function pushArray(arr, arr2) {
    arr.push.apply(arr, arr2);
}