import React, { useEffect, useState } from "react";
import { $get, $post } from "../../api/RestUtil";
import {
  Form,
  Button,
  Input,
  Select,
  Tabs,
  Radio,
  Modal,
  message,
  Empty,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import "./index.less";

const App = (props) => {
  // 引入模块
  const { Option } = Select;
  const { TextArea } = Input;
  const { TabPane } = Tabs;

  // post请求content-type
  const requestBodyTypeList = [
    {
      label: "json",
      code: 1,
    },
  ];

  const [infoForm] = Form.useForm();
  const [caseForm] = Form.useForm();
  // useState
  const [inputCaseId, setInputCaseId] = useState();
  const [inputCaseName, setInputCaseName] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [caseList, setCaseList] = useState();

  const [currentCase, setCurrentCase] = useState();
  const [requestBodyTypeCode, setRequestBodyTypeCode] = useState(
    requestBodyTypeList[0].code
  );

  // 样式控制
  const formLayout = "horizontal";
  const formMethodItemStyle = { width: "10%", display: "inline-flex" };
  const formUrlItemStyle = { width: "80%", display: "inline-flex" };
  const formSubmitItemStyle = {
    width: "8%",
    paddingLeft: "10px",
    display: "inline-flex",
  };
  // 业务变量
  const methodList = ["GET", "POST", "PUT", "DELETE"];
  const dataTypeList = ["string", "number", "date", "boolean"];

  // menu切换时触发
  useEffect(() => {
    getMockData();
  }, [props.menuId]);

  // 加载当前页面mock数据
  const getMockData = () => {
    let param = {
      id: props.menuId,
    };
    $get("/business/mock", param)
      .then((res) => {
        if (res) {
          console.log("res: " + JSON.stringify(res));
          caseForm.resetFields();
          infoForm.resetFields();
          setCurrentCase(res.fieldMap[0]);
          caseForm.setFieldsValue(res.fieldMap[0]);
          infoForm.setFieldsValue(res);
          setCaseList(res.fieldMap);
        }
      })
      .catch((error) => {
        message.error("服务器异常");
      });
  };

  // 添加或更新接口信息
  const addOrUpdateInterface = (formData) => {
    $post("/business/addOrUpdateInterface", formData)
      .then((res) => {
        if (res.code === 200) {
          getMockData();
          props.reloadMenu();
        }
        message.info(res.message);
      })
      .catch((error) => {
        message.error("服务器异常");
      });
  };

  const deleteInterface = () => {
    props.deleteInterface(props.menuId);
  };

  // 控制 新增case的弹窗 是否展示
  const switchModal = (flag, model) => {
    if (!flag) {
      setInputCaseId();
      setInputCaseName();
    }
    setModalShow(flag);
    if (model === 2) {
      //修改
      setInputCaseId(currentCase.id);
      setInputCaseName(currentCase.name);
    }
  };

  // 新增或修改case信息
  const addOrUpdateCase = () => {
    // 远程请求 保存case（只包含name）
    console.log("addOrUpdateCase");
    let params = {
      interfaceId: infoForm.getFieldValue("id"),
      caseName: inputCaseName,
      caseId: inputCaseId,
    };
    $post("/business/addOrUpdateCase", params)
      .then((res) => {
        if (res.code === 200) {
          if (inputCaseId) {
            reloadCaseList(infoForm.getFieldValue("id"), false);
          } else {
            reloadCaseList(infoForm.getFieldValue("id"), true);
          }
          setModalShow(false);
        }
        message.info(res.message);
      })
      .catch((error) => {
        message.error("服务器异常");
      });
  };

  // 删除case
  const deleteCase = () => {
    let params = {
      interfaceId: infoForm.getFieldValue("id"),
      caseId: currentCase.id,
    };
    $post("/business/deleteCase", params)
      .then((res) => {
        if (res.code === 200) {
          reloadCaseList(infoForm.getFieldValue("id"), true);
        }
        message.info(res);
      })
      .catch((error) => {
        message.error("服务器异常");
      });
  };

  // 重新加载case列表
  const reloadCaseList = (id, switchCase) => {
    let params = {
      id: id,
    };
    $get("/business/getCaseList", params)
      .then((res) => {
        if (res.code === 200) {
          if (switchCase) {
            setCurrentCase(res.data[res.data.length - 1]);
            caseForm.setFieldsValue(res.data[res.data.length - 1]);
          } else {
            for (let caseItem of res.data) {
              if (caseItem.id === currentCase.id) {
                caseForm.setFieldsValue(caseItem);
              }
            }
          }
          setCaseList(res.data);
        }
      })
      .catch((error) => {
        message.error("服务器异常");
      });
  };

  // 切换case
  const switchCase = (caseId) => {
    for (let caseItem of caseList) {
      if (caseItem.id === caseId) {
        caseForm.setFieldsValue(caseItem);
        setCurrentCase(caseItem);
        break;
      }
    }
  };

  // 保存case明细
  const saveCase = (formData) => {
    $post("/business/updateCaseDetail", formData)
      .then((res) => {
        if (res.code === 200) {
          message.info(res.message);
          renderCaseSelect();
        } else {
          message.error(res.message);
        }
      })
      .catch((error) => {
        message.error("服务器异常");
      });
  };

  // 渲染case下拉选择框
  const renderCaseSelect = () => {
    if (!caseList) {
      return <></>;
    }
    let options = caseList.map((caseItem, index) => {
      return <Option value={caseItem.id}>{caseItem.name}</Option>;
    });
    return (
      <>
        <Select
          style={{ width: "80%" }}
          defaultValue={caseList[0].id}
          value={currentCase.id}
          onChange={(value) => {
            switchCase(value);
          }}
        >
          {options}
        </Select>
        <Button type="primary" icon={<SaveOutlined />} htmlType="submit" />
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => switchModal(true, 2)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => switchModal(true, 1)}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteCase()}
          disabled={caseList.length <= 1}
        />
      </>
    );
  };
  // 渲染params参数输入框组
  const renderParamInputs = () => {
    return (
      <table width={"50%"}>
        <thead>
          <tr>
            <td style={{ width: "1%", paddingLeft: "8px" }}>参数名</td>
            <td style={{ width: "5%", paddingLeft: "8px" }}>类型</td>
            <td style={{ width: "5%", paddingLeft: "8px" }}>示例值</td>
            <td style={{ width: "10%", paddingLeft: "8px" }}>说明</td>
            <td style={{ width: "5%", paddingLeft: "8px" }}></td>
          </tr>
        </thead>
        <Form.List name="params">
          {(fields, { add, remove }) => (
            <>
              <tbody>
                {fields.map(({ key, name, ...restField }) => (
                  <tr>
                    <td>
                      <Form.Item {...restField} name={[name, "name"]}>
                        <Input placeholder="字段名称" />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item
                        style={{ width: "100%" }}
                        {...restField}
                        name={[name, "type"]}
                      >
                        <Select>
                          {dataTypeList.map((dataType) => (
                            <Option value={dataType}>{dataType}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item {...restField} name={[name, "value"]}>
                        <Input placeholder="示例值" />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item {...restField} name={[name, "remark"]}>
                        <Input placeholder="说明" />
                      </Form.Item>
                    </td>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </tr>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </tbody>
            </>
          )}
        </Form.List>
      </table>
    );
  };
  if (!props.menuId) {
    return (
      <div className="document-empty">
        <Empty />
      </div>
    );
  }

  return (
    <>
      {/* 新增case模态框 */}
      <Modal
        title="请输入用例名称"
        visible={modalShow}
        okText="确认"
        cancelText="取消"
        onCancel={() => switchModal(false)}
        okButtonProps={{
          disabled: !inputCaseName,
          onClick: addOrUpdateCase,
        }}
      >
        <Input
          value={inputCaseId}
          onChange={(e) => {
            setInputCaseId(e.target.value);
          }}
        />
        <Input
          value={inputCaseName}
          onChange={(e) => {
            setInputCaseName(e.target.value);
          }}
        />
      </Modal>
      <div className="doc-form">
        {/* 接口信息表单 */}
        <Form
          form={infoForm}
          layout={formLayout}
          autoComplete="off"
          onFinish={addOrUpdateInterface}
        >
          <div className="form-head">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 22 }}
              labelAlign="left"
              style={formMethodItemStyle}
              colon={false}
              name="method"
            >
              <Select defaultValue={methodList[0]}>
                {methodList.map((method) => (
                  <Option value={method}>{method}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              labelAlign="left"
              style={formUrlItemStyle}
              colon={false}
              x
              name="url"
              labelCol={{ span: 0.1 }}
            >
              <Input placeholder="url" />
            </Form.Item>
            <Form.Item style={formSubmitItemStyle}>
              <Button type="primary" className="form-sumit" htmlType="submit">
                保存
              </Button>
              <Button
                type="primary"
                danger
                className="form-sumit"
                onClick={() => deleteInterface()}
              >
                删除
              </Button>
            </Form.Item>
            <Form.Item
              labelAlign="left"
              labelCol={{ span: 1 }}
              wrapperCol={{ span: 23 }}
              colon={false}
              label="名称"
              name="label"
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelAlign="left"
              labelCol={{ span: 1 }}
              wrapperCol={{ span: 23 }}
              colon={false}
              label="说明"
              name="remark"
            >
              <TextArea rows={4} />
            </Form.Item>
          </div>
        </Form>
        <div className="form-body">
          <div className="form-body-head">
            <div className="form-body-head_title">接口用例</div>
          </div>
          <div className="case-body">
            {/* case表单 */}
            <Form form={caseForm} onFinish={saveCase}>
              <div className="case-select">
                <div className="case-status">
                  <Form.Item name="status">
                    <Input placeholder="HTTP Status" />
                  </Form.Item>
                </div>
                {renderCaseSelect()}
              </div>
              <div className="case-request">
                <div className="case-request_title">请求参数</div>
                <div className="case-request_body">
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="name" hidden>
                    <Input />
                  </Form.Item>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Params" key="1">
                      {renderParamInputs()}
                    </TabPane>
                    <TabPane tab="Body" key="2">
                      <Radio.Group
                        value={requestBodyTypeCode}
                        onChange={(e) => {
                          setRequestBodyTypeCode(e.target.value);
                        }}
                      >
                        {requestBodyTypeList.map((item) => (
                          <Radio value={item.code}>{item.label}</Radio>
                        ))}
                      </Radio.Group>
                      <div className="json-area">
                        <Form.Item name="body">
                          <TextArea rows={6} />
                        </Form.Item>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              <div className="case-response">
                <div className="case-response_title">返回响应</div>
                <div className="case-response_body">
                  <div className="json-area">
                    <Form.Item name="response">
                      <TextArea rows={10} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
