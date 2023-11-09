import React from 'react';
import { Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { patientWithId } from "../../types/patient";
import { mapObject, minMaxObject, sortDirection } from '../../types/appTypes';

export function getColumns(handleDelete: (patientId:string)=>void) :ColumnsType<patientWithId>{
  return [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      // sorter: (a, b) => a.firstName > b.firstName,
      width: "10%",
    },              
    {
      title: "Middle Name",
      dataIndex: "middleName",
      key: "middleName",
      // sorter: (a, b) => a.middleName > b.middleName,
      width: "10%",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      // sorter: (a, b) => a.lastName > b.lastName,
      width: "10%",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      filters: [
        {
          text: "0-20",
          value: 0,
        },
        {
          text: "21-40",
          value: 1,
        },
        {
          text: "41-60",
          value: 2,
        },
      ],
      width: "10%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "20%",
    },                 
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {             
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space>
            <Link to={"/patient/" + record._id}>
              <EyeOutlined />
            </Link>
            <Link to={"/patient/edit/" + record._id}>
              <EditOutlined />
            </Link>
            <DeleteOutlined
              onClick={() => {
                handleDelete(record._id);
              }}
            />
          </Space>
        );
      },
    },
  ];
}

export const DEFAULT_PAGE_SIZE:number = 10;
export const DEFAULT_PAGE:number = 1;

export const direction:mapObject<sortDirection> = {
  ascend: "asc",
  descend: "desc",
};

export const FilterMinMaxValues:mapObject<minMaxObject> = {
  0: { min: 0, max: 20 },
  1: { min: 21, max: 40 },
  2: { min: 41, max: 60 },
};
