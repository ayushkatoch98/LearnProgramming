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
import parse from 'html-react-parser'
import FormGenerator from '../../components/FormGenerator';
// import { Button, Label, } from 'flowbite-react';


export default function ModuleHome(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser
    

    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")
    
    

    useEffect(() => {

        axios.get(buildURL(COURSE_URL.teacher.get, user) + props.cid + "/", buildHeader(user)).then(res => {
            if (res.data.length == 0){
                showAlert(setAlert, "Course doesnt exists", "redirecting in 3 seconds");
            }
            console.log("response GET", res.data[0])
            setDescription(res.data[0].description)
            setTitle(res.data[0].title)
            console.log("description", res.data[0].description)
        }).catch(err => {
            console.log("err", err)
        })
    }, []);

    
    return (
        <>

                <main>
                    <div className="text-black mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-start flex-col'>

                            <h2 className='text-4xl mb-5'>{title}</h2>
                            {parse(description)}

                        </div>
                    </div>
                </main>
        </>
    )
}
