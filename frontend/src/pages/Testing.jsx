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


    function handleReportSubmit(e){
        e.preventDefault();
    }
    function handleRun(e){
        e.preventDefault();
    }
    function handleTestRun(e){
        e.preventDefault();
    }
    function handleCodeSubmit(e){
        e.preventDefault();
    }


    const tabs = [
        {title: "Home", icon: MdDashboard, children: <h1 className=''>Hey I am Home</h1>, attributes: {}},
        {title: "Assignments", icon: MdDashboard, children: <h1 className=''>Hey I am Assignments</h1>, attributes: {}},
        {title: "Modules", icon: MdDashboard, children: <h1 className=''>Hey I am Modules</h1>, attributes: {}},
        {title: "Grades", icon: MdDashboard, children: <h1 className=''>Hey I am Grades</h1>, attributes: {active: true}}
    ]

    const createModuleForm = [
        // {type: "text", disabled: true, value: tokenValue, name: "nothing", colSpan: "col-span-2", label: "Invite Token", required: true, placeholder: "Course name", id: "id"},
        // {type: "hidden", name: "title", colSpan: "col-span-1", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-1", label: "Upload Report", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        // {type: "checkbox", name: "is_published", colSpan: "col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox1", cols: "grid-cols-2", options: [{value: "Publish", defaultChecked: true}] },
        // {type: "editor", name: "description", colSpan: "col-span-2", label: "Course Description", placeholder: "Course description", id: "id", resize: true, value: editorValue, onChange: setEditorValue},
        {type: "submit", colSpan: "col-span-2"},
        
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
                        <div className='gap-y-0'>

                        <FormGenerator heading="Upload Asssignment" inputs={createModuleForm} handleSubmit={handleReportSubmit} cols="m-2 grid-cols-2 col-span-4">

                        </FormGenerator>


                        <div className=' p-2 border border-solid shadow m-2'>

                            <button className='btn bg-failure' onClick={handleRun} type='button'>Run</button>
                            <button className='btn bg-failure' onClick={handleTestRun} type='button'>Run Test</button>
                            <button className='btn bg-failure' onClick={handleCodeSubmit} type='button'>Submit</button>

                        </div>
                        
                        <div className=' shadow  border border-solid bg-slate-300 p-5 m-2' style={{
                            position: "relative",
                            overflow: "auto",
                            width: "49%",
                            height: "600px",
                            float: "left",
                        }}> <h1> Problem Statement </h1> </div>
                        

                        <CodeEditor
                            className='border border-solid shadow m-2'
                                language="python"
                                placeholder="Please enter JS code."
                                value="KEKEKEK"
                                data-color-mode="dark"
                                padding={20}
                                style={{
                                    width: "49%",
                                    height: "600px",
                                    fontSize: 12,
                                    overflow: "auto",
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
