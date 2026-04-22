'use client'

import { useState } from "react"
import { TabButton } from "../components/common/TabButton";
import AdminAbout from "../components/AdminAbout";
import AdminProject from "../components/AdminProject";
import AdminContact from "../components/AdminContact";
import AdminTech from "../components/AdminTech";
import AdminEvent from "../components/AdminEvent";


const Admin = () => {
  const [tab, setTab] = useState<'about' | 'tech' | 'event' | 'projects' | 'contact'>('about');

  const renderTab = () => {
    switch (tab) {
      case 'about': return <AdminAbout />
      case 'projects': return <AdminProject />
      case 'tech': return <AdminTech />
      case 'event': return <AdminEvent />
      case 'contact': return <AdminContact />
    }
  }

  return (
    <div>
      <p className="text-2xl font-bold">管理画面</p>
      <div className="flex justify-between">
        <TabButton title="about" label="プロフィール" tab={tab} setTab={setTab}/>
        <TabButton title="projects" label="プロジェクト" tab={tab} setTab={setTab}/>
        <TabButton title="tech" label="技術" tab={tab} setTab={setTab}/>
        <TabButton title="event" label="参加履歴" tab={tab} setTab={setTab}/>
        <TabButton title="contact" label="メールアドレス" tab={tab} setTab={setTab}/>
      </div>
      {renderTab()}
    </div>
  )
}

export default Admin