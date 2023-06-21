import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput, FileInput } from 'flowbite-react';
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


export default function CreateModule(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser


    const { moduleGroup, setModuleGroup } = props.moduleGroupState
    
    

    const navigator = useNavigate()

    function handleDelete(e){
        e.preventDefault();
        var url = buildURL(COURSE_URL.teacher.delete, user) + props.cid + "/";

        axios.delete(url, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err.response.data.message, "failure")
        })
        
    }

    function handleSubmit(e){
        e.preventDefault();
    }

       
    function handleModuleCreate(e){
        e.preventDefault();


        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject["is_published"] = e.target.checkbox1.checked

        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        const url = buildURL(COURSE_URL.teacher.module.url.replace("@cid", props.cid), user);
        
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err.response.data.message, "failure")
        })
        
    }

    function onSelectChange(e){
        e.preventDefault();
        const mid = e.target.value
        axios.get(buildURL(COURSE_URL.teacher.module.get.replace("@cid", props.cid).replace("@mid", mid), user), buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err.response.data.message, "failure")
        })
    }
   
    function handleModuleUpdate(e){
        e.preventDefault();


        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject["is_published"] = e.target.checkbox3.checked

        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        const url = buildURL(COURSE_URL.teacher.module.url.replace("@cid", props.cid), user);
        
        axios.put(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err.response.data.message, "failure")
        })
        
    }


    const createModuleForm = [
        // {type: "text", disabled: true, value: tokenValue, name: "nothing", colSpan: "col-span-2", label: "Invite Token", required: true, placeholder: "Course name", id: "id"},
        {type: "select", name: "gid", colSpan: "col-span-1", label: "Select group", placeholder: "Select something", id: "id", options: moduleGroup },
        {type: "text", name: "title", colSpan: "col-span-1", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-1", label: "Upload Module", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox1", cols: "grid-cols-2", options: [{value: "Publish", defaultChecked: true}] },
        // {type: "editor", name: "description", colSpan: "col-span-2", label: "Course Description", placeholder: "Course description", id: "id", resize: true, value: editorValue, onChange: setEditorValue},
        {type: "submit", colSpan: "col-span-2"},
        
    ]

    const updateModuleForm = [
        // {type: "text", disabled: true, value: tokenValue, name: "nothing", colSpan: "col-span-2", label: "Invite Token", required: true, placeholder: "Course name", id: "id"},
        {type: "select", onChange: onSelectChange, name: "aid", colSpan: "col-span-6", label: "Select Assignment to update", placeholder: "Select something", id: "id", options: [{id : 1, value: "Group 1", selected: true},{id : 2, value: "Group 2", selected: false},{id : 3, value: "Group 3", selected: false},{id : 4, value: "Group 4", selected: false} ] },
        {type: "select", name: "gid", colSpan: "col-span-3", label: "Select group", placeholder: "Select something", id: "id", options: [{id : 1, value: "Group 1", selected: true},{id : 2, value: "Group 2", selected: false},{id : 3, value: "Group 3", selected: false},{id : 4, value: "Group 4", selected: false} ] },
        {type: "text", name: "title", colSpan: "col-span-3", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-4", label: "Upload Module", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-2", label: "Publish", placeholder: "placeholder", id: "checkbox3", cols: "grid-cols-2", options: [{value: "one", defaultChecked: true}] },
        // {type: "editor", name: "description", colSpan: "col-span-2", label: "Course Description", placeholder: "Course description", id: "id", resize: true, value: editorValue, onChange: setEditorValue},
        {type: "submit", colSpan: "col-span-1"},
        {type: "button", value: "Delete", colSpan: "col-span-1", color: "failure"}
    ]

    return (
        <>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>
                            <div className='grid grid-cols-4 gap-5'>
          
                                <FormGenerator heading="Create a module" inputs={createModuleForm} handleSubmit={handleModuleCreate} cols=" grid-cols-2 col-span-4">

                                </FormGenerator>

                                {/* <FormGenerator heading="Update a module" inputs={updateModuleForm} handleSubmit={handleModuleUpdate} cols=" grid-cols-6 col-span-2">

                                </FormGenerator> */}
                            </div> 

                        </div>
                    </div>
                </main>
 
        </>
    )
}