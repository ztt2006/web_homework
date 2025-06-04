/**
 * Fetches JSON data from the specified path.
 * @param {string} path - The path to the JSON file relative to the 'data' directory.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON data.
 */
export async function loadData(path) {
    const response = await fetch(`data/${path}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for path: ${path}`);
    }
    return response.json();
}