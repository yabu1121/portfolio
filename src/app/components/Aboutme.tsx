import React from 'react'

const Aboutme = () => {
  return (
    <div className="px-5 sm:px-8 py-6 sm:py-8 bg-white mt-8 mb-4 rounded p-4">
      <h1 className="mb-2 text-2xl font-bold">About me</h1>
      <div className="mt-4 space-y-2 px-3 py-3 text-sm sm:text-base leading-relaxed">
        <p>学校の授業では C, Java、独学では Next.js を中心に、フロントエンド技術の基礎を学習中です。</p>
        <p>目標はフルスタックエンジニアで、0から1をひとりで製作できるようなエンジニアになることです。</p>
        <p>今後は学習した基礎を用いて作品を作っていこうと思います。</p>
      </div>
    </div>
  )
}

export default Aboutme