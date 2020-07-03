import React from 'react';
import { Button } from 'antd';
import { CSVLink } from 'react-csv';

export const ExportReactCSV = ({csvData, fileName}) => {
    return (
      <Button theme="twoTone">
        <CSVLink data={csvData} filename={fileName}>Export</CSVLink>
      </Button>
    );
}