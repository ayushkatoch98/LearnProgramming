import { $ } from "react-jquery-plugin";
import axios from "axios";
import { ALERT_TIMEOUT } from "./constant";


function hideAlert(setAlert){
    setTimeout(function(){
        setAlert( prev => (
            {
                ...prev,
                hidden : "hidden"
            }
        ))
    }, ALERT_TIMEOUT)
}

function showAlert(setAlert, title, description, color){
    // description is axios response type
    // console.log("UTILITY", description.data);
    var newDescription = description;
    if ((typeof description) != "string"){
     
        // TODO: BAD CODING EXAMPLE DONT CODE LIKE THIS 
        if(description?.data != undefined){

            newDescription = description.data?.message;
                
            if (newDescription == undefined){
                description = description.data?.data?.message
            }

            if (newDescription == undefined){
                newDescription = description.data?.message
            }
            
            if (newDescription == undefined){
                newDescription = "response message is fucked dude x2";
            }    
        
        }
     
        else if (description.response != undefined){

            newDescription = description.response?.data.message
            if (newDescription == undefined){
                newDescription = description.response?.data?.data?.message
            }
            if (newDescription == undefined){
                newDescription = description.response?.data?.message
            }
            if (newDescription == undefined){
                newDescription = description.response?.data?.detail
            }
            if (newDescription == undefined){
                newDescription = "response message is fucked dude";
            }
        }

        else if (description?.message != undefined){
            newDescription = description.message;
        }
           

    }
    setAlert( prev => (
        {
            ...prev,
            title: title,
            description: newDescription,
            hidden: "",
            color: color 
        }
    ))
    hideAlert(setAlert);
}

function str_replace(find, replace, str){
    return str.replace(new RegExp("(" + find.map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}).join("|") + ")", "g"), function(s){ return replace[find.indexOf(s)]});
 }
 
//  $textarea = str_replace(findind, replaceeplace, $textarea);
function buildURL(url, data){

    return url;
    // url = str_replace(["@cid", "@aid", "@gid", "@mid"], [data.cid + "/", data.aid + "/", data.gid + "/", data.mid + "/"], url);
    // return url.replace("@group", user.group.toLowerCase())
}

function buildHeader(user){
    return {
        headers : {
            "content-type": 'multipart/form-data',
            "Authorization": "Token " + user.token
        }
    }
}



function deleteResource(url, setAlert){
    axios.delete(url).then(res => {
        console.log("Deletion Successful", res);

        showAlert(setAlert, "Successfully deleted", "", "success")

    }).catch(err => {
        showAlert(setAlert, "Unable to delete", "Something went wrong", "failure");
        console.log("Deletion Error", err)
    })
}


export {hideAlert, showAlert, buildURL, buildHeader}