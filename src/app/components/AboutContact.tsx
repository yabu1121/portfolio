import Link from 'next/link'

const AboutContact = () => {
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white rounded my-4">
      <h2 className="text-center text-2xl font-medium">Contact</h2>
      <Link href="/contact"><p className="mx-auto m-4 text-white bg-blue-500 px-4 p-2 rounded w-fit hover:bg-blue-400">こちらからお気軽にご連絡ください。</p></Link>
    </section>
  )
}

export default AboutContact