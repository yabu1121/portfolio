import Link from 'next/link'
import Section from './common/Section'

const AboutContact = () => {
  return (
    <Section className="bg-white rounded">
      <h2 className="text-center text-2xl font-medium">Contact</h2>
      <Link href="/contact"><p className="mx-auto m-4 text-white bg-blue-500 px-4 p-2 rounded w-fit hover:bg-blue-400">こちらからお気軽にご連絡ください。</p></Link>
    </Section>
  )
}

export default AboutContact