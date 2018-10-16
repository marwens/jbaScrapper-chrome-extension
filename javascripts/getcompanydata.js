var companydata;


function extract() {
    var temp = document.getElementsByClassName('wpb_wrapper')[0].getElementsByTagName('p')[1].innerText.split('\n')
    companydata = {
        "website": "",
        "phone": "",
        "email": "",
        "address": "none",

    }
    for (i=0;i<temp.length;i++){
        if(temp[i].indexOf('Phone:')>=0){
            companydata['phone'] = temp[i].split('Phone:')[1].trim(' ');
        }
        else if(temp[i].indexOf('Contact Name:')>=0){
            companydata['address'] = temp[i].split('Contact Name:')[1].trim(' ');
        }
        else if(temp[i].indexOf('Website:')>=0){
            companydata['website'] = temp[i].split('Website:')[1].trim(' ');
        }
        else if(temp[i].indexOf('Email:')>=0){
            companydata['email'] = temp[i].split('Email:')[1].trim(' ');
        }
        else{

        }
    }

}
extract();
companydata;


