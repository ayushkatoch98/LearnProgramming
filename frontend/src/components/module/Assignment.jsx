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


export default function AssignmentComponent(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser

    const [modules, setModules] = useState({})
    const [updated, setUpdated] = useState(false)
        
    const navigator = useNavigate()

    function handleDelete(aid){
        
        const data = {
            aid : aid
        }

        const header = buildHeader(user);
        header.data = data

        const url = buildURL(COURSE_URL.teacher.assignment.url.replace("@cid", props.cid), user)
        axios.delete(url, header ).then( res => {
            console.log("Response Del", res)

        }).catch(err => {
            console.log("Response Del", err)

        })


    }
 
    useEffect(() => {
   
        axios.get(buildURL(COURSE_URL.teacher.assignment.url.replace("@cid", props.cid), user), buildHeader(user)).then(res => {
            console.log("response Assignment GET ALL", res)
            const data = {}
            data["Assignments"] = res.data
            data.Assignments[0].group = "Assignments"

            // var data = {}
            // for (var i = 0; i < res.data.length; i++){
            //     var gid = res.data[i].gid + "";
            //     if (!(gid in data))
            //         data[res.data[i].gid] = []
                
            //     data[gid].push(res.data[i])
                
            // }
            // console.log("Formatted Data", data)
        

            setModules(prev => {
                return {
                    ...prev,
                    data
                }
            })

            setUpdated(true)


            
        }).catch(err => {
            console.log("err", err)
        })
    }, []);
    
    console.log("FINAL DATA" , modules)

    return (
        

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>
                            <div className='border p-10 shadow border-solid w-5/6 flex-col gap-4'>

                                { updated ? <DefaultAccordion onDelete={handleDelete} data={modules}></DefaultAccordion> : <></>}
                                
                            </div> 

                        </div>
                    </div>
                </main>
 
        
    )
}
