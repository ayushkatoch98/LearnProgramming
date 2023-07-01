import { Fragment, createRef, useContext, useEffect, useRef, useState } from 'react'
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
import FormGenerator from '../FormGenerator';
// import { Button, Label, } from 'flowbite-react';


export default function CreateAssignment(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser


    const [codeFormVisibility, setCodeFormVisibility] = useState(false);
    const codeProblem = createRef('');
    const codeSyntax = createRef('//Enter your code below');
    const codeFunctionDef = createRef('//Enter your code below');
    const codeSolution = createRef('//Enter your code below');
    const fromVisi = createRef(true);
    // const [reload, setReload] = useState(true)
    
    
    const navigator = useNavigate()


    function toggleCodeForm(e){
        // e.preventDefault();
        const checked = e.target.checked;
        setCodeFormVisibility(checked);
        // return e;

    }


    function handleSubmit(e){
        e.preventDefault();

        console.log("HMMMMM", codeProblem.current.value, codeFunctionDef.current.value, codeSolution.current.value, codeSyntax.current.value)
        var data = new FormData(e.target);
        const cProblem = codeProblem.current.value;
        const cFuncDef = codeFunctionDef.current.value;
        const cSol = codeSolution.current.value;
        const cSyn = codeSyntax.current.value;

        let formObject = Object.fromEntries(data.entries());
        
        console.log(e.target.checkbox9.checked);
        if (e.target.checkbox9.checked == true && (cProblem == "" || cFuncDef == "" || cSol == "" || cSyn == "")){
            showAlert(setAlert, "Error", "All Fields are mandatory because its a coding assignment", "failure");
            return;
        }
        else{
            formObject.code_compilation_score = 0
            formObject.code_running_score = 0
            formObject.code_test_cases_score = 0
            formObject.code_final_cases_score = 0
        }

    
        formObject.is_published = e.target.checkbox10.checked;
        formObject.assignment_type = e.target.checkbox9.checked == true ? "BOTH" : "REPORT"
        formObject.has_code = e.target.checkbox9.checked
        formObject.code_description = codeProblem.current.value
        // formObject["description"] = codeProblem.current.value
        
        
        
        
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        var url = buildURL(COURSE_URL.teacher.assignment.url.replace("@cid", props.cid), user);
   
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")

            var newAssignments = []

            for (var i = 0; i < props.data.course.assignments.Assignments.length; i++){
                newAssignments.push(props.data.course.assignments.Assignments[i])
            }

            newAssignments.push(res.data.data);

            props.data.setCourse(prev => {
                return {
                    ...prev,
                    "assignments" : {
                        "Assignments": newAssignments
                    }
                }
            })

        }).catch(err => {
            console.log("error", err)
            showAlert(setAlert, "Error", err, "failure")
        })
        
    }


    function toggleCodeView(e){

        if (e.target.checked) {
            // make visible
        }   
        else{
            // make invisible 
        }

    }



    // mandatory attributes 
    // colSpan, label, name, type
    // var titleV = titleValue.slice()


    const createAssignmentForm = [
        // {type: "text", disabled: true, value: tokenValue, name: "nothing", colSpan: "col-span-2", label: "Invite Token", required: true, placeholder: "Course name", id: "id"},
        // {type: "select", name: "gid", colSpan: "col-span-2", label: "Select group", placeholder: "Select something", id: "id", options: [{id : 1, value: "Group 1", selected: true},{id : 2, value: "Group 2", selected: false},{id : 3, value: "Group 3", selected: false},{id : 4, value: "Group 4", selected: false} ] },
        {type: "text", name: "title", colSpan: "col-span-2", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-2", label: "Upload Module", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox10", cols: "grid-cols-1", options: [{value: "Publish", defaultChecked: true}] },
        {type: "checkbox", name: "has_code", colSpan: "col-span-1", label: "Is Coding", placeholder: "placeholder", id: "checkbox9", cols: "grid-cols-1", onChange: toggleCodeView,  ref: fromVisi, options: [{value: "Is coding", defaultChecked:{codeFormVisibility}}] },
        

        // {type: "number", name: "code_compilation_score", colSpan: "col-span-2", label: "presentation", placeholder: "compilation_score", id: "id" },
        // {type: "number", name: "code_running_score", colSpan: "col-span-2", label: "report", placeholder: "running_score", id: "id" },
        // {type: "number", name: "code_test_cases_score", colSpan: "col-span-2", label: "references", placeholder: "test_cases_score", id: "id" },
        // {type: "number", name: "code_final_cases_score", colSpan: "col-span-2", label: "something", placeholder: "final_cases_score", id: "id" },

        {type: "hr", colSpan: "col-span-4"},
        {type: "heading", colSpan: "col-span-4 ", value: "Design Coding Problem"},
        
        {type: "number", name: "code_compilation_score", colSpan: "col-span-1", label: "compilation score", placeholder: "compilation_score", id: "id" },
        {type: "number", name: "code_running_score", colSpan: "col-span-1", label: "running score", placeholder: "running_score", id: "id" },
        {type: "number", name: "code_test_cases_score", colSpan: "col-span-1", label: "test cases score", placeholder: "test_cases_score", id: "id" },
        {type: "number", name: "code_final_cases_score", colSpan: "col-span-1", label: "final cases score", placeholder: "final_cases_score", id: "id" },

        {type: "text", name: "code_title", colSpan: "col-span-4", label: "Code Title", placeholder: "Code Title", id: "id" },
        {type: "editor", name: "description", colSpan: "col-span-2", label: "Problem Statement", placeholder: "Problem Statement", id: "id", resize: "true", ref: codeProblem},
        {type: "code", name: "imports_code", colSpan: "col-span-2", label: "Import Libraries", placeholder: "// Import Libraries here below this line", id: "id", resize: "true", ref: codeSyntax},
        {type: "code", name: "student_code", colSpan: "col-span-2", label: "Function difinition for students", placeholder: "// Give function definition for solution", id: "id", resize: "true", ref: codeFunctionDef},
        {type: "code", name: "solution_code", colSpan: "col-span-2", label: "Write your solution and test cases", placeholder: "// Import Libraries here below this line", id: "id", resize: "true", ref: codeSolution},
        {type: "submit", colSpan: "col-span-2"}
    ]

    const codingForm = [
        {type: "editor", name: "description", colSpan: "col-span-4", label: "Problem Statement", placeholder: "Problem Statement", id: "id", resize: "true", ref: codeProblem},
        {type: "code", name: "description", colSpan: "col-span-4", label: "Import Libraries", placeholder: "// Import Libraries here below this line", id: "id", resize: "true", ref: codeSyntax},
        {type: "code", name: "description", colSpan: "col-span-4", label: "Function difinition for students", placeholder: "// Give function definition for solution", id: "id", resize: "true", ref: codeFunctionDef},
        {type: "code", name: "description", colSpan: "col-span-4", label: "Write your solution and test cases", placeholder: "// Import Libraries here below this line", id: "id", resize: "true", ref: codeSolution},
    ]


    return (
        <>

                <main>
                    <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                            <div className='grid grid-cols-3 gap-5'>
                             
                                <FormGenerator heading="Create an assignment" inputs={createAssignmentForm} handleSubmit={handleSubmit} cols=" grid-cols-4 col-span-3">

                                </FormGenerator>

                                

                            </div> 

                        </div>
                    </div>
                </main>
 
        </>
    )
}
