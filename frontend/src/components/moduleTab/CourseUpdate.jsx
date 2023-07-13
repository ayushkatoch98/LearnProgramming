import { Fragment, createRef, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../Navigation';
import { Button, Label, TextInput, FileInput, Badge } from 'flowbite-react';
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


export default function CourseUpdate(props) {

    const [editorValue, setEditorValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const courseDescription = createRef('//Enter your code below');

    const { cid } = useParams()


    const user = props.user
    const {course, setCourse} = props.data
    console.log("COURSE IS", course)
    const navigator = useNavigate()

    function handleDelete(e) {
        e.preventDefault();

        var url = COURSE_URL.teacher.course.delete.replace("@cid", cid)

        axios.delete(url, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(props.setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(props.setAlert, "Error", err, "failure")
        })

    }

    function handleSubmit(e) {
        e.preventDefault();

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject.description = courseDescription.current.value
        console.log("sending", formObject)
        
        const url = buildURL(COURSE_URL.teacher.course.put.replace("@cid", cid), user)
        console.log("URL is", url);

        axios.put(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            props.data.setCourse(prev => {
                return {
                    ...prev,
                    title: formObject.title,
                    description: formObject.description,
                    accepted_domain: formObject.accepted_domain
                }
            })
            showAlert(props.setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(props.setAlert, "Error", err, "failure")
        })

    }

    function handleCopy(e){
        e.preventDefault();

        axios.post(COURSE_URL.teacher.course.copyCourse.replace("@cid", cid), {}, buildHeader(user)).then(res => {
            console.log("success", res)
            showAlert(props.setAlert, "Success" , res, "success");
        }).catch(err => {
            console.log(err)
            showAlert(props.setAlert, "Success" , err, "failure");
        })
    }



    const inputs = [
        { type: "text", defaultValue: course.title, name: "title", colSpan: "col-span-4", label: "Course Name", required: true, placeholder: "Course name", id: "id" },
        { type: "file", name: "file", colSpan: "col-span-4 sm:col-span-2", label: "Upload Cover Picture", placeholder: "placeholder", id: "id", accept: ".jpg,.jpeg,.png" },
        {type: "text", name: "accepted_domain", defaultValue: course.accepted_domain, colSpan: "col-span-4 sm:col-span-2", label: "Accepted Domain", required: true, placeholder: "Something", id: "id", accept:".jpg,.jpeg,.png" },
        { type: "editor", name: "description", colSpan: "col-span-4", value: course.description, label: "Course Description", placeholder: "Course description", id: "id", resize: true, ref: courseDescription },
        { type: "submit", colSpan: "col-span-1", label: "" },
        { type: "button", colSpan: "col-span-1", value: "Delete", color: "failure", onClick: handleDelete },
        { type: "button", colSpan: "col-span-1", value: "Copy", color: "failure", onClick: handleCopy }
    ]

    return (
        <>

        
                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                        <div className='grid grid-cols-3 p-3 sm:-4 w-full gap-5'>
                            <FormGenerator inputs={inputs} heading="Course Settings" handleSubmit={handleSubmit}  cols=" grid-cols-4 col-span-3 ">

                                <Badge style={{ padding: "15px" }} className='col-span-4'>
                                    Invite Token <b>{course.token}</b>
                                </Badge>


                            </FormGenerator>
                            </div>

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
            
        </>
    )
}
