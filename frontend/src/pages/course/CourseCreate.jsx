import { Fragment, createRef, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput, FileInput, Badge } from 'flowbite-react';
import Alerts from '../../components/Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../../constant';
import { buildHeader, buildURL, hideAlert, showAlert } from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../components/AppContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormGenerator from '../../components/FormGenerator';
// import { Button, Label, } from 'flowbite-react';


export default function CourseCreate(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    // const [editorValue, setEditorValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const courseDescription = createRef('//Enter your code below');
    
    const {cid} = useParams()
    
    const updateMode = props.update == "true";
    
    console.log("Update mode", updateMode)

    const { user, setUser } = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()

    function handleDelete(e){
        e.preventDefault();
        
        var url = buildURL(COURSE_URL.teacher.delete, user) + cid + "/";

        axios.delete(url, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }

    function handleSubmit(e){
        e.preventDefault();

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject.description = courseDescription.current.value
        console.log("sending", formObject)
        
        const url = buildURL(COURSE_URL.teacher.course.post, user);
 
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            setTokenValue(res.data.data.token)
            showAlert(setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }

    useEffect(() => {
        if (!updateMode) return;

        axios.get(buildURL(COURSE_URL.teacher.get, user) + cid + "/", buildHeader(user)).then(res => {
            if (res.data.length == 0){
                showAlert(setAlert, "Course doesnt exists", "redirecting in 3 seconds");
                setTimeout(function(){
                    navigator("/");
                }, 3000)
            }
            console.log("response GET", res.data[0])
            setEditorValue(res.data[0].description)
            setTitleValue(res.data[0].title)
            setTokenValue(res.data[0].token)
            console.log("Title", res.data[0].title)
        }).catch(err => {
            console.log("err", err)
        })
    }, []);

    // mandatory attributes 
    // colSpan, label, name, type
    // var titleV = titleValue.slice()
    const inputs = [
        // {type: "text", disabled: true, value: tokenValue, name: "nothing", colSpan: "col-span-2", label: "Invite Token", required: true, placeholder: "Course name", id: "id" },
        {type: "text", defaultValue: titleValue, name: "title", colSpan: "col-span-2 sm:col-span-2", label: "Course Name", required: true, placeholder: "Course name", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-2 sm:col-span-1", label: "Upload Cover Picture", required: true, placeholder: "placeholder", id: "id", accept:".jpg,.jpeg,.png" },
        {type: "text", name: "accepted_domain", colSpan: "col-span-2 sm:col-span-1", label: "Upload Cover Picture", required: true, placeholder: "@gmail.com", id: "id", accept:".jpg,.jpeg,.png" },
        {type: "editor", name: "description", colSpan: "col-span-2 sm:col-span-2", label: "Course Description", placeholder: "Course description", id: "id", resize: true, "ref" : courseDescription},
        {type: "submit", colSpan: "col-span-2 sm:col-span-1", label: ""}
    ]


    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>
                
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex p-4 items-center flex-col'>

                            <FormGenerator inputs={inputs} handleSubmit={handleSubmit} width="w-full" cols=" grid-cols-2 ">
                            
                            { tokenValue != "" ? 
                                <Badge className='col-span-2' style={{padding: "15px"}}>
                                    <b>Invite Token:</b> {tokenValue}
                                </Badge>
                                :
                                <></>
                            }
                                                            
                            </FormGenerator>

                          

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
