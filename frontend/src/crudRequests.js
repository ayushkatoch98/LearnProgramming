import axios from "axios";
import { buildHeader } from "./utility";


function createCourse(formData, then, error){

    axios.post("https://google.com", formData, buildHeader()).then(res => {
        then(res)
    }).catch(err => {
        error(err)
    })

}

