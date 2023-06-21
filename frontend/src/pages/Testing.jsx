import { Fragment, useContext, useState, React } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation';
import { Button, Label, TextInput } from 'flowbite-react';
import Alerts from '../components/Alert';
import axios from 'axios';
import { API_URL } from '../constant';
import { hideAlert, showAlert} from '../utility';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import FormGenerator from '../components/FormGenerator';
import Tab from '../components/Tabs';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import CodeEditor from '@uiw/react-textarea-code-editor';
import 'react-quill/dist/quill.snow.css';




export default function Testing(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const {user, setUser} = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()


    const tabs = [
        {title: "Home", icon: MdDashboard, children: <h1 className='text-black'>Hey I am Home</h1>, attributes: {}},
        {title: "Assignments", icon: MdDashboard, children: <h1 className='text-black'>Hey I am Assignments</h1>, attributes: {}},
        {title: "Modules", icon: MdDashboard, children: <h1 className='text-black'>Hey I am Modules</h1>, attributes: {}},
        {title: "Grades", icon: MdDashboard, children: <h1 className='text-black'>Hey I am Grades</h1>, attributes: {active: true}}
    ]
    return (
        <>

            <div className="min-h-full">

                <Navigation></Navigation>
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{props.header}</h1>
                    </div>
                </header>

                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='grid grid-cols-4 w-full h-screen gap-y-0'>
                        <div className='col-span-4 row-span-1 p-2 bg-slate-400'>RUN | TEST | SUBMIT </div>
                        
                        <div className=' row-span-5 bg-red-800  col-span-2'> <h1> Problem Statement </h1> </div>
                        

                        <CodeEditor
                        className=' row-span-5 col-span-2 overflow-auto'
                            language="python"
                            placeholder="Please enter JS code."
                            data-color-mode="dark"
                            padding={5}
                            style={{
                                fontSize: 12,
                                backgroundColor: "#000000",
                                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                color: "white"
                            }}
                        /> 

                        {/* <div className='bg-black absolute bottom-0 left-0 p-3 inhe w-screen col-span-4'> <h1> Problem Statement </h1> </div> */}
                        

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
