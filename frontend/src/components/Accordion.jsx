import { Accordion, ListGroup } from 'flowbite-react';
import { API_URL } from '../constant';


export default function DefaultAccordion(props) {

    console.log("PROPS", props.data.data)
    return (
        <Accordion className={`text-black ${props.cols} border-none`}>

            {   
                
                Object.keys(props.data.data).map((key, value) => {
                    
                    return (
                        <Accordion.Panel className='border border-solid' key={crypto.randomUUID()}>
                            <Accordion.Title className='my-5'>
                                {props.data.data[key][0].group}
                            </Accordion.Title>
                            <Accordion.Content className=''>

                                <ul className='p-0'>
                                {
                                    props.data.data[key].map(item => {
                                        console.log("ITEM IS", item)
                                        return (
                                            <li key={crypto.randomUUID()} className=' p-2 border my-2'>
                                              {item.title} 
                                              <button type='button' onClick={()=> { props.onDelete(item.id) }} className='float-right p-0 px-5'>Delete</button>
                                              {/* <button type='button' className='float-right p-0 px-5'>Edit</button> */}
                                              <button type='button' onClick={()=> {
                                                window.open(API_URL + item.download)
                                            }} className='float-right p-0 px-5'>Download</button>
                                              {/* <button type='button' className='float-right p-0 px-5'>View</button> */}
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