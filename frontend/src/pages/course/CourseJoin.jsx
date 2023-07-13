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


export default function CourseJoin(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    const { user, setUser } = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()
    

    function handleSubmit(e){
        e.preventDefault();


        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        
        console.log("sending", formObject)
        
        var url = buildURL(COURSE_URL.student.courseDetail.post, user);
        console.log("URL is ", url)
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }


    // mandatory attributes 
    // colSpan, label, name, type
    // var titleV = titleValue.slice()
    const inputs = [
        {type: "text", name: "token", colSpan: "col-span-2 sm:col-span-2", label: "Invite Token", required: true, placeholder: "Enter Token", id: "id" },
        {type: "submit", colSpan: "col-span-2", label: ""},
    ]

    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex p-3 items-center flex-col'>

                            <FormGenerator inputs={inputs} handleSubmit={handleSubmit} width="w-full" cols=" grid-cols-2 ">

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
                                    <ReactQuill required name="description" id='texteditor' style={{ height: "300px" }} className='mb-5  border rounded' theme="snow" value={editorValue} onChange={setEditorValue} />;
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
