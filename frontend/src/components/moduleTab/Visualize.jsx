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
import { HiCloudDownload, HiInbox, HiOutlineAdjustments, HiDocumentDownload, HiTrash, HiDownload, HiEye, HiCheck } from 'react-icons/hi';

import FormGenerator from '../FormGenerator';
import DefaultAccordion from '../Accordion';
import StudentList from '../StudentListAccord';
// import { Button, Label, } from 'flowbite-react';
import CanvasJSReact from '@canvasjs/react-charts';





var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dataPoints = [];


export default function Visualize(props) {

    const setAlert = props.setAlert
    const user = props.user
    const setUser = props.setUser

    const [students, setStudents] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [graphData, setGraphData] = useState([]);
    const { cid } = useParams()

    var chartMain;

    const navigator = useNavigate()


    useEffect(() => {

        axios.get(buildURL(COURSE_URL.teacher.submission.graph.replace("@cid", cid), user), buildHeader(user)).then(res => {

            console.log("Graph Data", res.data.data);
            setGraphData( prev => {
                return [...res.data.data];
            })

            setIsLoaded(true);
            
        }).catch(err => {
            console.log("err", err)
            setIsLoaded(false);
        })

    }, []);





    if (!isLoaded) return <></>;
    console.log("datapoints", graphData);

    const options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Student Performance"
        },
        axisX: {
            title: "Grade Range",
            reversed: true,
        },
        axisY: {
            title: "No. of students",
            includeZero: true,
        },
        data: [{
            type: "bar",
            dataPoints: graphData
            
        }]
    }

    return (


        <main>
            <div className="mx-automax-w-7xl py-6 px-1 sm:px-6 lg:px-8">
                <div className='flex items-left flex-col'>
                    <div className='border shadow border-solid w-full col-12 flex-col gap-4'>


                        <div className='col-span-2'>

                        <CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>

                        </div>


                    </div>

                </div>
            </div>
        </main>


    )
}
