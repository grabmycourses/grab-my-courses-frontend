import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import homeImage from "../images/tired-searching.jpg";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AuthService from "../services/auth-service";

function Home() {

    return (
        <Container>
            <Row>
                <Col lg={6} md={12}>
                    <p id="homeTitle"> Tired of waiting for seats in your courses? </p>
                    <p id="homeSubTitle"> Leave that anxiety to us now. </p>
                    <p id="homeSubSubTitle">Tell us which class you are looking for and we will try to help you grab a seat in that class. </p>
                    <div id="center-aligned-button">
                        <Button variant="primary" size="lg" href={AuthService.getCurrentUser() ? "/addcourse" : "/addcourse"}> Get Started <i className="fas fa-arrow-circle-right"></i></Button>
                    </div>
                </Col>
                <Col id="homeImageDiv" lg={6} md={12}> <Image src={homeImage} id="homeImage" /> </Col>
            </Row>
        </Container>
    );
}


export default Home;