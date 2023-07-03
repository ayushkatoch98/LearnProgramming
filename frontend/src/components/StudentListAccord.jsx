import { Accordion, ListGroup, Badge } from 'flowbite-react';
import { API_URL } from '../constant';
import { HiCloudDownload, HiInbox, HiOutlineAdjustments, HiDocumentDownload, HiTrash, HiDownload, HiEye, HiCheck} from 'react-icons/hi';


export default function StudentList(props) {

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
                                {props.header}
                            </Accordion.Title>
                            <Accordion.Content>

                                {/* <ListGroup className='border-none'> */}
                                <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none">
                                    {
                                        props.data[key].map(item => {
                                            return (

                                                
                                                <li key={crypto.randomUUID()} className="p-4">
                                                    <div className="flex items-center">
                                                        
                                                        <div className="inline-flex w-full">
                                                            <img className="h-12 mr-4 object-cover w-12  rounded-full bg-gray-50" src={ API_URL + item.student.image} alt="" />
                                                            
                                                                <Badge className='' style={{padding: "6px"}}>
                                                                    Student No.{item.student.user.id}
                                                                </Badge>
                                                            
                                                                {item.student.user.first_name + " " + item.student.user.last_name} <br/>
                                                                {item.student.user.email}
                                                                
                                                                
                                                       
                                                        </div>
{/* 
                                                        <div className="inline-flex w-full">
                                
                                                                {item.student.user.first_name + " " + item.student.user.last_name} <br />
                                                                <Badge className='mx-2' style={{padding: "6px"}}>
                                                                    ID {item.student.user.id}
                                                                </Badge>
                                                             
                                                            

                                                        </div>
                                                         */}
                                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                            {
                                                                props.onDelete != "none" && props.owner.id != item.student.user.id ? <a className='px-3 cursor-pointer' onClick={ () => props.onDelete(item.student.user.id)}><HiTrash size={20}></HiTrash></a> : <></>
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