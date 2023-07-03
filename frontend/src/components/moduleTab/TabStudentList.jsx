import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../Navigation';
import { Button, Label, TextInput, FileInput } from 'flowbite-react';
import Alerts from '../Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../../constant';
import { buildHeader, buildURL, hideAlert, showAlert } from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../AppContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HiCloudDownload, HiInbox, HiOutlineAdjustments, HiDocumentDownload, HiTrash, HiDownload, HiEye, HiCheck} from 'react-icons/hi';

import FormGenerator from '../FormGenerator';
import DefaultAccordion from '../Accordion';
import StudentList from '../StudentListAccord';
// import { Button, Label, } from 'flowbite-react';




const people = [
    {
        name: 'Leslie Alexander',
        email: 'leslie.alexander@example.com',
        role: 'Co-Founder / CEO',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        id: 0,
    },
    {
        name: 'Michael Foster',
        email: 'michael.foster@example.com',
        role: 'Co-Founder / CTO',
        imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Dries Vincent',
        email: 'dries.vincent@example.com',
        role: 'Business Relations',
        imageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: null,
    },
    {
        name: 'Lindsay Walton',
        email: 'lindsay.walton@example.com',
        role: 'Front-end Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Courtney Henry',
        email: 'courtney.henry@example.com',
        role: 'Designer',
        imageUrl:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Tom Cook',
        email: 'tom.cook@example.com',
        role: 'Director of Product',
        imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: null,
    },
]

export default function TabStudentList(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser

    const [students, setStudents] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const { cid } = useParams()



    const navigator = useNavigate()


    useEffect(() => {

        axios.get(buildURL(COURSE_URL.teacher.courseDetail.get.replace("@cid", cid), user), buildHeader(user)).then(res => {
            
            setStudents(prev => {
                return {
                    "data": res.data.data
                }
            })

            setIsLoaded(true)


        }).catch(err => {
            console.log("err", err)
        })
    }, []);



    function handleDelete(uid) {

        const data = {
            uid: uid
        }

        const header = buildHeader(user);
        header.data = data

        const url = buildURL(COURSE_URL.teacher.courseDetail.delete.replace("@cid", props.cid), user)
        axios.delete(url, header).then(res => {
            console.log("Response Del", res)
            showAlert(setAlert, "Deleted", res, "success");

            const newStudnetsData = {
                data : []
            }
            const leftUserID = res.data.data.student.user.id

            for (var i = 0; i < students.data.length; i ++){
                if (students.data[i].student.user.id != leftUserID){
                    
                    newStudnetsData.data.push(students.data[i])
                }
            }

            setStudents(prev => {
                return {
                    ...prev,
                    newStudnetsData
                }
            })

        }).catch(err => {
            console.log("Response Del", err)
            showAlert(setAlert, "Something went wrong", err, "failure");

        })


    }




    if (!isLoaded) return <></>
    

    return (


        <main>
            <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                <div className='flex items-left flex-col'>
                    <div className='border shadow border-solid w-full flex-col gap-4'>

                    {
                        students.data.length == 0 ? <><h1 className='p-5'>No students</h1></> : 
                        <StudentList header="Student Details" owner={user} showImage={true} cid={cid} onDelete={handleDelete} onDownload="none" data={students}/>
                    }
            
                    </div>

                </div>
            </div>
        </main>


    )
}
