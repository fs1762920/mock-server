import React, { useEffect, useState } from "react";
import Head from "../../components/Head";
import Documents from "../../components/Documents";
import { $get, $post } from "../../api/RestUtil";
import {
  Button,
  Menu,
  Input,
  Divider,
  Layout,
  Tag,
  Modal,
  Form,
  message,
  Empty,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.less";

const { Header, Sider, Content } = Layout;

const App = () => {
  useEffect(() => {
    getMenuList();
  }, []);

  const [currentMenuId, setCurrentMenuId] = useState();
  const [menuList, setMenuList] = useState();
  const [modalShow, setModalShow] = useState(false);
  const methodColor = {
    POST: "#87d068",
    GET: "#2db7f5",
    DELETE: "#f50",
    PUT: "#ffa600",
  };

  const [interfaceForm] = Form.useForm();

  const changMenu = (e) => {
    if (e.key !== currentMenuId) {
      setCurrentMenuId([e.key]);
    }
  };

  const getItem = (label, key) => {
    return { label, key };
  };

  const getMenuList = (first) => {
    $get("/business/menu")
      .then((res) => {
        let menuListTemp = res.map((item, index) => {
          return getItem(renderMenuItem(item), item.id);
        });
        setMenuList(menuListTemp);
        if (!currentMenuId || first) {
          setCurrentMenuId(
            menuListTemp && menuListTemp[0] ? menuListTemp[0].key : null
          );
        }
      })
      .catch((error) => {
        message.error("请求异常！");
      });
  };

  const addInterface = (formData) => {
    formData.method = "GET";
    $post("/business/addOrUpdateInterface", formData)
      .then((res) => {
        if (res.code === 200) {
          getMenuList();
          setCurrentMenuId(res.data);
          message.info(res.message);
          setModalShow(false);
        } else {
          message.error(res.message);
        }
      })
      .catch((error) => {
        message.error("请求异常！");
      });
  };
  const removeInterface = (menuId) => {
    console.log("menuId: " + menuId);
    let params = {
      id: menuId,
    };
    $get("/business/deleteInterface", params)
      .then((res) => {
        if (res.code === 200) {
          getMenuList(true);
        } else {
          message.error(res.message);
        }
      })
      .catch((error) => {
        message.error("请求异常！");
      });
  };

  const renderMenuItem = (menuItem) => {
    return (
      <>
        <div className="menu-item-head">
          <div className="menu-item-title">{menuItem.url}</div>
          <div className="menu-item-method">
            <Tag color={methodColor[menuItem.method]}>{menuItem.method}</Tag>
          </div>
        </div>
        <div className="menu-item-label">{menuItem.label}</div>
      </>
    );
  };

  const renderMenu = () => {
    if (!menuList || menuList.length === 0) {
      return <Empty />;
    } else {
      return (
        <Menu
          style={{ width: 300 }}
          selectedKeys={currentMenuId}
          items={menuList}
          onClick={changMenu}
        />
      );
    }
  };

  return (
    <>
      <Modal
        className="home-modal"
        title="请输入接口名称"
        destroyOnClose
        visible={modalShow}
        onCancel={() => setModalShow(false)}
        footer={[]}
      >
        <Form
          form={interfaceForm}
          preserve={false}
          onFinish={addInterface}
          autoComplete="off"
        >
          <Form.Item name="label" rules={[{ required: true, message: "必填" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="operate-btn" htmlType="submit">
              确认
            </Button>
            <Button className="operate-btn" onClick={() => setModalShow(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Layout>
        <Sider width="300" theme="light" className="sider">
          <div className="menu-head">
            <div className="add">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalShow(true)}
              ></Button>
            </div>
            <div className="search">
              <Input placeholder="Search" />
            </div>
          </div>
          <Divider className="divider" />
          <div className="menu-body">{renderMenu()}</div>
        </Sider>
        <Layout>
          <Header className="head">
            <Head />
          </Header>
          <Content className="content">
            <Documents
              menuId={currentMenuId}
              reloadMenu={getMenuList}
              deleteInterface={removeInterface}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
