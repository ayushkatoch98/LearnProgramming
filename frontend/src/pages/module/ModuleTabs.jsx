import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput } from 'flowbite-react';
import Alerts from '../../components/Alert';
import axios from 'axios';
import { API_URL } from '../../constant';
import { hideAlert, showAlert } from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../components/AppContext';
import FormGenerator from '../../components/FormGenerator';
import Tab from '../../components/Tabs';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import ModuleHome from '../../components/moduleTab/TabModulehome';
import CreateModule from '../../components/moduleTab/TabModuleCreate';
import CreateAssignment from '../../components/moduleTab/TabAssignmentCreate';
import CreateModuleGroup from '../../components/moduleTab/TabGroupCreate';
import { buildURL, buildHeader } from '../../utility';
import { COURSE_URL } from '../../constant';
import AssignmentList from '../../components/moduleTab/TabAssignmentList';
import CourseUpdate from '../../components/moduleTab/CourseUpdate';
import ModuleList from '../../components/moduleTab/TabModuleList';
import TabStudentList from '../../components/moduleTab/TabStudentList';
import GradeListStudent from '../../components/moduleTab/TabStudentGrade';

async function loadGroups(user, cid, setAlert, userType) {
    // GET ALL GROUPS 
    try {
        const res = (await axios.get(buildURL(COURSE_URL.teacher.group.url.replace("@cid", cid), user), buildHeader(user)));
        const data = await res.data.data;

        // console.log("response GROUP", data)

        const moduleData = []
        for (var i = 0; i < data.length; i++) {
            moduleData.push(data[i])
        }

        return moduleData

    }
    catch (err) {
        console.log("group data error", err)
        showAlert(setAlert, "Unable to load group data", "", "failure");
        return []
    }
}



async function loadAssignments(user, cid, setAlert, userType) {
    try {
        const url = userType == "teacher" ? COURSE_URL.teacher.assignment.get : COURSE_URL.student.assignment.get
        const res = await axios.get(buildURL(url.replace("@cid", cid), user), buildHeader(user));
        const data = await res.data.data;

        const assignmentData = { "Assignments": [] }

        for (var i = 0; i < data.length; i++) {
            
            var temp = data[i];
            // temp.group = {
            //     title: "Assignments"
            // }
            assignmentData.Assignments.push(temp)
        }

        return assignmentData


    } catch (err) {
        console.log("assignment data error", err)
        showAlert(setAlert, "Unable to load assignment data", "", "failure");
        return []
    }
}

async function loadHome(user, cid, setAlert, userType) {
    try {

        const url = userType == "teacher" ? COURSE_URL.teacher.course.getSingle : COURSE_URL.student.course.getSingle
        const res = await axios.get(buildURL(url.replace("@cid", cid), user), buildHeader(user));
        
        const data = await res.data.data;
        console.log("WOW GOT COURSE", res.data)
        if (data.length == 0) {
            showAlert(setAlert, "Course doesnt exists", "redirecting in 3 seconds");
        }

        return data[0];
    } catch (err) {
        console.log("course data error", err)
        showAlert(setAlert, "Unable to load course data", "", "failure");
        return []
    }
}

async function loadModules(user, cid, setAlert, userType, totalGroups) {
    try {
        const url = userType == "teacher" ? COURSE_URL.teacher.module.get : COURSE_URL.student.module.get
        const res = await axios.get(buildURL(url.replace("@cid", cid), user), buildHeader(user))
        const data = res.data.data;
        
        const moduleData = {}
        for (var i = 0; i < data.length; i++) {

            var gid = data[i].group.id + ""

            if (!(gid in moduleData))
                moduleData[gid] = []

            moduleData[gid].push(data[i])
        }

        return moduleData;
    }
    catch (err) {
        console.log("module data error", err)
        showAlert(setAlert, "Unable to load modules data", "", "failure");
        return []
    }
}

async function loadAllData(user, cid, setAlert, userType) {

    const home = await loadHome(user, cid, setAlert, userType);
    const groups = await loadGroups(user, cid, setAlert, userType);
    const modules = await loadModules(user, cid, setAlert, userType, groups.length);
    const assignments = await loadAssignments(user, cid, setAlert, userType);

    // console.log("home", home, "module", modules, "Groups", groups, "assignments", assignments)
    return {
        home: home,
        modules: modules,
        groups: groups,
        assignments: assignments
    }

}


export default function ModuleTabs(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const [loadingStatus, setLoadingStatus] = useState(false)


    const { user, setUser } = useContext(AppContext);
    const [course, setCourse] = useState({
        title: "",
        description: "",
        assignments: [],
        modules: {},
        moduleGroups: [],
        accepted_domain: "",
    })

    const userType = user.group.toLowerCase()

    const navigator = useNavigate()
    const { cid } = useParams()


    useEffect(() => {
        console.log("User", user)

        loadAllData(user, cid, setAlert, userType).then(res => {
            console.log("LoadAllData Response", res)
            setCourse(prev => {
                return {
                    ...prev,
                    token: res.home.token,
                    title: res.home.title,
                    description: res.home.description,
                    modules: res.modules,
                    assignments: res.assignments,
                    moduleGroups: res.groups,
                    image: res.home.image,
                    accepted_domain: res.home.accepted_domain,
                }
            })

            setLoadingStatus(true)
        })

    }, []);

    var tabs = []
    if (loadingStatus) {
        tabs = [
            { title: "Home", icon: MdDashboard, children: <ModuleHome data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} },
            { title: "Modules", icon: MdDashboard, children: <ModuleList cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} },
            { title: "Assignment", icon: MdDashboard, children: <AssignmentList cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} },
            // {title: "Grades", icon: MdDashboard, children: <h1> Grades </h1>, attributes: {active: true}},
        ]

        if (user.group.toLowerCase() == "teacher") {
            tabs.push({ title: "Create Module Group", icon: MdDashboard, children: <CreateModuleGroup cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} })
            tabs.push({ title: "Create Module", icon: MdDashboard, children: <CreateModule cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} })
            tabs.push({ title: "Create Assignment", icon: MdDashboard, children: <CreateAssignment cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} },)
            // tabs.push({ title: "Grade Students", icon: MdDashboard, children: <h1 className=''>Grade Students</h1>, attributes: {} })
            tabs.push({ title: "Student Details", icon: MdDashboard, children: <TabStudentList cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} })
            tabs.push({ title: "Course Settings", icon: MdDashboard, children: <CourseUpdate cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} })
        }
        else{
            tabs.push({ title: "Grades", icon: MdDashboard, children: <GradeListStudent cid={cid} user={user} setUser={setUser} data={{ course, setCourse }} setAlert={setAlert}/>, attributes: {} })
        }
    }

    if (!loadingStatus) return <></>

    return (
        <>

            <div className="h-full">

                <Navigation header={course.title} image={course.image}></Navigation>

                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <Tab user={user} items={tabs}></Tab>

            </div>
        </>
    )
}
