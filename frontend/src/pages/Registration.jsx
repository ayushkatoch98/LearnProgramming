import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation';
import { Button, Label, TextInput } from 'flowbite-react';
import Alerts from '../components/Alert';
import axios from 'axios';
import { API_URL } from '../constant';
import { hideAlert } from '../utility';
import { useNavigate } from 'react-router-dom';
import FormGenerator from '../components/FormGenerator';

export default function Registration(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const navigator = useNavigate()

    function handleSubmit(e){
        e.preventDefault();
        
        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject["username"] = formObject["email"]
        console.log("sending", formObject)
        
        axios.post(API_URL + "auth/register/", formObject).then((res) => {
            setAlert( prev => (
                {
                    ...prev,
                    title: "Success",
                    description: res.data.message,
                    hidden: "",
                    color: "success" 
                }
            ) )
            hideAlert(setAlert);
            navigator("/auth/login/")
        }).catch((err) => {
            console.log(err)
            setAlert( prev => (
                    {
                        ...prev,
                        title: "Error",
                        description: err.response.data.message,
                        color: "failure",
                        hidden: ""
                    }
                ))
            hideAlert(setAlert);
        })

    }

    const inputs = [
        {type: "text", name: "first_name", colSpan: "col-span-1", label: "First Name", required: true, placeholder: "John", id: "first_name" },
        {type: "text", name: "last_name", colSpan: "col-span-1", label: "Last Name", required: true, placeholder: "Smith", id: "last_name" },
        {type: "email", name: "email", colSpan: "col-span-1", label: "Email", required: true, placeholder: "john@gmail.com", id: "email"},
        {type: "password", name: "password", colSpan: "col-span-1", label: "Password", placeholder: "Password", id: "password"},
        {type: "submit", colSpan: "col-span-1", label: ""},
    ]
    return (
        <>

            <div className="min-h-full">

                <Navigation></Navigation>
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{props.header}</h1>
                        {/* <p className="tracking-tight text-gray-900">{props.header}</p> */}
                    </div>
                </header>
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>
                            
                            <FormGenerator inputs={inputs} handleSubmit={handleSubmit} width="w-2/6" cols=" grid-cols-1">

                            </FormGenerator>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
