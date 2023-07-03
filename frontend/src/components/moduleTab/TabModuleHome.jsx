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
import parse from 'html-react-parser'
import FormGenerator from '../FormGenerator';
// import { Button, Label, } from 'flowbite-react';


export default function ModuleHome(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser
    

    
    return (
        <>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                        
                                <div className='border shadow border-solid w-full h-full p-5 flex-col gap-4'>
                                {/* <h2 className='text-4xl mb-5 col-span-3'>{props.data.course.title}</h2> */}
                                <span className='col-span-3'>
                                    {parse("" + props.data.course.description)}
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
        </>
    )
}
