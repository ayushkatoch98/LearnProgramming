import Card from "../../components/Card";
import NavBar from "../../components/NavBar";
import SideNavBar from "../../components/SideNavBar";
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Dashboard(props) {

    return (
        <div className="min-h-full">
            
            
            <NavBar heading={props.header} ></NavBar>
            
       
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