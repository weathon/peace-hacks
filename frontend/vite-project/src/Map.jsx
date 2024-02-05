import React from 'react';

const ImageGrid = (props) => {
  const images = [
    "/lab.png",
    "/dining.png",
    "/cctv.png",
    "/office.png"
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px', // Adjust the gap between images as needed
    height: '50vh',
  };

  const gridItemStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc', // Add borders to each image container if desired
    padding: '10px', // Add padding around each image container if desired
    width: '100%', // Ensure each grid item spans the full width of its column
    height: '100%', // Ensure each grid item spans the full height of its row
  };

  const imgStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  };

  const room = ["lab", "dining", "CCTV", "office"]
  return (
    <>
      <a href="http://file.weasoft.com:8000/history">Download Text History</a>
      In the hushed corridors of academia, where ambition whispers as loudly as scholarship, Alex's future hung by a thread, frayed by an accusation as unexpected as it was severe. A sabotaged science project stood at the heart of the scandal, with evidence pointing squarely at Alex. Yet, beneath the surface of this academic betrayal lay a deeper, more cunning plot orchestrated by Lisa, a rival cloaked in the guise of a colleague. With the clock ticking and alliances in question, Alex's journey to clear their name and uncover the truth begins, setting the stage for a battle of wits and wills within the venerable walls of the university. 
      <div style={gridStyle}>
        {images.map((src, index) => (
          <div key={index} style={gridItemStyle}>
            <img src={src} onClick={() => {
              props.setCUrrentRoom(room[index])
            }} alt={`Image ${index}`} style={imgStyle} />
          </div>
        ))}
      </div ></>
  );
};

export default ImageGrid;