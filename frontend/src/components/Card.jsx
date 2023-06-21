
import { Card } from 'flowbite-react';
import { API_URL } from '../constant';


export default function Cards(props) {


    return (

        <div className="max-w-sm overflow-hidden bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href={props.url}>
                <img className="rounded-t-lg object-cover w-full" style={{height: "220px"}} src={`${API_URL}${props.image}`} alt="" />
            </a>
            <div className="p-5">
                <a href={props.url}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white break-all">{props.title}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Invite Token <br></br>
                    <p className='text-red-900'>{props.token}</p>
                    {props.id}
                </p>
                <a href={props.url} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Open
                    <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
            </div>
        </div>

        // <Card
        //     imgClassName="h-5/6 bg-black"
        //     imgAlt="Meaningful alt text for an image that is not purely decorative"
        //     imgSrc={` ${API_URL}${props.image}`}
        // >
        //     <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        //         <p>
        //             {props.title.substring(0,20)}
        //         </p>
        //     </h5>
        //     <p className="font-normal text-gray-700 dark:text-gray-400">
        //         <p>
        //             {props.description.substring(0,100)}
        //         </p>
        //     </p>
        // </Card>
    )


}