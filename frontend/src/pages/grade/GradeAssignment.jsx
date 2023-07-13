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
import { Link } from 'react-router-dom';

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


    const downloadUserCode = () => {
        const element = document.createElement("a");
        const file = new Blob([remark.submission.code], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "code.py";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }


    const totalCodeScore = remark.compilation_score + remark.final_cases_score + remark.running_score + remark.test_cases_score
    const inputs = [
        {type: "editor", name: "report_remark", colSpan: "col-span-4", label: "Report Remarks", defaultValue: remark.report_remark, placeholder: "Report remarks", id: "id", ref: reportRemark},
        {type: "number", name: "report_score", colSpan: "col-span-4", label: "Report Remarks", defaultValue: remark.report_score, placeholder: "Report scores", id: "id"},
        {type: "code", hidable: "true", name: "code", disabled: true, value: remark.submission.code, colSpan: "col-span-4", label: "Student Code", placeholder: "User Code Here", id: "id"},
        {type: "editor", hidable: "true", name: "code_remark", colSpan: "col-span-4", label: "Code Remarks", defaultValue: remark.code_remark, placeholder: "Code remarks", id: "id", ref: codeRemark},
        {type: "number", name: "code_quality", colSpan: "col-span-2", label: "Code Quality Score", defaultValue: remark.code_quality, placeholder: "Code quality scores", id: "id"},
        {disabled: true, type: "number", name: "code_score", colSpan: "col-span-2", label: "Code Scores", defaultValue: totalCodeScore, placeholder: "Report scores", id: "id"},
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

                                <Badge style={{padding: "6px"}} className='col-span-1' color={remark.submission.deadline_met ? "success" : "failure"}>
                                    Deadline {remark.submission.deadline_met ? " Met" : " Failed"}
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
{/* 
                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.final_cases_score == 0 ? "failure" : "success" }>
                                    Hidden Cases {remark.final_cases_score == 0 ? "failed" : "passed" }
                                </Badge> */}

                                <Badge style={{padding: "6px"}} className='col-span-1' color={ remark.submission.plag >= 20 ? "failure" : "success" }>
                                    Plag 5% {remark.submission.plag >= 20 ? "failed" : "passed" }
                                </Badge>





                                {
                                    remark.submission.report_submitted ? <Button className={remark.submission.code_submitted == true ? "col-span-2" : "col-span-4"} as={Link} href={API_URL + remark.submission.file}> Download Report</Button> : <></>
                                }

{
                                    remark.submission.code_submitted ? <Button className={remark.submission.report_submitted == true ? "col-span-2" : "col-span-4"} onClick={downloadUserCode}> Download Code</Button> : <></>
                                }
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
