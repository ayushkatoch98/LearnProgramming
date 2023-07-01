import { Accordion, ListGroup } from 'flowbite-react';
import { API_URL } from '../constant';
import { HiCloudDownload, HiInbox, HiOutlineAdjustments, HiDocumentDownload, HiTrash, HiDownload, HiEye, HiCheck} from 'react-icons/hi';


export default function DefaultAccordion(props) {

    if (Object.keys(props.data).length <= 0){
        return (<div className=''> <h1>No items found</h1> </div>)
    }

    var foundSomething = false;
    for (var key in props.data){
        if (props.data[key].length == 0){
            delete props.data[key]
        }
        else foundSomething = true;
        
    }

    if (!foundSomething)
        return(<div className=''> <h1>No items found</h1> </div>)

    return (
        <Accordion className={` ${props.cols}`}>

            {

                Object.keys(props.data).map((key, value) => {

                    return (


                        <Accordion.Panel className='focus:outline-none' key={crypto.randomUUID()}>
                            <Accordion.Title className='focus:outline-none'>
                                {props.data[key][0].group.title}
                            </Accordion.Title>
                            <Accordion.Content>

                                {/* <ListGroup className='border-none'> */}
                                <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none">
                                    {
                                        props.data[key].map(item => {
                                            return (

                                                
                                                <li key={crypto.randomUUID()} className="p-4">
                                                    <div className="flex items-center">
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                                {item.title}
                                                            </p>
                                                       
                                                        </div>
                                                        
                                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                            {
                                                                props.onView != "none" ? <a className='px-3 cursor-pointer' href={`/course/${props.cid}/assignment/${item.id}/submit/`} ><HiEye size={20}></HiEye></a> : <></>
                                                            }
                                                            {
                                                                props.onDelete != "none" ? <a className='px-3 cursor-pointer' onClick={ () => props.onDelete(item.id)}><HiTrash size={20}></HiTrash></a> : <></>
                                                            }
                                                            {
                                                                props.onDownload != "none" ? <a className='px-3 cursor-pointer' download href={`${API_URL + item.file}`}><HiDownload size={20}></HiDownload></a> : <></>
                                                            }
                                                            {
                                                                props.onGrade != "none" ? <a className='px-3 cursor-pointer' href={`/course/${props.cid}/assignment/${item.id}/grade/`}><HiCheck size={20}></HiCheck></a> : <></>
                                                            }
                                                        </div>
                                                      
                                                      
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>

                            </Accordion.Content>
                        </Accordion.Panel>
                    )
                })
            }


        </Accordion>
    )
}