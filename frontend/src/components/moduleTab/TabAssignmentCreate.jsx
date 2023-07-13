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
import CodeEditor from '@uiw/react-textarea-code-editor';
import 'react-quill/dist/quill.snow.css';
import FormGenerator from '../FormGenerator';
// import { Button, Label, } from 'flowbite-react';
import { $ } from 'react-jquery-plugin';

export default function CreateAssignment(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser
    const sampleImport = `
# dont remove sys import 
import sys
# add your imports below this line
    `
    const sampleCode = `
# example program to find sum of two numbers
def solution(n1, n2):
    return n1 + n2

# each element of the CASES is a sparate test case
# eacher element of the nested list is the 
# argument for the function
CASES = [ [10, 20] , [30,40], [50,60] ]

# each element is the solution / expected output
# for the above CASES
# CASES_OUTPUT = [ 30, 70, 110 ]


# this function returns 2 values 
# test_passed | False if any of the test was failed otherwise True
# message | This could be error / success message 
def main():
    for i in range(0, len(CASES)):
        # if you dont want  to write your own solution code then you can simply do 
        # if student_output == CASES_OUTPUT[i]
        expected_output = solution(CASES[i][0], CASES[i][1])
        student_output = user_function_defined_above(CASES[i][0] , CASES[i][1])

        if (expected_output != student_output):
            # you can also output to console using print()
            # to give students more idea where there code failed
            # example, print('failed for the test case', CASES[i])
            return False, "failed for test " + str(CASES[i])

    return True, "Good Work!!"

# make sure to call the main function 
test_passed, message = main()

# print the message to the user for 
# additional information
# about the execution
print(message)

# if test ever gets failed, always exit
# with the code 3
if not test_passed:
    sys.exit(3)

`

    const [selectedItem , setSelectedItem] = useState(74);
    const [DT, setDatetime] = useState(new Date());
    const [codeFormVisibility, setCodeFormVisibility] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        title: "",
        is_published: true,
        has_code: false,
        code_compilation_score: 0,
        code_running_score: 0,
        code_test_cases_score: 0,
        code_final_cases_score: 0,
        code: {
            title: "",
            description: "",
            compilation_score: 0,
            running_score: 0,
            test_cases_score: 0,
            final_cases_score: 0,
        }
    
    })
    const codeDescription = createRef('');
    const codeImports = createRef('//Enter your code below');
    const codeUserCode = createRef('//Enter your code dsfdsfsdf');
    const datetimeRef = createRef('//Enter your code below');
    const codeSolution = createRef('//Enter your code below');
    const fromVisi = createRef(true);
    const uCodeDescription = createRef('');
    const uCodeImports = createRef('//Enter your code below');
    const uCodeUserCode = createRef('//Enter your code dsfdsfsdf');
    const uDatetimeRef = createRef('//Enter your code below');
    const uCodeSolution = createRef('//Enter your code below');
    const uFromVisi = createRef(true);
    const uSelectInputRef = createRef("IDK")
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

        var data = new FormData(e.target);
        const cDescription = codeDescription.current.value;
        
        const cUserCode = $("#student_code").val() // codeUserCode.current.value;
        const cSolution = $("#solution_code").val() // codeSolution.current.value;
        const cImports = $("#imports_code").val() // codeImports.current.value;

        console.log("DATE TIME", e.target.date.value , e.target.time.value)

        let formObject = Object.fromEntries(data.entries());
        
        console.log(e.target.checkbox9.checked);
        if (e.target.checkbox9.checked == true && (cDescription == "" || cUserCode == "" || cSolution == "" || cImports == "")){
            showAlert(setAlert, "Error", "All Fields are mandatory because its a coding assignment", "failure");
            return;
        }


        formObject.code_compilation_score = parseInt(formObject.code_compilation_score)
        formObject.code_running_score = parseInt(formObject.code_running_score)
        formObject.code_test_cases_score = parseInt(formObject.code_test_cases_score)
        formObject.code_final_cases_score = parseInt(formObject.code_final_cases_score)
        formObject.date = e.target.date.value
        formObject.time = e.target.time.value
        formObject.is_published = e.target.checkbox10.checked;
        formObject.assignment_type = e.target.checkbox9.checked == true ? "BOTH" : "REPORT"
        formObject.has_code = e.target.checkbox9.checked
        formObject.code_description = codeDescription.current.value
        // formObject.user_code = cUserCode
        // formObject.code = cSolution
        // formObject.imports_code = cImports

        formObject.imports_code = $("#imports_code").val()
        formObject.student_code = $("#student_code").val()
        formObject.solution_code = $("#solution_code").val()
        
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        var url = buildURL(COURSE_URL.teacher.assignment.post.replace("@cid", props.cid), user);
        console.log("URL");
    
        axios.post(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")

            var newAssignments = []
    

            if (props.data.course.assignments?.Assignments == undefined){
                props.data.course.assignments["Assignments"] = []
            }

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



    function handleUpdate(e){
        e.preventDefault();

        var data = new FormData(e.target);
        const cDescription = uCodeDescription.current.value;
        const cUserCode = $("#ustudent_code").val() // uCodeUserCode.current.value;
        const cSolution = $("#usolution_code").val() // uCodeSolution.current.value;
        const cImports = $("#uimports_code").val() // uCodeImports.current.value;

        console.log("DATE TIME", e.target.date.value , e.target.time.value)

        let formObject = Object.fromEntries(data.entries());
        console.log("DEFAUKT FORM OBJECt", formObject)
        
        console.log(e.target.checkbox9.checked);
        if (e.target.checkbox9.checked == true && (cDescription == "" || cUserCode == "" || cSolution == "" || cImports == "")){
            showAlert(setAlert, "Error", "All Fields are mandatory because its a coding assignment", "failure");
            return;
        }
        
        formObject.aid = parseInt(formObject.aid)
        formObject.code_compilation_score = parseInt(formObject.code_compilation_score)
        formObject.code_running_score = parseInt(formObject.code_running_score)
        formObject.code_test_cases_score = parseInt(formObject.code_test_cases_score)
        formObject.code_final_cases_score = parseInt(formObject.code_final_cases_score)
        formObject.date = e.target.date.value
        formObject.time = e.target.time.value
        formObject.is_published = e.target.checkbox10.checked;
        formObject.assignment_type = e.target.checkbox9.checked == true ? "BOTH" : "REPORT"
        formObject.has_code = e.target.checkbox9.checked
        formObject.code_description = cDescription
        // formObject.user_code = cUserCode
        // formObject.code = cSolution
        // formObject.imports_code = cImports

        formObject.imports_code = $("#uimports_code").val()
        formObject.student_code = $("#ustudent_code").val()
        formObject.solution_code = $("#usolution_code").val()
        
        console.log("sending", formObject)
        console.log("HEADERS", buildHeader(user))
        
        var url = buildURL(COURSE_URL.teacher.assignment.post.replace("@cid", props.cid), user);
        console.log("URL");
    
        axios.put(url, formObject, buildHeader(user)).then(res => {
            console.log("response", res)
            showAlert(setAlert, "Success", res.data.message, "success")

            var newAssignments = []
        
            for (var i = 0; i < props.data.course.assignments.Assignments.length; i++){
                if (props.data.course.assignments.Assignments[i].id == formObject.aid){
                    // updating
                    newAssignments.push(res.data.data)
                }
                else newAssignments.push(props.data.course.assignments.Assignments[i])
            }

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
            if ($(".codingForm").hasClass("hidden"))
                $(".codingForm").removeClass("hidden")
        }   
        else{
            // make invisible 
            if (!$(".codingForm").hasClass("hidden"))
                $(".codingForm").addClass("hidden")
        }

    }




    function onAssignmentSelect(e){
        console.log("CALLED", e.target.value);
        var selectedAssignment = {}
        for (var i = 0; i < props.data.course.assignments.Assignments.length; i ++){
            if (props.data.course.assignments.Assignments[i].id == e.target.value){
                selectedAssignment = props.data.course.assignments.Assignments[i]
                break
            }
        }
        console.log("SELECTED ASSIGNMENT", selectedAssignment)
        setUpdateFormData(prev => {
            return {
                ...prev,
                ...selectedAssignment
            }
        })
        
        setSelectedItem(e.target.value)
        return e.target

    }
    const createAssignmentForm = [
        {type: "hidden", name: "update", id: "update", value: "false"},
        {type: "text", name: "title", colSpan: "col-span-4 sm:col-span-2", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-4 sm:col-span-2", label: "Upload Module", required: true, placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-4 sm:col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox10", cols: "grid-cols-1", options: [{value: "Publish", defaultChecked: true}] },
        {type: "checkbox", name: "has_code", colSpan: "col-span-4 sm:col-span-1", label: "Is Coding", placeholder: "placeholder", id: "checkbox9", cols: "grid-cols-1", onChange: toggleCodeView,  ref: fromVisi, options: [{value: "Is coding", defaultChecked:"true"}] },
        {type: "datetime", name1: "deadlineDate", name2: "deadlineTime", colSpan: "col-span-4 sm:col-span-2", label: "Assignment Deadline Date", required: true, placeholder: "Assignment Deadline", id1: "date", id2: "time"},
     
        {type: "hr", colSpan: "col-span-4 codingForm col-span-4"},
        {type: "heading", colSpan: "col-span-4 codingForm col-span-4 ", value: "Design Coding Problem"},
        
        {type: "number", defaultValue: 0, name: "code_compilation_score", colSpan: "col-span-4 codingForm sm:col-span-1", label: "compilation score", placeholder: "compilation_score", id: "id" },
        {type: "number", defaultValue: 0, name: "code_running_score", colSpan: "col-span-4 codingForm sm:col-span-1", label: "running score", placeholder: "running_score", id: "id" },
        {type: "number", defaultValue: 0, name: "code_test_cases_score", colSpan: "col-span-4 codingForm sm:col-span-2", label: "test cases score", placeholder: "test_cases_score", id: "id" },
        {type: "hidden", defaultValue: 0, name: "code_final_cases_score", colSpan: "col-span-4 codingForm sm:col-span-2", label: "final cases score", placeholder: "final_cases_score", id: "id" },

        {type: "text", name: "code_title", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Code Title", placeholder: "Code Title", id: "id" },
        {type: "editor", name: "description", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Problem Statement", placeholder: "Problem Statement", id: "id", resize: "true", ref: codeDescription},
        {type: "codeEditor", value: sampleImport, name: "sampleImport", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Import Libraries", placeholder: "// Import Libraries here below this line", id: "imports_code", resize: "true"},
        {type: "codeEditor", name: "student_code", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Function difinition for students", placeholder: "// Give function definition for solution", id: "student_code", resize: "true"},
        {type: "codeEditor", value: sampleCode, name: "solution_code", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Write your solution and test cases", placeholder: "// Import Libraries here below this line", id: "solution_code", resize: "true"},
        {type: "submit", colSpan: "col-span-4 sm:col-span-2"}
    ]

    const updateAssignmentForm = [
        {type: "hidden", name: "update", id: "update", value: "true"},
        // {type: "select", name: "aid", colSpan: "col-span-1", label: "Select group to update", placeholder: "Select something", id: "id1", onChange: onAssignmentSelect, options: props.data.course.assignments.Assignments },
        {type: "select", name: "aid", colSpan: "col-span-4 sm:col-span-4", label: "Select Assignment to update", required: true, placeholder: "Module Title", id: "aiddsfsdf", value: selectedItem, ref: uSelectInputRef, onChange: onAssignmentSelect, options: props.data.course.assignments.Assignments },
        {type: "text", defaultValue: updateFormData.title, name: "title", colSpan: "col-span-4 sm:col-span-2", label: "Module Title", required: true, placeholder: "Module Title", id: "id" },
        {type: "file", name: "file", colSpan: "col-span-4 sm:col-span-2", label: "Upload Module", placeholder: "placeholder", id: "id", accept:".pdf,.ppt,.pptx,.txt" },
        {type: "checkbox", name: "is_published", colSpan: "col-span-4 sm:col-span-1", label: "Publish", placeholder: "placeholder", id: "checkbox10", cols: "grid-cols-1", options: [{value: "Publish", defaultChecked: updateFormData.is_published}] },
        {type: "checkbox", name: "has_code", colSpan: "col-span-4 sm:col-span-1", label: "Is Coding", placeholder: "placeholder", id: "checkbox9", cols: "grid-cols-1", onChange: toggleCodeView,  ref: uFromVisi, options: [{value: "Is coding", defaultChecked: updateFormData.has_code}] },
        {type: "datetime", name1: "deadlineDate", name2: "deadlineTime", colSpan: "col-span-4 sm:col-span-2", label: "Assignment Deadline Date", required: true, placeholder: "Assignment Deadline", id1: "date", id2: "time"},

        {type: "hr", colSpan: "codingForm col-span-4"},
        {type: "heading", colSpan: "codingForm col-span-4 ", value: "Design Coding Problem"},
        
        {type: "number", defaultValue: updateFormData.code.compilation_score, name: "code_compilation_score", colSpan: "col-span-4 codingForm sm:col-span-1", label: "compilation score", placeholder: "compilation_score", id: "id" },
        {type: "number", defaultValue: updateFormData.code.running_score, name: "code_running_score", colSpan: "col-span-4 codingForm sm:col-span-1", label: "running score", placeholder: "running_score", id: "id" },
        {type: "number", defaultValue: updateFormData.code.test_cases_score, name: "code_test_cases_score", colSpan: "col-span-4 codingForm sm:col-span-2", label: "test cases score", placeholder: "test_cases_score", id: "id" },
        {type: "hidden", defaultValue: updateFormData.code.final_cases_score, name: "code_final_cases_score", colSpan: "col-span-4 codingForm sm:col-span-2", label: "final cases score", placeholder: "final_cases_score", id: "id" },

        {type: "text", defaultValue: updateFormData.code.title, name: "code_title", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Code Title", placeholder: "Code Title", id: "id" },
        {type: "editor", value: updateFormData.code.description, name: "description", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Problem Statement", placeholder: "Problem Statement", id: "id", resize: "true", ref: uCodeDescription},
        {type: "codeEditor", value: updateFormData.code.imports, name: "imports_code", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Import Libraries", placeholder: "// Import Libraries here below this line", id: "uimports_code", resize: "true", ref: uCodeImports},
        {type: "codeEditor", value: updateFormData.code.student_code, name: "student_code", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Function difinition for students", placeholder: "// Give function definition for solution", id: "ustudent_code", resize: "true", ref: uCodeUserCode},
        {type: "codeEditor", value: updateFormData.code.solution_code == null ? sampleCode : updateFormData.code.solution_code, name: "solution_code", colSpan: "col-span-4 codingForm sm:col-span-4", label: "Write your solution and test cases", placeholder: "// Import Libraries here below this line", id: "usolution_code", resize: "true", ref: uCodeSolution},
        {type: "submit", colSpan: "col-span-2 sm:col-span-1"},
        {type: "button", colSpan: "col-span-2 sm:col-span-1", color: "failure", value: "Delete"}
    ]


    return (
        <>

                <main>
                    <div className="w-screen py-6 px-1 sm:px-6 lg:px-8">
                        <div className='flex items-left flex-col'>
                            <div className='p-3 grid grid-cols-4 gap-5'>
                             
                                <FormGenerator heading="Create an assignment" inputs={createAssignmentForm} handleSubmit={handleSubmit} cols=" grid-cols-4 col-span-4 sm:col-span-2">

                                </FormGenerator>

                                <FormGenerator heading="Update an assignment" inputs={updateAssignmentForm} handleSubmit={handleUpdate} cols=" grid-cols-4 col-span-4 sm:col-span-2">

                              

                                </FormGenerator>

                                

                            </div> 

                        </div>
                    </div>
                </main>
 
        </>
    )
}
