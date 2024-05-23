const urlParams = new URLSearchParams(window.location.search);
const group_name = urlParams.get('group_id');
console.log(group_name);

// src/static/js/test.js

document.addEventListener('DOMContentLoaded', async () => {


    if (!group_name) {
        console.error('Group ID not found in query parameters');
        return;
    }

    try {
        const response = await fetch(`/list-plots?group_id=${group_name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debugging output

        if (!data.plot_paths) {
            console.error('plot_paths is not defined in response data');
            return;
        }

        const plotPaths = data.plot_paths;

        const plotContainer = document.getElementById('plot-container');
        plotContainer.innerHTML = ''; // Clear previous plots

        plotPaths.forEach(plotPath => {
            const img = document.createElement('img');
            img.src = plotPath;
            img.alt = 'Plot Image';
            plotContainer.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching plots:', error);
    }
});
