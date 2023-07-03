import { Accordion, ListGroup, Badge } from 'flowbite-react';
import { API_URL } from '../constant';
import { HiCloudDownload, HiInbox, HiOutlineAdjustments, HiDocumentDownload, HiTrash, HiDownload, HiEye, HiCheck} from 'react-icons/hi';


export default function DefaultList(props) {

    return (

        <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none" >
            {
                props.data.map(item => {
                    return (

                        <li key={crypto.randomUUID()} className="p-4">
                            <div className="flex items-center">


                                <div className="inline-flex w-full">
                                
                                        {item.student.user.first_name + " " + item.student.user.last_name} <br />
                                        <Badge className='mx-2' style={{padding: "6px"}}>
                                            ID {item.student.user.id}
                                        </Badge>
                                        <Badge style={{padding: "6px"}} color={item.graded ? "success" : "failure"}>
                                            {item.graded ? "Graded" : "Not Graded"}
                                        </Badge>
                                    

                                </div>

                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">

                                    {
                                        props.onView != "none" ? <a className='px-3 cursor-pointer' href={`/course/${props.cid}/submission/${props.aid}/${item.id}/`} ><HiEye></HiEye></a> : <></>
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