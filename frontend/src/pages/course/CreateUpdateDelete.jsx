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


export default function CreateCourse(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    const [editorValue, setEditorValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    
    const {cid} = useParams()
    
    const updateMode = props.update == "true";
    
    console.log("Update mode", updateMode)

    const { user, setUser } = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()

    function handleDelete(e){
        e.preventDefault();
        console.log("running");
        var url = buildURL(COURSE_URL.teacher.delete, user) + cid + "/";

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

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject["description"] = editorValue
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        var url = buildURL(COURSE_URL.teacher.post, user);
        var func = axios.post
        if (updateMode) {
            url = buildURL(COURSE_URL.teacher.put, user) + cid + "/";
            func = axios.put
        }

        func(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err.response.data.message, "failure")
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
        {type: "text", disabled: true, value: tokenValue, name: "nothing", colSpan: "col-span-2", label: "Invite Token", required: true, placeholder: "Course name", id: "id" },
        {type: "text", defaultValue: titleValue, name: "title", colSpan: "col-span-1", label: "Course Name", required: true, placeholder: "Course name", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-1", label: "Upload Cover Picture", required: true, placeholder: "placeholder", id: "id", accept:".jpg,.jpeg,.png" },
        {type: "editor", name: "description", colSpan: "col-span-2", label: "Course Description", placeholder: "Course description", id: "id", resize: true, value: editorValue, onChange: setEditorValue},
        {type: "submit", colSpan: "col-span-1", label: ""}
    ]

    if (updateMode){
        delete inputs[2]["required"]
        inputs.push({type: "button", colSpan: "col-span-1", value: "Delete", color: "failure", onClick: handleDelete})
    }
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
                        <div className='flex items-center flex-col'>

                            <FormGenerator inputs={inputs} handleSubmit={handleSubmit} width="w-4/6" cols=" grid-cols-2 ">

                            </FormGenerator>

                            {/* <form onSubmit={handleSubmit} method='POST' className="flex w-3/6 flex-col gap-4" enctype="multipart/form-data">
                                <div>
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="Title"
                                            value="Course Name"
                                        />
                                    </div>
                                    <TextInput
                                        id="Title"
                                        placeholder="Course Name"
                                        required
                                        type="text"
                                        name='title'
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="texteditor"
                                            value="Course Description"
                                        />
                                    </div>
                                    <ReactQuill required name="description" id='texteditor' style={{ height: "300px" }} className='mb-5 text-black border rounded' theme="snow" value={editorValue} onChange={setEditorValue} />;
                                </div>

                                <div
                                    className="max-w-md"
                                    id="fileUpload"
                                >
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="file"
                                            value="Upload Image"
                                        />
                                    </div>
                                    <FileInput
                                        helperText="Course Background Image"
                                        id="file"
                                        required
                                        name="file"
                                    />
                                </div>

                                <Button type="submit">
                                    Submit
                                </Button>
                            </form> */}

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
