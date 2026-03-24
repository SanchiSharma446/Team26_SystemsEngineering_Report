import signInPng from "../assets/sign_in_page.png"
import signInFillPng from "../assets/sign_in_fill.png"
import fullPagePng from "../assets/full_page.png"
import sidebarPng from "../assets/sidebar.png"
import sourcesPng from "../assets/sources.png"
import userPagePng from "../assets/user_page.png"


function UserManual() {
    return (
        <main>
            <h2>User Manual</h2>

            <p>hello, and welcome to Cresco, the smart farming assistant.</p>
            <p>This user manual will get you up to date on how to operate this application, and how to get the most out of cresco!</p>

            <h4>Sign in Page</h4>
            <br></br>

            <img src={signInPng} style={{ width: '40vw' }} />

            <br></br>

            <p>On inputting your Username and Password, you can create an account or sign in</p>
            <p> If the correct username and password are inputted, you can sign in</p>
            

            <br></br>

            <img src={signInFillPng} style={{ width: '40vw' }} />
            <p> To create an account, you must input a unique username, and your desired password</p>


            <br></br>

            <h4> Main Page </h4>

            <img src={fullPagePng} style={{ width: '40vw' }} />
            <p> The main page consists of the central area and 2 sidebars on either side.</p>
            <p>the central area displays the chat interface, and the dashboard, selectable by the buttons at the top</p>
            <br></br>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <img src={sidebarPng} style={{ width: '15vw' , marginLeft: '5vw' }} />
                <div>
                    <h4>Toolbar</h4>
                    <p>the toolbar contains buttons for accessing additional features of the application such as:</p>
                    <ul style={{ textAlign: 'left' }}>
                        <li>Add Farm - Click this to select the location and boundary of your farm, to get in context information</li>
                        <br></br>
                        
                        <li>Weather Data - Click this to view current weather conditions and forecasts for your farm</li>
                        <br></br>
                        
                        <li>Drone Monitoring - Click this to upload and analyze drone imagery of your farm</li>
                        <br></br>
                        
                        <li>Satellite Imagery - Click this to view satellite image analysis of your farm</li>
                        <br></br>

                        <li>Web search toggle - Click this to enable or disable web search functionality</li>
                        <br></br>

                    </ul>
                </div>
            </div>

            <br></br>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <div>
                <h4>Sources Sidebar</h4>
                <p> This sidebar contains user added sources. press add field data to select any supported file, which the chatbot can then access to give more accurate information for your use case</p>
                </div>
                <img src={sourcesPng} style={{ width: '15vw', margin: '0 1vw' }} />
            </div>
            <br></br>


            <img src={userPagePng} style={{ width: '15vw' }} />

            <br></br>



            
        </main>
    )
}

export default UserManual
