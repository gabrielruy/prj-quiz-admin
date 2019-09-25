import React from 'react';
import { Avatar, Badge, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd';

const { Header } = Layout;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a target="blank" href="https://scl.ifsp.edu.br/">IFSP</a>
    </Menu.Item>
  </Menu>
);

const HeaderComponent = () => (
  <Header
    className="custom-header"
  >
    <Row>
      <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span>
          <Badge><Avatar icon="user" /></Badge>
        </span>
        <div className="user-info">
          <Dropdown overlay={menu} trigger={['click']}>
            <span style={{ marginLeft: '16px' }}>
              Admin <Icon type="down" />
            </span>
          </Dropdown>
        </div>
      </Col>
    </Row>
  </Header>
);

export default HeaderComponent;
