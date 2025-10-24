import Image from "next/image"

const Projects = () => {
  return (
    <div>
      <div>
        <div>
          <Image 
            src="https://placehold.jp/300x200.png"
            alt="dummy"
            width={100}
            height={100}
          />
        </div>
      </div>
      <div>
        <div>
          <h3>title</h3>
        </div>
        <p>description</p>
        <div>
          <h4>使用技術:</h4>
          <div>
            <span>
              <span>name</span>
            </span>
            <span>
              <span>name</span>
            </span>
            <span>
              <span>name</span>
            </span>
            <span>
              <span>name</span>
            </span>
          </div>
        </div>
        <div>
            <a href="">view</a>
            <a href="">github</a>
        </div>
      </div>
      </div>
  )
}

export default Projects