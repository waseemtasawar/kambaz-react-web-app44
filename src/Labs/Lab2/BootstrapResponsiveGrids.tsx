import { Row, Col } from "react-bootstrap";

export default function BootstrapResponsiveGrids() {
    return (
      <div id="wd-bs-responsive-grids">
        <h2>Responsive Grid System</h2>
        <Row>
          <Col xs={12} md={6} xl={3} className="bg-warning"><h3>Column A</h3></Col>
          <Col xs={12} md={6} xl={3} className="bg-primary text-white"><h3>Column B</h3></Col>
          <Col xs={12} md={6} xl={3} className="bg-danger text-white"><h3>Column C</h3></Col>
          <Col xs={12} md={6} xl={3} className="bg-success text-white"><h3>Column D</h3></Col>
        </Row>
      </div>
    );
  }
  