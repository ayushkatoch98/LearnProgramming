import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../Navigation';
import { Button, Label, TextInput, FileInput } from 'flowbite-react';
import Alerts from '../Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../../constant';
import { buildHeader, buildURL, hideAlert, showAlert } from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../AppContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormGenerator from '../FormGenerator';
// import { Button, Label, } from 'flowbite-react';


export default function CreateModule(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser


    
    

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
        
        const url = buildURL(COURSE_URL.teacher.module.post.replace("@cid", props.cid), user);
        
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")

            const newModules = {}
            newModules[formObject.gid] = []
            // giving error when creating new group + group doesnt show in the frontend
            for (var key in props.data.course.modules){
                console.log("Group Loop", key)
                if (!(key in newModules)){
                    newModules[key] = []
                    console.log("KEYS" , newModules)
                }
                for(var i = 0; i < props.data.course.modules[key].length; i++){
                    console.log("ADD TO KEY", key)
                    newModules[key].push(props.data.course.modules[key][i]);
                }
            }

            newModules[res.data.data.group.id + ""].push( 
                {   
                    ...res.data.data
                } 
            );
            props.data.setCourse(prev => {
                return {
                    ...prev,
                    modules: newModules
                }
            })

        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
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
        formObject["is_published"] = e.target.checkbox2.checked
        formObject.mid = parseInt(formObject.mid)
        formObject.gid = parseInt(formObject.gid)
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))


        
        const url = buildURL(COURSE_URL.teacher.module.put.replace("@cid", props.cid), user);
        console.log(url)
        
        axios.put(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")

            const newModules = {}
            newModules[formObject.gid] = []
            // giving error when creating new group + group doesnt show in the frontend
            for (var key in props.data.course.modules){
                console.log("Group Loop", key)
                if (!(key in newModules)){
                    newModules[key] = []
                    console.log("KEYS" , newModules)
                }
                for(var i = 0; i < props.data.course.modules[key].length; i++){
                    console.log("ADD TO KEY", key)
                    
                    if (res.data.data.id == props.data.course.modules[key][i].id) continue

                    newModules[key].push(props.data.course.modules[key][i]);
                }
            }

            if ( !(res.data.data.group.id in newModules) ){
                newModules[res.data.data.group.id + ""] = []
            }

            newModules[res.data.data.group.id + ""].push(res.data.data)

       
            props.data.setCourse(prev => {
                return {
                    ...prev,
                    modules: newModules
                }
            })

        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }



    const allModules = []
    var modulesList = props.data.course.modules;

    for(var key in modulesList){

        for(var i = 0; i < modulesList[key].length; i++){
            allModules.push(modulesList[key][i])
        }
    }


    const createModuleForm = [
        {type: "select", name: "gid", colSpan: "col-span-4 sm:col-span-1", label: "Select group", placeholder: "Select something", id: "id", options: props.data.course.moduleGroups },
        {type: "text", name: "title", colSpan: "col-span-4 sm:col-span-1", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-4 sm:col-span-1", label: "Upload Module", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-4 sm:col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox1", cols: "grid-cols-2", options: [{value: "Publish", defaultChecked: true}] },
        {type: "submit", colSpan: "col-span-4 sm:col-span-2"},  
    ]

    const updateModuleForm = [
        {type: "select", name: "mid", colSpan: "col-span-4 sm:col-span-2", label: "Select Module", placeholder: "Select something", id: "id", options: allModules },
        {type: "select", name: "gid", colSpan: "col-span-4 sm:col-span-1", label: "Select group", placeholder: "Select something", id: "id", options: props.data.course.moduleGroups },
        {type: "text", name: "title", colSpan: "col-span-4 sm:col-span-1", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-4 sm:col-span-1", label: "Upload Module", placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-4 sm:col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox2", cols: "grid-cols-2", options: [{value: "Publish", defaultChecked: true}] },
        {type: "submit", colSpan: "col-span-1 sm:col-span-1"},  
        {type: "button", colSpan: "col-span-1 sm:col-span-1", color: "failure", value: "Delete"}
    ]

  
    return (
        <>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                            <div className='grid grid-cols-4 p-4 gap-5'>
          
                                <FormGenerator heading="Create a module" inputs={createModuleForm} handleSubmit={handleModuleCreate} cols=" grid-cols-2 col-span-4 sm:col-span-2">

                                </FormGenerator>

                                <FormGenerator heading="Update a module" inputs={updateModuleForm} handleSubmit={handleModuleUpdate} cols=" grid-cols-2 col-span-4 sm:col-span-2">

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
