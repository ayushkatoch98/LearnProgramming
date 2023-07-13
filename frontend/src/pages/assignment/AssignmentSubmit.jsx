import { Fragment, useContext, useState, React, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput, Badge } from 'flowbite-react';
import Alerts from '../../components/Alert';
import axios from 'axios';
import { API_URL, COURSE_URL } from '../../constant';
import { hideAlert, showAlert} from '../../utility';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../components/AppContext';
import FormGenerator from '../../components/FormGenerator';
import Tab from '../../components/Tabs';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import CodeEditor from '@uiw/react-textarea-code-editor';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser'

import { buildHeader, buildURL } from '../../utility';





export default function AssignmentSubmit(props) {

    const [alert, setAlert] = useState({
        title : "",
        description: "",
        color: "",
        hidden: "hidden"
    });

    const {user, setUser} = useContext(AppContext);
    const navigator = useNavigate()

    const [assignmentData, setAssignmentData] = useState({})
    const [output, setOutput] = useState({
        error: false,
        output: ""
    })
    const [submissionStatus, setSubmissionStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const {cid, aid} = useParams()



    useEffect(() => {
        
        axios.get(buildURL(COURSE_URL.student.submission.get.replace("@cid", cid).replace("@aid", aid), user), buildHeader(user)).then(res => {
            
            const data = res.data.data;
            const reportStatus = data.submission.report_submitted
            const codeStatus = data.submission.code_submitted
            const finalStatus = reportStatus + "\n" + codeStatus
            console.log("Assignment Data", data)

            setAssignmentData( prev => {
                return {
                    ...prev,
                    ...data
                }
            })

            setSubmissionStatus(prev => {
                return {
                    ...prev,
                    code : codeStatus,
                    report: reportStatus
                }
            })
            setIsLoading(false);
            
        }).catch(err => {
            console.log("err", err)
        })
    }, []);


    function handleReportSubmit(e){
        e.preventDefault();


        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject["aid"] = aid;
        formObject["request_type"] = "report"
        console.log("sending", formObject)
        

        axios.post(buildURL(COURSE_URL.student.submission.post.replace("@cid", cid).replace("@aid", aid), user) , formObject, buildHeader(user)).then(res => {
            console.log("res" , res)
            showAlert(setAlert, "success", res, "success");
            
        }).catch(err => {
            console.log("err", err)
            showAlert(setAlert, "Something went wrong", err, "failure");
        })

    }
    function handleRun(e){
        e.preventDefault();
    }
    function handleTestRun(e){
        e.preventDefault();
    }
    function handleCodeSubmit(e){
        e.preventDefault();


        var data = {}
        
        data["code"] = $("#userCode").val()
        data["aid"] = aid;
        data["request_type"] = "code"
        console.log("sending", data)
        

        axios.post(buildURL(COURSE_URL.student.submission.post.replace("@cid", cid).replace("@aid", aid), user) , data, buildHeader(user)).then(res => {
            console.log("res" , res)
            // assignmentData.submission.code = res.data.data.ENTIRE_CODE

            // setAssignmentData(prev => {
            //     return {
            //         ...prev,
            //         submission : {
            //             ...prev.submission,
            //             code : res.data.data.ENTIRE_CODE
            //         }
            //     }
            // })

            setOutput(prev => {
                return {
                    ...prev,
                    error : res.data.data.codeError,
                    output : res.data.data.codeOutput
                }
            })
            showAlert(setAlert, "success", res, "success");
        }).catch(err => {
            showAlert(setAlert, "Something went wrong", err, "failure");
            console.log("err", err)
        })
    }


    const uploadAssignmentForm = [
        // {type: "text", disabled: true, colSpan: "col-span-1", value: submissionStatus.report, name: "nothing", label: "Report Status", required: true, placeholder: "Course name", id: "id"},
        // {type: "text", disabled: true, colSpan: "col-span-1", value: submissionStatus.code, name: "nothing", label: "Code Status", required: true, placeholder: "Course name", id: "id"},
        // {type: "hidden", name: "title", colSpan: "col-span-1", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-2", label: "Upload Report", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        // {type: "editor", name: "description", colSpan: "col-span-2", label: "Course Description", placeholder: "Course description", id: "id", resize: true, value: editorValue, onChange: setEditorValue},
        {type: "submit", colSpan: "col-span-2"},
        {type: "hidden", disabled: true, colSpan: "col-span-1", value: aid, name: "aid", label: "", required: true, placeholder: "Course name", id: "id"},
        
    ]

    if (isLoading){
        return <></>
    }

    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>

                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='gap-y-0'>

                        
                        <FormGenerator heading="Upload Asssignment" inputs={uploadAssignmentForm} handleSubmit={handleReportSubmit} cols="m-2 grid-cols-2 col-span-4">
                            <Badge style={{padding: "6px"}} className='col-span-1' color={ submissionStatus.report ? "success" : "warning" }>
                                Report {submissionStatus.report ? "submitted" : "not submitted" }
                            </Badge>
                            <Badge style={{padding: "6px"}} className='col-span-1' color={ submissionStatus.code ? "success" : "warning" }>
                                Code {submissionStatus.code ? "submitted" : "not submitted" }
                            </Badge>
                        
                        </FormGenerator>


                        <div className={` p-2 border border-solid shadow m-2 ${assignmentData.has_code ? "" : "hidden"} `}>

                            {/* <button className='btn bg-failure' onClick={handleRun} type='button'>Run</button> */}
                            {/* <button className='btn bg-failure' onClick={handleTestRun} type='button'>Run Test</button> */}
                            <Button outline color="light" className='btn bg-failure' onClick={handleCodeSubmit} type='button'>Submit Code</Button>

                        </div>
                        
                        <div className={` shadow border border-solid p-5 ${assignmentData.has_code ? "" : "hidden"}`} style={{
                            position: "relative",
                            overflow: "auto",
                            width: "40%",
                            height: "600px",
                            float: "left",
                        }}> 
                        
                        
                            <h1> {assignmentData.code.title} </h1>
                            
                            <p>{ assignmentData.code.description == undefined ? "" : parse(assignmentData.code.description) }</p>
                            
                            {
                                output.output != "" ? 
                                
                                    <>
                                        <h3> <b>Output</b> </h3>
                                    
                                        <Badge className='w-full' style={{padding: "6px"}} color={ output.error ? "failure" : "success" }>
                                            <code>{parse(output.output)}</code>
                                        </Badge>
                                    </>
                                :
                                <></>
                            }
                            
                        
                        </div>
                        

                        <CodeEditor
                            className={`border border-solid shadow m-2  ${assignmentData.has_code ? "" : "hidden"}`}
                                language="python"
                                id='userCode'
                                placeholder="Please enter JS code."
                                value={ assignmentData.submission.code == undefined || assignmentData.submission.code == "" ? "#do not change the import lines, this will break your code\n" + assignmentData.code.imports + "\n\n\n" + assignmentData.code.student_code : assignmentData.submission.code}
                                data-color-mode="dark"
                                padding={30}
                                style={{
                                    width: "59%",
                                    height: "600px",
                                    fontSize: 12,
                                    overflow: "auto",
                                    backgroundColor: "#000000",
                                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                    color: "white"
                                }}
                        /> 

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
