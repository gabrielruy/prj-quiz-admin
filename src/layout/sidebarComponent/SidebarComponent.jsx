import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Icon, Menu, Badge } from 'antd';
import throttle from 'lodash.throttle';

const { Sider } = Layout;

class SidebarComponent extends Component {
  state = {
    collapsed: false,
    viewportWidth: 0,
  }

  componentDidMount() {
    this.saveViewportDimensions();
    window.addEventListener('resize', this.saveViewportDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.saveViewportDimensions);
  }

  saveViewportDimensions = throttle(() => {
    this.setState({
      viewportWidth: window.innerWidth,
    });
  }, 250);

  toggleSideBar = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <Sider
        className="custom-sidebar"
        breakpoint="sm"
        collapsible
        onCollapse={this.toggleSideBar}
        collapsedWidth={this.state.viewportWidth > 600 ? 80 : 0}
      >
        <div className="custom-sider-head">
          <div>
            <Icon type="question-circle" />
            {
              !this.state.collapsed &&
              <span className="fade-in"> Quiz</span>
            }
          </div>
        </div>
        <Menu
          className="custom-menu"
          defaultOpenKeys={['sub1']}
          defaultSelectedKeys={['6']}
          mode="inline"
        >
          <Menu.Item>
            <NavLink to="/themes">
              <Icon type="pie-chart" />
              <span>Temas</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/contents">
              <Icon type="desktop" />
              <span>Conteúdo</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="12">
            <Icon type="inbox" />
            <Badge count={1}><span>Dúvidas</span></Badge>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SidebarComponent;
