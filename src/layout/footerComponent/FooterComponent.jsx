import React from 'react';
import { Layout, Col, Row } from 'antd';

const { Footer } = Layout;

const FooterComponent = () => (
  <Footer style={{ backgroundColor: '#FAFAFA' }}>
    <Row>
      <Col span={24} style={{ textAlign: 'center' }}>
        Quiz - Instituto Federal de São Carlos - Campus São Carlos
      </Col>
    </Row>
  </Footer>
);

export default FooterComponent;
