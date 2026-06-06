

export function getRandomColor(seed: string): string {

    const colors = [
        '#FF0000', '#00FF00', '#0FF0FF',
        '#FFFA1B', '#FFAFAF', "#f97316",
        "#A72FEF", "#FF72A1", "#91A101"
    ];

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
    }
    return colors[Math.abs(hash) % colors.length];
    // return colors[Math.floor(Math.random() * colors.length)];
}


// export async function syncState(fileId: string, yDoc: Doc) {
//     console.log("Syncing state for file: ", fileId);
//     const state = await apiClient.file.getState(fileId);
//     if (state.byteLength > 0) {
//         applyUpdate(yDoc, state);
//     }
// }

