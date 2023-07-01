import { Accordion, ListGroup } from 'flowbite-react';
import { API_URL } from '../constant';


export default function DefaultList(props) {

    return (

        <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none" >
            {
                props.data.map(item => {
                    return (

                        <li key={crypto.randomUUID()} className="p-4">
                            <div className="flex items-center">

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Student ID: {item.student.user.id} | {item.graded == false ? "Not Graded" : "Graded"}
                                    </p>

                                </div>

                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    {
                                        props.onView != "none" ? <a className='px-3 cursor-pointer' href={`/course/${props.cid}/submission/${props.aid}/${item.id}/`} >View</a> : <></>
                                    }
                                    
                                </div>


                            </div>
                        </li>
                        
                    )
                })
            }
        </ul>






    )
}