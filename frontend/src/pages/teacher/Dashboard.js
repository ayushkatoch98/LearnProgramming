import Card from "../../components/Card";
import NavBar from "../../components/NavBar";
import SideNavBar from "../../components/SideNavBar";
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const sideNavBarItems = [
    { title: "", url: "" },
    { title: "", url: "" },
    { title: "Dashboard", url: "https://youtube.com" },
    { title: "Grades", url: "https://youtube.com" },
    { title: "Assignment", url: "https://youtube.com" },
    { title: "Modules", url: "https://youtube.com" },
    { title: "Dashboard", url: "https://youtube.com" },
    { title: "Dashboard", url: "https://youtube.com" },
]

export default function Dashboard() {

    return (
        <div className="min-h-full">
            
            
            <NavBar></NavBar>
            
            
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-2 lg:px-2">

                 
                        {/* Your content here */}

                        <div className="grid col-span-8 grid-cols-1 grid-flow-row gap-5 sm:grid-cols-4">
        
                            <Card className="self-auto" title='WOW Algo' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='Advanced Algo' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='Data Mining' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            <Card className="self-auto" title='MultiCore' url='/module/home' image='https://img.freepik.com/premium-vector/young-girl-anime-style-character-vector-illustration-design-manga-anime-girl_147933-100.jpg'></Card>
                            
                        </div>

                    

                </div>
            </main>
            
        </div>
    )
}