import { Fragment, useContext, useState } from 'react'
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

export default function Login(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const {user, setUser} = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()

    function handleSubmit(e){
        e.preventDefault();
        
        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        console.log("sending", formObject)
        
        axios.post(API_URL + "auth/login/", formObject).then((res) => {
            console.log("response", res)
            // showAlert(setAlert, "Success", res, "success")
            
            setUser({
                    id: res.data.id,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    username: res.data.username,
                    email: res.data.email,
                    group: res.data.group,
                    token: res.data.token,
                    authenticated: true,
                }
            )
            navigator("/")
        }).catch((err) => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
            setUser(prev => (
                {
                    ...prev,
                    first_name: "",
                    last_name: "",
                    username: "",
                    email: "",
                    group: "",
                    token: "",
                    authenticated: false,
                }
            ))
        })
    }


    const inputs = [
        {type: "email", name: "username", colSpan: "col-span-1", label: "Email", required: true, placeholder: "john@gmail.com", id: "email"},
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
                    </div>
                </header>
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>
                            
                        <FormGenerator inputs={inputs} handleSubmit={handleSubmit} width="w-2/6" cols=" grid-cols-1"></FormGenerator>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
