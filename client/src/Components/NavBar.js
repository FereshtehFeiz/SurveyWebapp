import { Nav, Button, Container } from 'react-bootstrap';
import { Link} from 'react-router-dom'
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
                        {icon.logo}
                        <h6>Survey</h6>
                    </div>
                    </Link>
                </Nav.Item>
                {props.user.name !== "" ? (
                <Nav className="me-auto">
                <Link to="/responces">View Responces</Link>
                <Link to="/create">Create Survey</Link>
                </Nav>):
                 <Link to="/"><Button onClick={() => props.loadSurveys()}>Published Surveys</Button></Link>
                }
                
                {/* User Logo */}
                <Nav.Item>
                    {props.user.name === "" ? (
                        <div className="d-flex justify-content-end">
                            <span style={{ color: "#b7b6b6", padding: "10px 5px" }}>{props.user.name}</span>
                            <Link to="/login">
                                Login
                            </Link>
                            {icon.user}
                        </div>
                    ) : (<div className="d-flex justify-content-end"><span style={{ color: "#b7b6b6", padding: "10px 5px" }}>{"Welcome, " + props.user.name}</span>
                        <Button onClick={() => props.logout()} variant="outline-light">Log Out</Button>
                        </div>)}
                </Nav.Item>
                </Container>
            </Nav>
        </>
    );
}

export { NavBar };