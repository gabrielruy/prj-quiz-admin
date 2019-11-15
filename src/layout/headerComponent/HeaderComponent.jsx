import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Badge, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd';

import { logout } from '../../services/auth';

const { Header } = Layout;

class HeaderComponent extends PureComponent {
  handleLogoutClick = () => {
    logout();
    this.props.history.push('/login');
  };

  menu = (
    <Menu>
      <Menu.Item key="0">
        <a target="blank" href="https://scl.ifsp.edu.br/">IFSP</a>
        <a onClick={this.handleLogoutClick}>Sair</a>
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Header
        className="custom-header"
      >
        <Row>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span>
              <Badge><Avatar icon="user" /></Badge>
            </span>
            <div className="user-info">
              <Dropdown overlay={this.menu} trigger={['click']}>
                <span style={{ marginLeft: '16px' }}>
                  Admin <Icon type="down" />
                </span>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Header>
    );
  }
}

export default withRouter(HeaderComponent);
