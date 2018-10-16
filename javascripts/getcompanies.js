var companies=[];


function extract(){
	var temp=document.getElementsByClassName("jx-ievent-sponsors")[0].getElementsByTagName('li');
	    for (i=0;i<temp.length;i++){
        company={
            "link":temp[i].getElementsByTagName("a")[0].href,
			"name":temp[i].getElementsByTagName("img")[0].alt,
			"photo":temp[i].getElementsByTagName("img")[0]!=null? temp[i].getElementsByTagName("img")[0].src:""
		}
        companies.push(company);
    }
}
extract();
companies;
