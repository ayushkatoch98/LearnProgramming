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
import DefaultAccordion from '../Accordion';
// import { Button, Label, } from 'flowbite-react';


export default function AssignmentList(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser

        
    const navigator = useNavigate()

    const {cid} = useParams()

    function handleDelete(aid){
        
        const data = {
            aid : aid
        }

        const header = buildHeader(user);
        header.data = data

        const url = buildURL(COURSE_URL.teacher.assignment.delete.replace("@cid", props.cid), user)
        axios.delete(url, header ).then( res => {
            console.log("Response Del", res)
            showAlert(setAlert, "Deleted", res, "success");

            var newAssignments = []

            for (var i = 0; i < props.data.course.assignments.Assignments.length; i++){
                if (props.data.course.assignments.Assignments[i].id != res.data.data.id){
                    newAssignments.push(props.data.course.assignments.Assignments[i])
                }
            }

            props.data.setCourse(prev => {
                return {
                    ...prev,
                    "assignments" : {
                        "Assignments": newAssignments
                    }
                }
            })

        }).catch(err => {
            console.log("Response Del", err)
            showAlert(setAlert, "Error", err, "failure");

        })



    }
 
 
    

    return (
        

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                            <div className='border p-10 shadow border-solid w-full flex-col gap-4'>

                                <DefaultAccordion header="Assignments" cid={cid} onDelete={handleDelete} onDownload="none" data={props.data.course.assignments}></DefaultAccordion>
                                
                            </div> 

                        </div>
                    </div>
                </main>
 
        
    )
}
