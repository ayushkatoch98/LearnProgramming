import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from './components/Navigation'
import Registration from './pages/Registration'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import AppContext from './components/AppContext'
import CourseList from './pages/course/CourseList'
import CreateCourse from './pages/course/CourseCreate'
import { CookiesProvider, useCookies } from 'react-cookie'
import CourseJoin from './pages/course/CourseJoin'
import Testing from './pages/Testing'
import Module from './pages/module/ModuleTabs'
import ModuleHome from './components/moduleTab/TabModulehome'
import CodeSubmission from './pages/assignment/AssignmentSubmit'
import CourseCreate from './pages/course/CourseCreate'
import ModuleTabs from './pages/module/ModuleTabs'
import AssignmentSubmit from './pages/assignment/AssignmentSubmit'
import AssignmentSubmission from './pages/grade/AssignmentSubmission'
import GradeAssignment from './pages/grade/GradeAssignment'
import CourseUpdate from './components/moduleTab/CourseUpdate'
const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
    { name: 'Reports', href: '#', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function App() {

    const [cookies, setCookie, removeCookie] = useCookies(['cookies']);

    console.log("COOKIES", cookies)
    const [user, SetUser] = useState(
        {
            id: cookies.id,
            first_name: cookies.first_name,
            last_name: cookies.last_name,
            email: cookies.email,
            group: cookies.group,
            token: cookies.token,
            isLoggedIn: cookies.isLoggedIn,
        }
    )

    const setUser = (obj) => {
        SetUser(prev => ({
            ...prev,
            ...obj
        }))

        setCookie("id", obj.id, { "path": "/" })
        setCookie("first_name", obj.first_name, { "path": "/" })
        setCookie("last_name", obj.last_name, { "path": "/" })
        setCookie("group", obj.group, { "path": "/" })
        setCookie("email", obj.email, { "path": "/" })
        setCookie("username", obj.username, { "path": "/" })
        setCookie("token", obj.token, { "path": "/" })
        setCookie("isLoggedIn", obj.isLoggedIn, { "path": "/" })

    }

    if (user.token == false || user.token == undefined || user.token == null) {
        if (window.location.pathname != "/auth/login/" && window.location.pathname != "/auth/register/")
            window.location.href = "/auth/login/";
    }




    return (
        <>

            <CookiesProvider>
                <AppContext.Provider value={{ user, setUser }}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<CourseList header="Dashboard" />} />
                            <Route path="/testing/" element={<Testing header="Dashboard" />} />
                            <Route path="/auth/register/" element={<Registration header="Create a new account" />} />
                            <Route path="/auth/login/" element={<Login header="Welcome Back!" />} />
                            <Route path="/course/create/" element={<CourseCreate header="Start a new course" />} />
                            <Route path="/course/update/:cid/" element={<CourseCreate header="Update your course" update='true' />} />
                            <Route path="/course/join/" element={<CourseJoin header="Join a new course" />} />
                            <Route path="/course/:cid/" element={<ModuleTabs header="Module" />} />
                            <Route path='/course/:cid/assignment/:aid/submit/' element={<AssignmentSubmit header="Submit Assignment" />}></Route>
                            <Route path='/course/:cid/assignment/:aid/grade/' element={<AssignmentSubmission header="Submission List" />}></Route>
                            <Route path='/course/:cid/submission/:aid/:sid/' element={<GradeAssignment header="Grade Assignment" />}></Route>
                            <Route path='/course/:cid/setting/' element={<CourseUpdate header="Course Settings" />}></Route>
                            
                            {/* <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
                        </Routes>
                    </BrowserRouter>
                </AppContext.Provider>
            </CookiesProvider>

        </>
    )
}
