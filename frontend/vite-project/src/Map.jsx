import React from 'react';

const ImageGrid = () => {
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
    height: '100vh', // Set the height to 100% of the viewport height
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

  return (
    <div style={gridStyle}>
      {images.map((src, index) => (
        <div key={index} style={gridItemStyle}>
          <img src={src} alt={`Image ${index}`} style={imgStyle} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;