import React from 'react';
import { Row, Col } from 'antd';

import TableReport from '../../assets/components/TableReport'

class Reports extends React.Component {
  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={22}>
            <TableReport />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Reports;
