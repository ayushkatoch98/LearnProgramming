import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput } from 'flowbite-react';
import Alerts from '../../components/Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../../constant';
import { buildHeader, buildURL, hideAlert, showAlert} from '../../utility';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../components/AppContext';
import Cards from '../../components/Card.jsx';

export default function Dashboard(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const {user, setUser} = useContext(AppContext);
    const [data, setData] = useState([])

    console.log("User", user)
    const navigator = useNavigate()

    useEffect(() => {
        axios.get(buildURL(COURSE_URL.teacher.get, user), buildHeader(user)).then(res => {
            console.log("response", res.data)
            setData(res.data);
        }).catch(err => {
            console.log("err", err)
        })
      }, []);

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

                            <div className='grid grid-cols-4 gap-5'>

                                {
                                    
                                    data.map(item => {
                                        return (
                                            <Cards id={item.id} url="" image={item.image} title={item.title} description={item.description} token={item.token} ></Cards>
                                        )
                                    })
                                }
                     
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
