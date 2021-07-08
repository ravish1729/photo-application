import React from 'react'
import styled from 'styled-components'

// custom imports
import { refreshFiles } from '../../../state/actions'
import { downloadSharedFile, viewSharedFile, deleteSharedFile } from '../Methods'

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux'
import { Table, Popconfirm, Space, message } from 'antd'
import { DownloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

const ListView = () =>{

  const shared = useSelector(state=>state.FileHandler.shared);
  const dispatch = useDispatch();

  //Functions
  const handleDownload = async (record) =>{
    await downloadSharedFile(record, parseInt(localStorage.getItem("userNumber")))
  }

  const handleDelete = async(record) =>{
    await deleteSharedFile(record)
    dispatch(refreshFiles(true));
  }

  const handleView = async(record) =>{
    let response = await viewSharedFile(record, parseInt(localStorage.getItem("userNumber")))
    if(!response){
      message.info("Only PDF and Images can be viewed")
    }
  }

  // Defining Columns of Table
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={()=>{handleView(record)}}>{text}</div>,
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: text => <div>{(Number(text)/(1024*1024)).toFixed(2)}&nbsp;MB</div>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '',
      key: 'operation',
      render: (_, record) => {
        return (
        <Space size="middle">
          <a>
            <DownloadOutlined onClick={()=>handleDownload(record)} />
          </a>
          <a>
            <EditOutlined />
          </a>
          <Popconfirm title="Sure to delete?" onConfirm={()=>{handleDelete(record)}}>
          <a>
            <DeleteOutlined />
          </a>
          </Popconfirm>
        </Space>
        );
      },
    },
  ];

  return(
    <Style>
      <div>
        <Table dataSource={shared} columns={columns} />
      </div>
    </Style>
  )
}

export default ListView;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`