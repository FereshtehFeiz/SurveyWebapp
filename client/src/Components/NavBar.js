import { Nav, Form, Button, Container, Navbar } from 'react-bootstrap';
import { BrowserRouter,Link} from 'react-router-dom'
import * as icon from '../icons';

function NavBar(props) {
    return (
        <>
            <Nav fill expand="lg" className="navbar bg-dark d-flex justify-content-between">
            <Container fluid>
              {/* Logo */}
               <Nav.Item>
                <Link to="/">
                    <div className="media">
                        {icon.toDoManager}
                        <span style={{ color: 'white' }}>Survey</span>
                    </div>
                    </Link>
                </Nav.Item>
                {props.user.name !== "" ? (
                <Nav className="me-auto" style={{color:"white"}}>
                <Nav.Link><Link to="/responces">View Responces</Link></Nav.Link>
                <Nav.Link><Link to="/create">Create Survey</Link></Nav.Link>
                </Nav>):
                 <Nav.Link><Link to="/">Published Surveys</Link></Nav.Link>
                }
                
                {/* User Logo */}
                <Nav.Item>
                    {props.user.name === "" ? (
                        <div className="d-flex justify-content-end">
                            <span style={{ color: "white", padding: "10px 5px" }}>{props.user.name}</span>
                            {icon.user}
                            <Link to="/login">
                                Login
                            </Link>
                        </div>
                    ) : (<div className="d-flex justify-content-end"><span style={{ color: "white", padding: "10px 5px" }}>{"Welcome, " + props.user.name}</span>
                        <Button onClick={() => props.logout()} variant="outline-light">Log Out</Button>
                        </div>)}
                </Nav.Item>
                </Container>
            </Nav>
        </>
    );
}

export { NavBar };