import React from "react";
import { Layout, Menu, Button, Typography } from "antd";
import { UserOutlined, ClockCircleOutlined, TeamOutlined, LogoutOutlined } from "@ant-design/icons";
import { UserProfile } from "../interfaces/common.interface";

const { Header } = Layout;
const { Text } = Typography;

interface TopNavbarProps {
  profile: UserProfile;
  onSignOut: () => void;
  onNavigate: (key: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ profile, onSignOut, onNavigate }) => {
  return (
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["timeline"]}
          onClick={(e) => onNavigate(e.key)}
          items={[
            {
              key: "timeline",
              icon: <ClockCircleOutlined />,
              label: "Timeline",
            },
            {
              key: "users",
              icon: <TeamOutlined />,
              label: "Users",
            },
          ]}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Text style={{ color: "white" }}><UserOutlined /> {profile?.name}</Text>
          <Button icon={<LogoutOutlined />} onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </Header>
  );
};

export default TopNavbar;
