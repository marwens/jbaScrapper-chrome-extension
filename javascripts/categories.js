var categories=[];

extract();
categories;

function extract(){
    var temp=document.getElementsByClassName("jx-ievent-sponsors")[0].getElementsByTagName("li");
    for (i=0;i<temp.length;i++){
        category={
            "link":temp[i].getElementsByTagName('a')[0].href,
            "name":temp[i].getElementsByTagName('img')[0].alt
        }
        categories.push(category);
    }
}
