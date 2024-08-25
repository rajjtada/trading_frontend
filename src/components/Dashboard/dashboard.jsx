import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
    return (
        <Container fluid className="mt-3">
            <Row>
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Card 1</Card.Title>
                            <Card.Text>
                                This is a simple card with some content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Card 2</Card.Title>
                            <Card.Text>
                                This is another card with different content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Card 3</Card.Title>
                            <Card.Text>
                                This card contains additional information.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
