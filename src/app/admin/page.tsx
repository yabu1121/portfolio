'use client'

import { useState } from "react"
import AdminAbout from "../components/AdminAbout";
import AdminProject from "../components/AdminProject";
import AdminContact from "../components/AdminContact";
import { TabButton } from "../components/common/TabButton";


const Admin = () => {
  const [tab, setTab] = useState<'about' | 'projects' | 'contact'>('about');

  const renderTab = () => {
    switch (tab) {
      case 'about': return <AdminAbout />
      case 'projects': return <AdminProject />
      case 'contact': return <AdminContact />
    }
  }

  return (
    <div>
      <p>管理画面</p>
      <div className="flex justify-between">
        <TabButton title="about" label="プロフィール" tab={tab} setTab={setTab}/>
        <TabButton title="projects" label="プロジェクト" tab={tab} setTab={setTab}/>
        <TabButton title="contact" label="メールアドレス" tab={tab} setTab={setTab}/>
      </div>
      {renderTab()}
    </div>
  )
}

export default Admin