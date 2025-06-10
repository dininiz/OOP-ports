// deno-lint-ignore-file prefer-const
    console.log("Zoom script loaded");
    
    let currentZoom = 1;
    let minZoom = 1;
    let maxZoom = 5;
    let stepSize = 0.21;

    let _startX = 0;
    let _startY = 0;
    let _offsetX = 0;
    let _offsetY = 0;
    let _dragElement = null;

    let container = document.getElementById("container");

    container.addEventListener("wheel", function (event) {
        // Zoom in or out based on the scroll direction
        let direction = event.deltaY > 0 ? -1 : 1;
        zoomImage(direction);
    });

    function zoomImage(direction) {
        let newZoom = currentZoom + direction * stepSize;

        // Limit the zoom level to the minimum and maximum values
        if (newZoom < minZoom || newZoom > maxZoom) {
            return;
        }

        currentZoom = newZoom;

        // Update the CSS transform of the image to scale it
        container.style.transform = "scale(" + currentZoom + ")";
        console.log("Zoom level: " + currentZoom);

        // Set the transform origin to the center when zooming out
        if (currentZoom <= 1) {
            container.style.transformOrigin = "center center";
            centerContainer();
        }
    }

    function centerContainer() {
        // Calculate the center position based on the viewport size
        const viewportWidth = globalThis.innerWidth;
        const viewportHeight = globalThis.innerHeight;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Center the container
        container.style.left = (viewportWidth - containerWidth) / 2 + "px";
        container.style.top = (viewportHeight - containerHeight) / 2 + "px";
    }
    function OnMouseDown(event) {
        // Allow dragging only when zoom level is greater than 1
        if (currentZoom > 1) {
            document.onmousemove = OnMouseMove;
            _startX = event.clientX;
            _startY = event.clientY;
            _offsetX = container.offsetLeft;
            _offsetY = container.offsetTop;
            _dragElement = container;
        }
    }

    function OnMouseMove(event) {
        if (_dragElement) {
            _dragElement.style.left = _offsetX + event.clientX - _startX + "px";
            _dragElement.style.top = _offsetY + event.clientY - _startY + "px";
        }
    }

    function OnMouseUp(_event) {
        document.onmousemove = null;
        _dragElement = null;
    }

    // Attach mouse event listeners
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
