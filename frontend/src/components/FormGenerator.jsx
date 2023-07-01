import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation';
import { Button, Label, TextInput, FileInput, Select, Radio, Checkbox } from 'flowbite-react';
import Alerts from '../components/Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../constant';
import { buildHeader, buildURL, hideAlert, showAlert } from '../utility';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import ReactQuill from 'react-quill';
import CodeEditor from '@uiw/react-textarea-code-editor';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
// import { Button, Label, } from 'flowbite-react';

export default function FormGenerator(props) {

    const inputs = props.inputs

    function getInputField(type, attributes) {

        switch (type) {
            case "text": {
                return (<TextInput {...attributes} />)
            }
            case "hidden": {
                return (<TextInput {...attributes} />)
            }
            case "number": {
                return (<TextInput {...attributes} />)
            }
            case "password": {
                return (<TextInput {...attributes} />)
            }

            case "email": {
                return (<TextInput {...attributes} />)
            }
            case "editor": {
                return (<ReactQuill {...attributes} className='max-h-30 overflow-auto border border-solid disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 rounded-lg p-2.5 text-sm' theme="snow" />
                )
            }
            case "file": {
                return (<FileInput {...attributes} />
                )
            }
            case "submit": {
                return (
                    <Button type="submit">
                        Submit
                    </Button>
                )
            }
            case "select": {

                return (
                    <Select key={crypto.randomUUID()} {...attributes} >
                        {
                            attributes.options.map(item => {
                                return (
                                    <React.Fragment key={crypto.randomUUID()}>
                                        {
                                            item.selected ?
                                                item?.value == undefined ?
                                                    <option key={crypto.randomUUID()} value={item.id} selected>{item.title}</option> :
                                                    <option key={crypto.randomUUID()} value={item.id} selected>{item.value}</option>
                                                :
                                                item?.value == undefined ?
                                                    <option key={crypto.randomUUID()} value={item.id}>{item.title}</option> :
                                                    <option key={crypto.randomUUID()} value={item.id}>{item.value}</option>
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </Select>
                )
            }
            case "radio": {
                return (
                    <fieldset key={crypto.randomUUID()}
                        className={`max-w-md flex-col grid ${attributes.cols} gap-4`}
                    >

                        {
                            attributes.options.map(item => {
                                return (
                                    <div key={crypto.randomUUID()} className=" border flex items-center gap-2  w-full  disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 rounded-lg p-2.5 text-sm">
                                        <Radio value={item.value} {...attributes} />
                                        <Label>{item.value} </Label>
                                    </div>
                                )
                            })
                        }

                    </fieldset>
                )
            }

            case "checkbox": {
                return (
                    <fieldset key={crypto.randomUUID()}
                        className={`max-w-md flex-col grid ${attributes.cols} gap-4`}
                    >

                        {
                            attributes.options.map(item => {
                                return (
                                    <div key={crypto.randomUUID()} className=" border flex items-center gap-2  w-full  disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 rounded-lg p-2.5 text-sm">
                                        <Checkbox value={item.value} {...attributes} />
                                        <Label>{item.value} </Label>
                                    </div>
                                )
                            })
                        }

                    </fieldset>
                )
            }

            case "button": {
                return (

                    <Button {...attributes} type="button">
                        {attributes.value}
                    </Button>
                )
            }

            case "hr" : {
                return (
                    <hr {...attributes}></hr>
                )
            }

            case "heading": {
                return (<h3 {...attributes} className="mb-2 mt-0 text-2xl font-medium leading-tight  col-span-full">
                    {attributes.value}
                </h3>)
            }

            case "code": {
                return (
                    <CodeEditor
                        {...attributes}
                        language="python"
                        placeholder="Please enter JS code."
                        // onChange={(evn) => attributes.onChange(evn.target.value)}
                        padding={5}
                        style={{
                            fontSize: 12,
                            backgroundColor: "#f5f5f5",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
                )
            }
        }

    }


    return (
        <form onSubmit={props.handleSubmit} className={`border p-10 shadow border-solid flex ${props.width} grid ${props.cols} flex-col gap-4`}>
            <h3 className="mb-2 mt-0 text-2xl font-medium leading-tight  col-span-full">
                {props.heading}
            </h3>
            
            {props.children}

            {
                inputs.map((item, index) => {
                    return (
                        
                      
                        <div key={crypto.randomUUID()} className={` ${item.colSpan} ${ item.type == "hidden" ? "hidden" : "" } `}>
                            
                            <div className={`mb-2 block ${ item.type == "hr" || item.type == "heading" ? "hidden" : "" }`}>
                                <Label
                                    htmlFor="Title"
                                    value={item.label}
                                />
                            </div>


                            {getInputField(item.type, item)}
                        </div>

                    )
                })
            }



        </form>

    )
}
