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

export default function CourseList(props) {

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
        axios.get(buildURL(COURSE_URL.teacher.course.getAll, user), buildHeader(user)).then(res => {
            console.log("response", res)
            setData(res.data);
        }).catch(err => {
            console.log("err", err)
        })
      }, []);

    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>

                            <div className='grid grid-cols-4 gap-5'>

                                {
                                    
                                    data.map(item => {
                                        return (
                                            <Cards  key={crypto.randomUUID()}  id={item.id} image={item.image} url={`/course/${item.id}`} title={item.title} description={item.description} token={item.token} ></Cards>
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