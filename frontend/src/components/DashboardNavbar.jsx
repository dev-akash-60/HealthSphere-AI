import {
    Bell,
    User
} from "lucide-react";


function DashboardNavbar() {

    return (

        <nav className="dashboard-navbar">

            <div>

                <h2>
                    HealthSphere AI
                </h2>

                <p>
                    Intelligent Healthcare Platform
                </p>

            </div>


            <div className="navbar-actions">

                <Bell />

                <div className="profile-circle">
                    <User size={20} />
                </div>

            </div>


        </nav>

    )

}


export default DashboardNavbar;