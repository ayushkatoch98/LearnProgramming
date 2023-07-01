import { Dropdown, Navbar, Avatar } from 'flowbite-react';
import { useContext } from 'react';
import AppContext from './AppContext';
import { API_URL } from '../constant';

export default function Navigation(props) {

    const { user, setUser } = useContext(AppContext);

    return (
        <>
            <Navbar
                fluid
                rounded
            >
                <Navbar.Brand href="/" className='text-black hover:text-black'>
                    <img
                        alt="Flowbite React Logo"
                        className="mr-3 h-6 sm:h-9"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        E-Learning Platform
                    </span>
                </Navbar.Brand>
                <div className="flex md:order-2">
                    <Dropdown
                        inline
                        label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                {user.first_name} {user.last_name}
                            </span>
                            <span className="block truncate text-sm font-medium">
                                {user.email}
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item>
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                            Sign out
                        </Dropdown.Item>
                    </Dropdown>
                    <Navbar.Toggle />
                </div>
                {/* <Navbar.Collapse>
                <Navbar.Link
                    active
                    href="#"
                >
                    <p>
                        Home
                    </p>
                </Navbar.Link>
                <Navbar.Link href="#">
                    About
                </Navbar.Link>
                <Navbar.Link href="#">
                    Services
                </Navbar.Link>
                <Navbar.Link href="#">
                    Pricing
                </Navbar.Link>
                <Navbar.Link href="#">
                    Contact
                </Navbar.Link>
            </Navbar.Collapse> */}
            </Navbar>
            <header className="shadow">
                <div className="w--full px-0 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{props.header}</h1>
                </div>
            </header>
        </>
    )
}


