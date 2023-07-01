import { Fragment, createRef, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput, FileInput, Spinner } from 'flowbite-react';
import Alerts from '../../components/Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../../constant';
import { buildHeader, buildURL, hideAlert, showAlert } from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../components/AppContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormGenerator from '../../components/FormGenerator';
import DefaultList from '../../components/List';
// import { Button, Label, } from 'flowbite-react';


export default function AssignmentSubmission(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    const {cid, aid} = useParams()
  
    const { user, setUser } = useContext(AppContext);

    const [submissions, setSubmissionsData] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
  

    useEffect(() => {
        axios.get(buildURL(COURSE_URL.teacher.submission.url.replace("@cid", cid).replace("@aid", aid), user), buildHeader(user)).then(res => {
          
            console.log("response GET", res)
            const totalStudents = res.data.data.total_students;
            const totalSubmissions = res.data.data.total_submissions;
            const data = res.data.data.data;
            console.log("NEW DATA", data);

            setSubmissionsData(prev => {
                return {
                    ...prev,
                    totalStudents: totalStudents,
                    totalSubmissions: totalSubmissions,
                    data: data
                }

            })
            setIsLoaded(true)
        }).catch(err => {
            console.log("err", err)
        })
    }, []);

    
    if (!isLoaded) return <></>
    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>


                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>

                        { 
                            submissions.data.length == 0 ? 
                                <h1 className=''> No submissions found </h1> 
                            
                            : 
                            
                                <DefaultList cid={cid} aid={aid} onView={submissions.data.id} data={submissions.data}></DefaultList>
                            
                            
                        } 

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
