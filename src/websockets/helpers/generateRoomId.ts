export function generateRoomName(to: string, from: string) {
    const sortedIds = [to, from].sort();

    return sortedIds.join('');
}
