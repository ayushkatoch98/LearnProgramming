import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput } from 'flowbite-react';
import Alerts from '../../components/Alert';
import axios from 'axios';
import { API_URL } from '../../constant';
import { hideAlert, showAlert} from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../components/AppContext';
import FormGenerator from '../../components/FormGenerator';
import Tab from '../../components/Tabs';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import ModuleHome from '../../components/module/Home';
import CreateModule from '../../components/module/CreateModule';
import CreateAssignment from '../../components/module/CreateAssignment';
import CreateModuleGroup from '../../components/module/Group';
import ModuleView from '../../components/module/Module';
import { buildURL, buildHeader } from '../../utility';
import { COURSE_URL } from '../../constant';
import AssignmentComponent from '../../components/module/Assignment';

export default function Module(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const {user, setUser} = useContext(AppContext);
    const [moduleGroup, setModuleGroup] = useState([])
    console.log("User", user)
    const navigator = useNavigate()
    const { cid } = useParams()


    useEffect(() => {
   
        axios.get(buildURL(COURSE_URL.teacher.group.url.replace("@cid", cid), user), buildHeader(user)).then(res => {
            console.log("response GET", res)
            if (res.data.data.length == 0){
                showAlert(setAlert, "No Groups found", "redirecting in 3 seconds");   
            }
            
            var xx = []
            for (var i = 0; i < res.data.data.length; i++){
                xx.push({id : res.data.data[i].id, value: res.data.data[i].title})
            }

            setModuleGroup( prev => {
                return xx.map(item => {
                    return item;
                })
            })

            
        }).catch(err => {
            console.log("err", err)
        })
    }, []);



    const tabs = [
        // {title: "Home", icon: MdDashboard, children: <ModuleHome setAlert={setAlert}></ModuleHome>, attributes: {}},
        // {title: "Assignments", icon: MdDashboard, children: <CreateAssignment> </CreateAssignment>, attributes: {}},
        {title: "Modules", icon: MdDashboard, children: <ModuleView cid={cid} user={user} setUser={setUser} moduleGroupState={{moduleGroup, setModuleGroup}} setAlert={setAlert}></ModuleView>, attributes: {}},
        {title: "Assignment", icon: MdDashboard, children: <AssignmentComponent cid={cid} user={user} setUser={setUser} moduleGroupState={{moduleGroup, setModuleGroup}} setAlert={setAlert}></AssignmentComponent>, attributes: {}},
        {title: "Grades", icon: MdDashboard, children: <h1> Grades </h1>, attributes: {active: true}},
    ]

    if (user.group.toLowerCase() == "teacher"){
        tabs.push({title: "Create Module Group", icon: MdDashboard, children: <CreateModuleGroup cid={cid} user={user} setUser={setUser} moduleGroupState={{moduleGroup, setModuleGroup}} setAlert={setAlert}></CreateModuleGroup>, attributes: {}})
        tabs.push({title: "Create Module", icon: MdDashboard, children: <CreateModule cid={cid} user={user} setUser={setUser} moduleGroupState={{moduleGroup, setModuleGroup}} setAlert={setAlert}></CreateModule>, attributes: {}})
        tabs.push({title: "Create Assignment", icon: MdDashboard, children: <CreateAssignment cid={cid} user={user} setUser={setUser} moduleGroupState={{moduleGroup, setModuleGroup}} setAlert={setAlert}> </CreateAssignment>, attributes: {}},)
        tabs.push({title: "Grade Students", icon: MdDashboard, children: <h1 className='text-black'>Grade Students</h1>, attributes: {}})
        // tabs.push({title: "Mark Students", icon: MdDashboard, children: <h1 className='text-black'>Hey I am Assignments</h1>, attributes: {}})
        tabs.push({title: "Student Details", icon: MdDashboard, children: <h1 className='text-black'>Student Details</h1>, attributes: {}})
    }

    return (
        <>

            <div className="min-h-full">

                <Navigation></Navigation>
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{props.header}</h1>
                    </div>
                </header>

                <Tab user={user} items={tabs}></Tab>
                
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>

                            {/* <ModuleView cid={cid} user={user} setUser={setUser} moduleGroupState={{moduleGroup, setModuleGroup}} setAlert={setAlert}></ModuleView> */}

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
