import React from "react";
import "./index.less";
import { PageHeader, Tag } from "antd";

const projectInfo = {
  projectName: "MCVV",
  interfaceCount: 28,
};

export default function index() {
  return (
    <>
      <div className="head-item">
        <PageHeader
          className="site-page-header"
          onBack={() => null}
          title={projectInfo.projectName}
          tags={<Tag color="#2db7f5">{projectInfo.interfaceCount}</Tag>}
        />
      </div>
    </>
  );
}
