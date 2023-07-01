import { Fragment, createRef, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Navigation from '../../components/Navigation';
import { Button, Label, TextInput, FileInput, Badge } from 'flowbite-react';
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


export default function GradeAssignment(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    const {cid, aid, sid} = useParams()
  
    const { user, setUser } = useContext(AppContext);
    const reportRemark = createRef('Report Remark');
    const codeRemark = createRef('Code Remark')
    const [remark, setRemark] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    

    
    function handleSubmit(e){
        e.preventDefault();

        var data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());
        formObject.code_remark = codeRemark.current.value
        formObject.report_remark = reportRemark.current.value
        formObject.report_score = parseInt(formObject.report_score)
        console.log("sending", formObject)
        
        const url = buildURL(COURSE_URL.teacher.grade.url.replace("@cid", cid).replace("@aid", aid).replace("@sid", sid))
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res, "success")
        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }

    useEffect(() => {
        axios.get(buildURL(COURSE_URL.teacher.grade.url.replace("@cid", cid).replace("@aid", aid).replace("@sid", sid ), user), buildHeader(user)).then(res => {
          
            console.log("response GET", res)
          
            const data = res.data.data;
            console.log("NEW DATA", data);

            setRemark(prev => {
                return {
                    ...prev,
                    ...data
                }

            })
            setIsLoaded(true)
        }).catch(err => {
            console.log("err", err)
        })
    }, []);

    

    if (!isLoaded) return <></>

    const inputs = [
        {type: "editor", name: "report_remark", colSpan: "col-span-4", label: "Report Remarks", defaultValue: remark.report_remark, placeholder: "Report remarks", id: "id", ref: reportRemark},
        {type: "number", name: "report_score", colSpan: "col-span-4", label: "Report Remarks", defaultValue: remark.report_score, placeholder: "Report scores", id: "id"},
        {type: "code", hidable: "true", name: "code", disabled: true, value: remark.submission.code, colSpan: "col-span-4", label: "Student Code", placeholder: "User Code Here", id: "id"},
        {type: "editor", hidable: "true", name: "code_remark", colSpan: "col-span-4", label: "Code Remarks", defaultValue: remark.code_remark, placeholder: "Code remarks", id: "id", ref: codeRemark},
        {type: "submit", colSpan: "col-span-1", label: ""}
    ]

    if (!remark.submission.assignment.has_code){
        for (var i = 0; i < inputs.length; i++){
            if (inputs[i]?.hidable != undefined){
                inputs[i].type = "hidden"
            }
        }
    }

    return (
        <>

            <div className="min-h-full">

                <Navigation header={props.header}></Navigation>
                <Alerts hidden={alert.hidden} title={alert.title} description={alert.description} color={alert.color}></Alerts>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-center flex-col'>

                        <FormGenerator inputs={inputs} handleSubmit={handleSubmit} width="w-4/6" cols=" grid-cols-4 ">
                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.submission.report_submitted ? "success" : "failure" }>
                                    Report {remark.submission.report_submitted ? "submitted" : "not submitted" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.submission.code_submitted ? "success" : "failure" }>
                                    Code {remark.submission.code_submitted ? "submitted" : "not submitted" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color="failure">
                                    Deadline Failed
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.compilation_score == 0 ? "failure" : "success" }>
                                    Compilation {remark.compilation_score == 0 ? "failed" : "success" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.running_score == 0 ? "failure" : "success" }>
                                    Code Running {remark.running_score == 0 ? "failed" : "success" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.test_cases_score == 0 ? "failure" : "success" }>
                                    Test Cases {remark.test_cases_score == 0 ? "failed" : "passed" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.final_cases_score == 0 ? "failure" : "success" }>
                                    Hidden Cases {remark.final_cases_score == 0 ? "failed" : "passed" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.submission.plag >= 20 ? "failure" : "success" }>
                                    Plag Checked {remark.submission.plag >= 20 ? "failed" : "passed" }
                                </Badge>




                                <Button className='col-span-4' onClick={ () => {window.open(API_URL + remark.submission.file)}} target="_blank">Download Report</Button>
                        </FormGenerator>

                            <div className=''>  

                            Has_code {remark.submission.assignment.has_code + ""} </div>
                            <div className=''> Submission Status  {"Report " + remark.submission.report_submitted + " Code " + remark.submission.code_submitted} </div>


                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
