document.addEventListener('DOMContentLoaded', () => {
    setupDraggableElements();
    setupFolderOpenEvents();
    setupClosableWindows();
});

// Initialize z-index values
let currentZIndex = 100; // For draggable elements

function setupDraggableElements() {
    document.querySelectorAll('.window .title-bar').forEach(titleBar => {
        const windowElement = titleBar.closest('.window');
        // Ensure windows start with a higher z-index to appear in front of folders
        windowElement.style.zIndex = currentZIndex++;

        titleBar.addEventListener('mousedown', function(event) {
            // Update z-index to bring the window to the front when dragged
            windowElement.style.zIndex = ++currentZIndex;
            dragElement(windowElement, event);
        });
    });

    document.querySelectorAll('#desktop > .file').forEach(folder => {
        folder.addEventListener('mousedown', function(event) {
            if (event.target.closest('a, button')) return;
            // Update z-index within the folder layer but ensure it's below windows
            folder.style.zIndex = ++currentZIndex;
            dragElement(folder, event);
        });
    });
}

function setupFolderOpenEvents() {
    document.querySelectorAll('.file').forEach(file => {
        if (!file.closest('.content')) {
            file.addEventListener('dblclick', function() {
                const windowId = file.getAttribute('data-target');
                if (windowId) {
                    const windowEl = document.getElementById(windowId);
                    // Ensure the opened window is brought to the front
                    windowEl.style.zIndex = ++currentZIndex;
                    toggleWindow(windowId);
                }
            });
        }
    });
}

function dragElement(element, e) {
    e.preventDefault();
    let pos1 = 0, pos2 = 0, pos3 = e.clientX, pos4 = e.clientY;

    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', stopElementDrag);

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function stopElementDrag() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', stopElementDrag);
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
