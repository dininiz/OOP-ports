// deno-lint-ignore-file

    console.log("Treshold script loaded")
    const img = new Image();
    img.src = '../img/world2.png';
    img.crossOrigin = 'Anonymous';
    img.onload = function() {

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const gridRows = 84;
        const gridCols = 128;
        const threshold = 128; 

        for (let i = 1; i <= gridRows; i++) {
            for (let j = 1; j <= gridCols; j++) {

                const x = Math.floor((j - 0.5) * img.width / gridCols);
                const y = Math.floor((i - 0.5) * img.height / gridRows);
                let pixel;
                try {
                    pixel = ctx.getImageData(x, y, 1, 1).data;
                } catch (e) {
                    continue;
                }
                const brightness = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
                const value = brightness < threshold ? 0 : 255;
                if (value === 0) {
                    const square = document.getElementById(`${i}-${j}`);
                 if (square) square.classList.add('square-dark');
                }
            }
        }

        document.body.removeChild(canvas);
    };