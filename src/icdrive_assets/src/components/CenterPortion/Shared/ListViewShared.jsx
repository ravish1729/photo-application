import React from 'react';
import styled from 'styled-components';

// custom imports

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, Popconfirm, Space, message,
} from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  downloadSharedFile, viewSharedFile, deleteSharedFile, bytesToSize,
} from '../Methods';
import { refreshFiles } from '../../../state/actions';

const ListView = () => {
  const shared = useSelector((state) => state.FileHandler.shared);
  const dispatch = useDispatch();

  // Functions
  const handleDownload = async (record) => {
    await downloadSharedFile(record, localStorage.getItem('userName'));
  };

  const handleDelete = async (record) => {
    await deleteSharedFile(record);
    dispatch(refreshFiles(true));
  };

  const handleView = async (record) => {
    const response = await viewSharedFile(record, localStorage.getItem('userName'));
    if (!response) {
      message.info('Only PDF and Images can be viewed');
    }
  };

  // Defining Columns of Table
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={() => { handleView(record); }}>{text}</div>,
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (text) => <div>{(bytesToSize(Number(text)))}</div>,
    },
    {
      title: '',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <span>
            <DownloadOutlined style={{ color: '#4D85BD' }} onClick={() => handleDownload(record)} />
          </span>
          <Popconfirm title="Sure to delete?" onConfirm={() => { handleDelete(record); }}>
            <span>
              <DeleteOutlined style={{ color: '#4D85BD' }} />
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Style>
      <div>
        <Table dataSource={shared} columns={columns} />
      </div>
    </Style>
  );
};

export default ListView;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`;
