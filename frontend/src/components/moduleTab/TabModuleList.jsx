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


export default function ModuleList(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser
        
    const navigator = useNavigate()

    function handleDelete(mid){
        
        const data = {
            mid : mid
        }

        const header = buildHeader(user);
        header.data = data

        const url = buildURL(COURSE_URL.teacher.module.url.replace("@cid", props.cid), user)
        axios.delete(url, header ).then( res => {
            console.log("Response Del", res)
            showAlert(setAlert, "Deleted", res, "success");

            const newObj = {}
            var modules = props.data.course.modules
            for (var key in modules){
                if (!(key in newObj)){
                    newObj[key] = []
                }
                console.log("loop for key", key)
                for (var i = 0; i < modules[key].length; i++){
                    console.log("Loop for modules key", key, modules[key][i] )
                    if (modules[key][i].id != mid){
                        newObj[key].push(modules[key][i]);
                    }
                }
            }


            console.log("NEW OBJ", newObj);

            props.data.setCourse(prev => {
                return {
                    ...prev,
                    modules: newObj
                }
            })

        }).catch(err => {
            console.log("Response Del", err)
            showAlert(setAlert, "Something went wrong", err, "failure");

        })


    }

 
 
//    console.log("HAHAHAHA", props.mainData.course)


    return (
        

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                            <div className='p-10 border border-solid w-full flex-col gap-4'>

                                <DefaultAccordion onView="none" onGrade="none" onDelete={handleDelete} data={props.data.course.modules}></DefaultAccordion>
                                
                            </div> 

                        </div>
                    </div>
                </main>
 
        
    )
}
