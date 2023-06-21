import { $ } from "react-jquery-plugin";

function hideAlert(setAlert){
    setTimeout(function(){
        setAlert( prev => (
            {
                ...prev,
                hidden : "hidden"
            }
        ))
    },3000)
}

function showAlert(setAlert, title, description, color){
    setAlert( prev => (
        {
            ...prev,
            title: title,
            description: description,
            hidden: "",
            color: color 
        }
    ) )
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

export {hideAlert, showAlert, buildURL, buildHeader}