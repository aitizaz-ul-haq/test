import Image from "next/image";
export default function ProjectsSectionTwo() {
  return (
    <>
      <div className="project-section margintop">
        <div className="right-section-project">
          <div className="pic-container">
            <Image
              src="/partnerhip_two.png"
              alt="My Awesome Image"
              width={650}
              height={435}
            />
          </div>
        </div>
        <div className="left-section-project">
          <h2 className="project-heading">Project</h2>
          <p className="project-description">
            simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled
            it to make a type specimen book. It has survived not only five
            centuries
          </p>
          <div className="project-button-container">
            <button className="project-button">Discover More</button>
          </div>
        </div>
      </div>
    </>
  );
}
