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


export default function CreateModuleGroup(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser

    
    // const { moduleGroup, setModuleGroup } = props.moduleGroupState
    
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

    function handleGroupCreate(e){
        e.preventDefault()

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject.is_published = e.target.checkbox22.checked
        
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        const url = buildURL(COURSE_URL.teacher.group.url.replace("@cid", props.cid), user);


        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)

            
            props.data.setCourse(prev => {
                return {
                    ...prev,
                    moduleGroups: [...props.data.course.moduleGroups, {id : res.data.data.id, value: res.data.data.title}]
                }
            })
            showAlert(setAlert, "Success", res, "success")

            // setModuleGroup(prev => {
            //     return [...prev, {id: res.data.data.id , value: res.data.data.title}]
            // })
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
    }

    function handleGroupUpdate(e){
        e.preventDefault()

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject.is_published = e.target.checkbox2.checked
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))

        
        
        const url = buildURL(COURSE_URL.teacher.group.url.replace("@cid", props.cid), user);

        axios.put(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")

            const newGroups = []
            for (var i = 0; i < props.data.course.moduleGroups.length; i++){
                if (props.data.course.moduleGroups[i].id == res.data.data.id){
                    newGroups.push({id: res.data.data.id, value: res.data.data.title})
                    continue;    
                }
                newGroups.push(props.data.course.moduleGroups[i])
            }

            props.data.setCourse(prev => {
                return {
                    ...prev,
                    moduleGroups: newGroups
                }
            })

        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err.response.data.message, "failure")
        })
    }
   


    // mandatory attributes 
    // colSpan, label, name, type
    // var titleV = titleValue.slice()
    
    const createGroupForm = [
        {type: "text", name: "title", colSpan: "col-span-2 sm:col-span-2", label: "Enter group title", required: true, placeholder: "Group name", id: "id" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-2 sm:col-span-1", label: "Is Published", id: "checkbox22", options: [{value: "Is Published", defaultChecked: true}]},
        {type: "submit", colSpan: "col-span-2 sm:col-span-2", label: ""}
    ]

    const updateGroupForm = [
        {type: "select", name: "gid", colSpan: "col-span-2 sm:col-span-1", label: "Select group to update", placeholder: "Select something", id: "id1", options: props.data.course.moduleGroups },
        {type: "text", name: "title", colSpan: "col-span-2 sm:col-span-1", label: "Enter group title", required: true, placeholder: "Course name", id: "id2" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-2 sm:col-span-1", label: "Is Published", id: "checkbox2", options: [{value: "Is Published", defaultChecked: true}]},
        {type: "submit", colSpan: "col-span-2 sm:col-span-2", label: ""}
    ]


    return (
        

                <main className=''>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                            <div className=' p-4 grid grid-cols-4 gap-5'>
                                <FormGenerator heading="Create a new Group" inputs={createGroupForm} handleSubmit={handleGroupCreate} cols="grid-cols-2 col-span-4 sm:col-span-2">

                                </FormGenerator>
                                <FormGenerator heading="Update an existing Group" inputs={updateGroupForm} handleSubmit={handleGroupUpdate} cols=" grid-cols-2 col-span-4 sm:col-span-2">

                                </FormGenerator>
                                  
                            </div> 

                        </div>
                    </div>
                </main>
 
        
    )
}
