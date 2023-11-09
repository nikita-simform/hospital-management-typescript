import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table, Upload } from "antd";
import type { TableProps } from "antd/es/table";
import type { UploadChangeParam } from 'antd/es/upload';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { apiService, API_URL } from "../../services/apiService";
import { sortDirection } from "../../types/appTypes";
import { patientQueryParam, patientWithId } from "../../types/patient";
import { rootState } from "../../types/storeTypes";
import { getLocalStorage } from "../../utils/storage";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  direction,
  FilterMinMaxValues,
  getColumns
} from "./patient.helper";
import {
  setIsDeletePopupOpen,
  setPatientList,
  setTotalPatients
} from "./PatientSlice";

const { Search } = Input;

function PatientList() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientList = useSelector<rootState, patientWithId[] | undefined>((state:rootState) => state.patient.patientList);
  const totalPatients = useSelector<rootState, number>((state:rootState) => state.patient.total);
  const isDeletePopupOpen = useSelector<rootState, string | boolean | null>(
    (state:rootState) => state.patient.isDeletePopupOpen
  );
  const httpGetAllPatients = (page?: number, limit?: number, sort?: string, direction?: sortDirection) => {
    apiService.getAllPatients(page, limit, sort, direction).then((response) => {
      dispatch(setPatientList(response.data.data?.patients));
      dispatch(setTotalPatients(response.data.data?.total));
    });
  };
  useEffect(() => {
    httpGetAllPatients(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
  }, []);

  const filterPatientsByAge = (minAge: number, maxAge: number) => {
    apiService.filterPatient(minAge, maxAge).then((response) => {
      dispatch(setPatientList(response.data.data?.result));
      dispatch(setTotalPatients(response.data.data?.result?.length || 0));
    });
  };

  const handleOnChange: TableProps<patientWithId>['onChange'] = (pagination, filters, sorter) => {
    const params: patientQueryParam = {};

    if (sorter.field && sorter.order) {
      params.sort = sorter.field;
      params.direction = direction[sorter.order];
    }

    if (filters.age) {
      const min = Math.min.apply(null, filters.age);
      const max = Math.max.apply(null, filters.age);

      const minAge = FilterMinMaxValues[min].min;
      const maxAge = FilterMinMaxValues[max].max;

      filterPatientsByAge(minAge, maxAge);
      return;
    }

    httpGetAllPatients(
      pagination.current,
      pagination.pageSize,
      params.sort,
      params.direction
    );
  };

  const searchPatient = (searchKey: string) => {
    apiService.searchPatient(searchKey).then((response) => {
      dispatch(setPatientList(response.data.data?.result));
      dispatch(setTotalPatients(response.data.data?.result?.length || 0));
    });
  };
  const onSearch = (value: string) => {
    searchPatient(value);
  };

  const handleDelete = (patientId: string) => {
    dispatch(setIsDeletePopupOpen(patientId));
  };

  const deletePatient = () => {
    if (typeof isDeletePopupOpen === 'string') {
      apiService.deletePatient(isDeletePopupOpen).then(() => {
        toast.success("Patient details deleted successfully");
        if (patientList !== undefined) {
          const patientToDelete = patientList.find((patient:patientWithId) => patient._id === isDeletePopupOpen);

          if (patientToDelete) {
            const index = patientList.findIndex((patient:patientWithId) => patient._id === isDeletePopupOpen);
            if (index !== -1) {
              const newPatientList = [...patientList];
              newPatientList.splice(index, 1);
              dispatch(setPatientList(newPatientList));
              dispatch(setIsDeletePopupOpen(null));
            }
          }
        }
      });
    }
  };
  const handleCancel = () => {
    dispatch(setIsDeletePopupOpen(null));
  };

  function onChange(info: UploadChangeParam) {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      httpGetAllPatients(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  const token = getLocalStorage("token");

  return (
    <div>
      <h1 className="heading">Patient List</h1>
      <Space className="button-container">
        <Button
          onClick={() => {
            navigate("/patient/add");
          }}
        >
          Add Patient
        </Button>
        <Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
          style={{ width: 200 }}
        />
        <Upload
          name="csvFile"
          action={`${API_URL}/patients/upload`}
          headers={{ authorization: "Bearer " + token }}
          onChange={onChange}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Space>
      <Table
        scroll={{ y: 425 }}
        className="your-table"
        dataSource={patientList}
        columns={getColumns(handleDelete)}
        onChange={handleOnChange}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
          position: ["bottomRight"],
          // onChange: onPageChange,
          total: totalPatients,
        }}
      />

      <Modal
        title=""
        open={isDeletePopupOpen !== null ? true : false}
        onOk={deletePatient}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this patient?</p>
      </Modal>
    </div>
  );
}

export default PatientList;
