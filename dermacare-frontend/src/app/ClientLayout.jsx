"use client";
import { Poppins } from "next/font/google";
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;
const menuItems = [
  { key: '1', label: 'Tool' },
  { key: '2', label: 'About' },
];

// Load the font
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

// Remove metadata from client component
export default function ClientLayout({ children }) {
  return (
    <Layout className={`${poppins.className} min-h-screen antialiased`}>
      <Header className="fixed z-10 w-full bg-gray-800 flex items-center gap-12">
        <h1 className="text-white text-xl font-bold">DermaCare</h1>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
      </Header>
      <Content className="pt-16 flex-1">
        <div className="p-6 bg-slate-300 min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </Content>
    </Layout>
  );
}