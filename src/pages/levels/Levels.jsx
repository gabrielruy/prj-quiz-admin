import React, { Component } from 'react';
import { Row, Col, Button, Breadcrumb, Collapse, Modal, Input, Checkbox, Select } from 'antd';

import EditableTableLevels from '../../assets/components/EditableTableLevels';
import api from '../../services/api';

const { Panel } = Collapse;

// const text = (
//   <p style={{ paddingLeft: 24 }}>
//     Qual a tradução de "Red"?
//   </p>
// );

// const text2 = (
//   <p style={{ paddingLeft: 24 }}>
//     Qual a tradução de "Blue"?
//   </p>
// );

class Levels extends Component {
  state = { 
    // visible: false, 
    // visibleTest: false,
    contentId: 0,
    content: [],
    levels: [],
  };

  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  // showTest = () => {
  //   this.setState({
  //     visibleTest: true,
  //   });
  // };

  // handleOk = (e) => {
  //   console.log(e);
  //   this.setState({
  //     visible: false,
  //     visibleTest: false,
  //   });
  // };

  // handleCancel = (e) => {
  //   console.log(e);
  //   this.setState({
  //     visible: false,
  //     visibleTest: false,
  //   });
  // };

  componentDidMount() {
    const id = this.props.history.location.contentId;
    this.setState({ contentId: id });

    api.get(`/levels`)
      .then((response) => {
        this.setState({ levels: response.data });
      })
      .catch((error) => {
        console.log(error);
    });

    api.get(`/contents/${id}`)
      .then((response) => {
        this.setState({ content: response.data });

        console.log("this.state.content.theme.name: " , this.state.content.theme.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
      return (
        <div>
          <h1>Hello, {this.state.contentId}</h1>
          <Row gutter={16}>
            <Col span={16}>
              <Input
                value={this.state.content.name}
                // onChange={this.handleInput}
              />
            </Col>
            <Col span={5}>
              <Select
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.content.theme}
                // onChange={(e) => {
                //   this.setState({ selectedTheme: e }, () => {
                //     this.handleChangeOnTheme(this.state.selectedTheme);
                //   });
                // }}
              >
                {/* {this.state.themes.map((theme) => 
                  <Option value={theme.id}>{theme.themeName}</Option>
                )} */}
              </Select>
            </Col>
            <Col span={1}>
              <Button type="primary" shape="circle" icon="plus" onClick={this.handleAdd}/>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={22}>
              <Collapse bordered={false} className="input">
                {this.state.levels.map((level) => 
                  <Panel header={level.name} key={level.id}></Panel>
                )}
              </Collapse>
            </Col>
          </Row>

        </div>
      
      
    // return (
    //   <div>
    //     <Row gutter={16}>
    //       <Col span={20}>
    //         <Breadcrumb separator=">">
    //           <Breadcrumb.Item>Home</Breadcrumb.Item>
    //           <Breadcrumb.Item href="">Vocabulário</Breadcrumb.Item>
    //           <Breadcrumb.Item href="">Partes da Aeronave</Breadcrumb.Item>
    //         </Breadcrumb>,
    //       </Col>
    //       <Col span={1}>
    //         <Button type="primary" shape="circle" icon="highlight" onClick={this.showModal} />
    //       </Col>
    //       <Col span={1}>
    //         <Button type="primary" shape="circle" icon="snippets" onClick={this.showModal} />
    //       </Col>
    //       <Col span={2}>
    //         <Button type="primary" shape="circle" icon="pie-chart" onClick={this.showTest} />
    //       </Col>
    //     </Row>
        
          // <Panel header="Estude" key="1">
          //   <EditableTableLevels />
          // </Panel>
    //       <Panel header="Treine" key="2">
    //         <EditableTableLevels />
    //       </Panel>
    //       <Panel header="Teste" key="3">
    //         <Row gutter={16}>
    //           <Col span={20}>
    //             {text}
    //           </Col>
    //           <Col span={1}>
    //             <Button type="twoTone" shape="circle" icon="edit" />
    //           </Col>
    //         </Row>
    //         <hr />
    //         <Row gutter={16}>
    //           <Col span={20}>
    //             {text2}
    //           </Col>
    //           <Col span={1}>
    //             <Button type="twoTone" shape="circle" icon="edit" />
    //           </Col>
    //         </Row>
    //         <hr />
    //       </Panel>
    //     </Collapse>
    //     <Modal
    //       visible={this.state.visible}
    //       onOk={this.handleOk}
    //       onCancel={this.handleCancel}
    //     >
    //       <Input placeholder="Word" className="input" />
    //       <Input placeholder="Translation" className="input" />
    //     </Modal>
    //     <Modal
    //       visible={this.state.visibleTest}
    //       onOk={this.handleOk}
    //       onCancel={this.handleCancel}
    //       width={980}
    //     >
    //       <Row gutter={16}>
    //         <Col span={24}>
    //           <Input placeholder="Question" className="input" />
    //         </Col>
    //       </Row>
    //       <Row gutter={16}>
    //         <Col span={1}>
    //           <Checkbox className="checkbox" />
    //         </Col>
    //         <Col span={23}>
    //           <Input placeholder="Answer" className="input" />
    //         </Col>
    //       </Row>
    //       <Row gutter={16}>
    //         <Col span={1}>
    //           <Checkbox className="checkbox" />
    //         </Col>
    //         <Col span={23}>
    //           <Input placeholder="Answer" className="input" />
    //         </Col>
    //       </Row>
    //       <Row gutter={16}>
    //         <Col span={1}>
    //           <Checkbox className="checkbox" />
    //         </Col>
    //         <Col span={23}>
    //           <Input placeholder="Answer" className="input" />
    //         </Col>
    //       </Row>
    //       <Row gutter={16}>
    //         <Col span={1}>
    //           <Checkbox className="checkbox" />
    //         </Col>
    //         <Col span={23}>
    //           <Input placeholder="Answer" className="input" />
    //         </Col>
    //       </Row>
    //       <Row gutter={16}>
    //         <Col span={1}>
    //           <Checkbox className="checkbox" />
    //         </Col>
    //         <Col span={23}>
    //           <Input placeholder="Answer" className="input" />
    //         </Col>
    //       </Row>
    //     </Modal>
    //   </div>
    // );
    );
  }
}

export default Levels;
