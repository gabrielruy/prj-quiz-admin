/* eslint-disable react/style-prop-object */
/* eslint-disable no-console */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { Row, Col, Button, Breadcrumb, Collapse, Modal, Input, Checkbox } from 'antd';

import EditableTableLevels from '../../assets/components/EditableTableLevels';

const { Panel } = Collapse;

const text = (
  <p style={{ paddingLeft: 24 }}>
    Qual a tradução de "Red"?
  </p>
);

const text2 = (
  <p style={{ paddingLeft: 24 }}>
    Qual a tradução de "Blue"?
  </p>
);

class Levels extends Component {
  state = { visible: false, visibleTest: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showTest = () => {
    this.setState({
      visibleTest: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      visibleTest: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      visibleTest: false,
    });
  };

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={20}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item href="">Vocabulário</Breadcrumb.Item>
              <Breadcrumb.Item href="">Partes da Aeronave</Breadcrumb.Item>
            </Breadcrumb>,
          </Col>
          <Col span={1}>
            <Button type="primary" shape="circle" icon="highlight" onClick={this.showModal} />
          </Col>
          <Col span={1}>
            <Button type="primary" shape="circle" icon="snippets" onClick={this.showModal} />
          </Col>
          <Col span={2}>
            <Button type="primary" shape="circle" icon="pie-chart" onClick={this.showTest} />
          </Col>
        </Row>
        <Collapse bordered={false} >
          <Panel header="Estude" key="1">
            <EditableTableLevels />
          </Panel>
          <Panel header="Treine" key="2">
            <EditableTableLevels />
          </Panel>
          <Panel header="Teste" key="3">
            <Row gutter={16}>
              <Col span={20}>
                {text}
              </Col>
              <Col span={1}>
                <Button type="twoTone" shape="circle" icon="edit" />
              </Col>
            </Row>
            <hr />
            <Row gutter={16}>
              <Col span={20}>
                {text2}
              </Col>
              <Col span={1}>
                <Button type="twoTone" shape="circle" icon="edit" />
              </Col>
            </Row>
            <hr />
          </Panel>
        </Collapse>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input placeholder="Word" className="input" />
          <Input placeholder="Translation" className="input" />
        </Modal>
        <Modal
          visible={this.state.visibleTest}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={980}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Input placeholder="Question" className="input" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={1}>
              <Checkbox className="checkbox" />
            </Col>
            <Col span={23}>
              <Input placeholder="Answer" className="input" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={1}>
              <Checkbox className="checkbox" />
            </Col>
            <Col span={23}>
              <Input placeholder="Answer" className="input" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={1}>
              <Checkbox className="checkbox" />
            </Col>
            <Col span={23}>
              <Input placeholder="Answer" className="input" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={1}>
              <Checkbox className="checkbox" />
            </Col>
            <Col span={23}>
              <Input placeholder="Answer" className="input" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={1}>
              <Checkbox className="checkbox" />
            </Col>
            <Col span={23}>
              <Input placeholder="Answer" className="input" />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default Levels;
