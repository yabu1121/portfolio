interface Tech {
  id: number
  name: string
  level: number
  description: string
}

interface TimelineItem {
  id: number
  year: string
  month: number
  category: string
  title: string
  detail: string
}

interface Project {
  id: number
  title: string
  description: string
  techs: string[]
  github?: string
  url?: string
  image?: string
  category: "ai" | "udemy" | "self"
}


interface Links {
  id: number;
  topic: string;
  link: string;
}

  