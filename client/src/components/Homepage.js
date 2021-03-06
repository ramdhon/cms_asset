import React from 'react'
import { Container } from 'react-bootstrap';

const styles = {
    containerHomePage: {
        justifyContent:'center', alignItems:'center', padding:'30px'
    },
    homePageSulap: {
        fontSize:'18vh', letterSpacing:'30px', fontWeight:'200', textAlign:'center'
    },
    homePageSulapInfo: {
        letterSpacing:'2px', fontSize:'20px', color:'grey', textAlign:'center'
    }
}

export default function Homepage() {
    return (
        <div style={styles.containerHomePage}>
            <Container >
                <p style={styles.homePageSulap}> <b>Trans</b><span style={{ color:'#ff2323'}}>-Pacific</span></p>
                <p style={styles.homePageSulapInfo}>Welcome to Content Management System of <span style={{ color:'#ff2323', fontWeight:'bold' }}>Trans Pacific</span></p>
                {/* <p style={styles.homePageSulapInfo}> 
                    <b>Sulap-</b><span style={{ color:'#00b894' }}>JS</span> is a <b>Content Management System Generator</b> written in <span style={{ color:'#00b894', fontWeight:'bold' }}>JavaScript</span> which provides users an instant client-server website model. It includes user management system and simple  <span style={{ color:'#00b894', fontWeight:'bold' }}>CRUD</span> model. The package also provides users to put some options or configuration while initiating their website. Client template is built on <span style={{ color:'#00b894', fontWeight:'bold' }}>React Js</span>, while server template is built on <span style={{ color:'#00b894', fontWeight:'bold' }}>Express Js</span> and <span style={{ color:'#00b894', fontWeight:'bold' }}>Node Js</span> with <span style={{ color:'#00b894', fontWeight:'bold' }}>MongoDB</span> and <span style={{ color:'#00b894', fontWeight:'bold' }}>Mongoose</span> as ODM. It aims to assist users or developers for saving time in initiating their website. By using few commands, in the future, user is able to build a simple client-server website. <span style={{ color:'#00b894', fontWeight:'bold' }}>Do less, gain more!</span>
                </p>  */}
            </Container>
        </div>
    )
}
