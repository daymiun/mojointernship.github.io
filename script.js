document.addEventListener('DOMContentLoaded', () => {
    setupDraggableElements();
    setupFolderOpenEvents();
    setupClosableWindows();
    setupMobileDoubleTap();
});

let currentZIndex = 100; // Initialize z-index values for draggable elements

function setupDraggableElements() {
    document.querySelectorAll('.window .title-bar').forEach(titleBar => {
        const windowElement = titleBar.closest('.window');
        windowElement.style.zIndex = currentZIndex++;

        titleBar.addEventListener('mousedown', startDrag);
        titleBar.addEventListener('touchstart', startDrag);
        
        windowElement.addEventListener('click', () => {
    windowElement.style.zIndex = ++currentZIndex;
});

    });

    document.querySelectorAll('#desktop > .file').forEach(folder => {
        folder.addEventListener('mousedown', startDrag);
        folder.addEventListener('touchstart', startDrag);
    });

    function startDrag(event) {
        event.preventDefault();
        if (event.target.closest('a, button')) return;
        let dragEvent = event.type.includes('mouse') ? event : event.touches[0];
        dragElement(this.closest('.window') || this, dragEvent);
    }
}

function setupFolderOpenEvents() {
    document.querySelectorAll('.file').forEach(file => {
        if (!file.closest('.content')) {
            file.addEventListener('dblclick', function() {
                const windowId = file.getAttribute('data-target');
                if (windowId) {
                    const windowEl = document.getElementById(windowId);
                    windowEl.style.zIndex = ++currentZIndex;
                    toggleWindow(windowId);
                }
            });
        }
    });
}

function setupMobileDoubleTap() {
    let lastTap = { time: 0, target: null };

    document.querySelectorAll('.file').forEach(file => {
        file.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap.time;

            if (tapLength < 300 && lastTap.target === e.target) {
                // Considered a double tap
                const windowId = file.getAttribute('data-target');
                if (windowId) {
                    const windowEl = document.getElementById(windowId);
                    windowEl.style.zIndex = ++currentZIndex;
                    toggleWindow(windowId);
                }
            }

            lastTap = { time: currentTime, target: e.target };
        });
    });
}

function dragElement(element, e) {
    let pos1 = 0, pos2 = 0, pos3 = e.clientX || e.pageX, pos4 = e.clientY || e.pageY;

    if (!e.clientX) { // Adjust for touch events
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
    }

    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('touchmove', elementDrag);
    document.addEventListener('mouseup', stopElementDrag);
    document.addEventListener('touchend', stopElementDrag);

    function elementDrag(e) {
        e.preventDefault();
        if (e.type.includes('touch')) {
            e = e.touches[0];
        }
        
        pos1 = pos3 - (e.clientX || e.pageX);
        pos2 = pos4 - (e.clientY || e.pageY);
        pos3 = e.clientX || e.pageX;
        pos4 = e.clientY || e.pageY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function stopElementDrag() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchmove', elementDrag);
        document.removeEventListener('mouseup', stopElementDrag);
        document.removeEventListener('touchend', stopElementDrag);
    }
}

function toggleWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    windowEl.style.display = windowEl.style.display === 'block' ? 'none' : 'block';
}

function setupClosableWindows() {
    document.querySelectorAll('.close-btn').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const windowElement = this.closest('.window');
            windowElement.style.display = 'none';
        });
    });
}

function setupClosableWindows() {
    document.querySelectorAll('.close-btn').forEach(closeBtn => {
        // Handle click event for desktop
        closeBtn.addEventListener('click', function() {
            const windowElement = this.closest('.window');
            windowElement.style.display = 'none';
        });

        // Handle touchend event for mobile
        closeBtn.addEventListener('touchend', function(event) {
            event.preventDefault(); // Prevents additional mouse events
            const windowElement = this.closest('.window');
            windowElement.style.display = 'none';
        });
    });
}
// Bouncing logic for the text element
document.addEventListener('DOMContentLoaded', () => {
    const bouncingText = document.getElementById('bouncingText');
    let posX = 0, posY = 0, dirX = 1, dirY = 1;

    const moveText = () => {
        const maxX = window.innerWidth - bouncingText.offsetWidth;
        const maxY = window.innerHeight - bouncingText.offsetHeight;

        // Update the position
        posX += dirX;
        posY += dirY;

        // Reverse direction if hitting boundaries
        if (posX >= maxX || posX <= 0) dirX *= -1;
        if (posY >= maxY || posY <= 0) dirY *= -1;

        // Apply the position
        bouncingText.style.left = `${posX}px`;
        bouncingText.style.top = `${posY}px`;
    };

    // Move every 10 milliseconds for a smoother animation
    setInterval(moveText, 14);
});
