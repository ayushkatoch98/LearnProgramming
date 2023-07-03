import { Dropdown, Navbar, Avatar } from 'flowbite-react';
import { useContext } from 'react';
import AppContext from './AppContext';
import { API_URL } from '../constant';

export default function Navigation(props) {

    const { user, setUser } = useContext(AppContext);

    return (
        <>
            {
                props.hide == "true" ? <></> :
                    <Navbar
                        fluid
                        rounded
                    >
                        <Navbar.Brand href="/" className='text-black hover:text-black'>
                            <img
                                alt="Flowbite React Logo"
                                className="mr-3 h-6 sm:h-9 rounded-full object-contain"
                                src={API_URL + user.image}
                            />
                            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                                E-Learning Platform
                            </span>
                        </Navbar.Brand>
                        <div className="flex md:order-2">
                            <Dropdown
                                inline
                                label={<Avatar alt="User settings" img={API_URL + user.image} rounded />}
                            >
                                <Dropdown.Header>
                                    <span className="block text-sm">
                                        {user.first_name} {user.last_name}
                                    </span>
                                    <span className="block truncate text-sm font-medium">
                                        {user.email}
                                    </span>
                                </Dropdown.Header>
                                <Dropdown.Item >
                                    <a href='/profile/'> Settings </a>

                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/logout/">
                                    <a href='/logout/'> Sign out </a>
                                </Dropdown.Item>
                            </Dropdown>
                            <Navbar.Toggle />
                        </div>
           
                    </Navbar>
            }
            <header className="shadow">
                <div style={{
                    "backgroundImage": "url('https://free4kwallpapers.com/uploads/originals/2022/07/16/-colorful-abstract-background-wallpaper.jpg')",
                    "backgroundSize": "cover",
                    "backgroundRepeat": "no-repeat"
                }} className="w--full px-0 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">{props.header}</h1>
                </div>
            </header>
        </>
    )
}


