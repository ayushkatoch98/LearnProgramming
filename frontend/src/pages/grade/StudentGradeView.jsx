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

export default function StudentGradeView(props) {

    const [alert, setAlert] = useState({
        title: "",
        description: "",
        color: "",
        hidden: "hidden"
    });


    const {cid, aid} = useParams()
  
    const { user, setUser } = useContext(AppContext);
    const reportRemark = createRef('Report Remark');
    const codeRemark = createRef('Code Remark')
    const [remark, setRemark] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)


    
    
    // function handleSubmit(e){
    //     e.preventDefault();

    //     var data = new FormData(e.target);
    //     let formObject = Object.fromEntries(data.entries());
    //     formObject.code_remark = codeRemark.current.value
    //     formObject.report_remark = reportRemark.current.value
    //     formObject.report_score = parseInt(formObject.report_score)
    //     console.log("sending", formObject)
        
    //     const url = buildURL(COURSE_URL.teacher.grade.url.replace("@cid", cid).replace("@aid", aid))
    //     axios.post(url, formObject, buildHeader(user)).then(res => {
    //         console.log("response", res)
    //         showAlert(setAlert, "Success", res, "success")
    //     }).catch(err => {
    //         console.log("error", err)
    //         showAlert(setAlert, "Error", err, "failure")
    //     })
        
    // }

    useEffect(() => {
        axios.get(buildURL(COURSE_URL.student.grade.get.replace("@cid", cid).replace("@aid", aid), user), buildHeader(user)).then(res => {
          
            console.log("response GET", res)
          
            const data = res.data.data;
            console.log("NEW DATA", data);

            setRemark(prev => {
                return {
                    ...prev,
                    ...data,
                    total_code_score: data.compilation_score + data.final_cases_score + data.running_score + data.test_cases_score 
                }

            })
            setIsLoaded(true)
        }).catch(err => {
            console.log("err", err)
            if (err.response.status == 404){
                setRemark(prev => {
                    return null
                })   

                setIsLoaded(true)   
            }
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
      

    const inputs = [
        {disabled: true, type: "number", name: "report_score", colSpan: "col-span-2", label: "Report Scores", defaultValue: remark?.report_score, placeholder: "Report scores", id: "id"},
        {disabled: true, type: "number", name: "code_score", colSpan: "col-span-2", label: "Code Scores (Automatic)", defaultValue: remark?.total_code_score, placeholder: "Report scores", id: "id"},
        {disabled: true, type: "number", name: "code_quality", colSpan: "col-span-2", label: "Code quality scores", defaultValue: remark?.code_quality, placeholder: "Report scores", id: "id"},
        // {disabled: true, type: "hidden", name: "dfds", colSpan: "col-span-6", label: "Code quality scores", defaultValue: remark?.code_quality, placeholder: "Report scores", id: "id"},
        {disabled: true, type: "editor", name: "report_remark", colSpan: "col-span-6", label: "Report Remarks", defaultValue: remark?.report_remark, placeholder: "Report remarks", id: "id", ref: reportRemark},
        {disabled: true, type: "editor", hidable: "true", name: "code_remark", colSpan: "col-span-6", label: "Code Remarks", defaultValue: remark?.code_remark, placeholder: "Code remarks", id: "id", ref: codeRemark},
        // {disabled: true, type: "code", hidable: "true", name: "code", value: remark?.submission.code, colSpan: "col-span-6", label: "Your Code", placeholder: "User Code Here", id: "id"},
        // {disabled: true, type: "submit", colSpan: "col-span-1", label: ""}
    ]

    if (remark != null && !remark.submission.assignment.has_code){
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
                            {
                                remark == null ? <h1>You didnt submit the assignment</h1> :
                            
                        <FormGenerator inputs={inputs} handleSubmit={() => console.log("submit")} width="w-4/6" cols=" grid-cols-6">
                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.submission.report_submitted ? "success" : "failure" }>
                                    Report {remark.submission.report_submitted ? "submitted" : "not submitted" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.submission.code_submitted ? "success" : "failure" }>
                                    Code {remark.submission.code_submitted ? "submitted" : "not submitted" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-2' color={remark.submission.deadline_met ? "success" : "failure"}>
                                    Deadline {remark.submission.deadline_met ? " Met" : " Failed"}
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.compilation_score == 0 ? "failure" : "success" }>
                                    Compilation {remark.compilation_score == 0 ? "failed" : "success" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.running_score == 0 ? "failure" : "success" }>
                                    Code Running {remark.running_score == 0 ? "failed" : "success" }
                                </Badge>

                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.test_cases_score == 0 ? "failure" : "success" }>
                                    Test Cases {remark.test_cases_score == 0 ? "failed" : "passed" }
                                </Badge>
{/* 
                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.final_cases_score == 0 ? "failure" : "success" }>
                                    Hidden Cases {remark.final_cases_score == 0 ? "failed" : "passed" }
                                </Badge> */}

                                <Badge style={{padding: "6px"}} className='col-span-2' color={ remark.submission.plag >= 85 ? "failure" : "success" }>
                                    Plag {remark.submission.plag}%
                                </Badge>
                                
                                <div className='col-span-6'></div>
                                
                                




                                {
                                    remark.submission.report_submitted ? <Button className={remark.submission.code_submitted == true ? "col-span-3" : "col-span-6"} as={Link} href={API_URL + remark.submission.file}> Download Report</Button> : <></>
                                }

{
                                    remark.submission.code_submitted ? <Button className={remark.submission.report_submitted == true ? "col-span-3" : "col-span-6"} onClick={downloadUserCode}> Download Code</Button> : <></>
                                }
                        </FormGenerator>
}

                      
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
