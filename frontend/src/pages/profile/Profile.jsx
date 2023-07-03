import { Fragment, createRef, useContext, useEffect, useState } from 'react'
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


export default function Profile(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    // const [editorValue, setEditorValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const courseDescription = createRef('//Enter your code below');
    
    const {cid} = useParams()
    
    const { user, setUser } = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()

    function handleSubmit(e){
        e.preventDefault();

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject.description = courseDescription.current.value
        console.log("sending", formObject)
        
        const url = buildURL(COURSE_URL.teacher.course.post, user);
 
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }

    // useEffect(() => {

    //     axios.get(buildURL(COURSE_URL.teacher.get, user) + cid + "/", buildHeader(user)).then(res => {
    //         if (res.data.length == 0){
    //             showAlert(setAlert, "Course doesnt exists", "redirecting in 3 seconds");
    //             setTimeout(function(){
    //                 navigator("/");
    //             }, 3000)
    //         }
    //         console.log("response GET", res.data[0])
    //         setEditorValue(res.data[0].description)
    //         setTitleValue(res.data[0].title)
    //         setTokenValue(res.data[0].token)
    //         console.log("Title", res.data[0].title)
    //     }).catch(err => {
    //         console.log("err", err)
    //     })
    // }, []);

    const inputs = [
        
        {type: "text", defaultValue: user.first_name, name: "first_name", colSpan: "col-span-1", label: "First Name", required: true, placeholder: "First Name", id: "id" },
        {type: "text", defaultValue: user.last_name, name: "last_name", colSpan: "col-span-1", label: "Last Name", required: true, placeholder: "Last Name", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-1", label: "Upload Profile Picture", required: true, placeholder: "placeholder", id: "id", accept:".jpg,.jpeg,.png" },
        {type: "submit", colSpan: "col-span-2", label: ""}
    ]


    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>
                
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>

                            <FormGenerator heading="Profile Setting" inputs={inputs} handleSubmit={handleSubmit} width="w-4/6" cols=" grid-cols-2 ">

                            </FormGenerator>

                          

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
