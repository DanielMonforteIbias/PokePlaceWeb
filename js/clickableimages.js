document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img.zoomable').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'zoom-overlay';
        const zoomedImg = document.createElement('img');
        zoomedImg.src = img.src;
        overlay.appendChild(zoomedImg);
        overlay.addEventListener('click', () => {
          overlay.remove();
        });
        document.body.appendChild(overlay);
      });
    });
  });