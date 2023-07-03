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

import { CookiesProvider, useCookies } from 'react-cookie'

export default function Logout(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const {user, setUser} = useContext(AppContext);
    console.log("User", user)
    const navigator = useNavigate()



    const [cookies, setCookie, removeCookie] = useCookies(['cookies']);


    setCookie("id", undefined, { "path": "/" })
    setCookie("first_name", undefined, { "path": "/" })
    setCookie("last_name", undefined, { "path": "/" })
    setCookie("group", undefined, { "path": "/" })
    setCookie("email", undefined, { "path": "/" })
    setCookie("username", undefined, { "path": "/" })
    setCookie("token", undefined, { "path": "/" })
    setCookie("isLoggedIn", undefined, { "path": "/" })
    setCookie("image", undefined, { "path": "/" })
     
    setUser(
        {
            id: undefined,
            first_name: undefined,
            last_name: undefined,
            username: undefined,
            email: undefined,
            group: undefined,
            token: undefined,
            image: undefined,
            authenticated: false,
        }
    )


    // navigator("/auth/login/")
    navigator("/")

    return (
        <>

            <div className="min-h-full">

            </div>
        </>
    )
}
