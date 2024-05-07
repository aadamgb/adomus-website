// Dynamically inject images into the image container
const imageContainer = document.getElementById('toggle');
const numberOfImages = 4; // Change this to any number of images
const duration = numberOfImages * 2; // Total animation duration (2 seconds per image)

for (let i = 1; i <= numberOfImages; i++) {
  const img = document.createElement('img');
  img.src = `./assets/Cover-food/food${i}.svg`; // Make sure you have the correct image filenames
  img.alt = `Image ${i}`;
  img.className = 'animated-image';
  img.style.animation = `imageTransition ${duration}s linear infinite`;
  img.style.animationDelay = `${(i - 1) * 2}s`;
  imageContainer.appendChild(img);
}
