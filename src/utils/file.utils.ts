export function calculateFileSize(fileSize: number) {
    if (fileSize / Math.pow(1000, 3) > 1) {
        return `${(fileSize / Math.pow(1000, 3)).toFixed(3)} GB`;
    } else if (fileSize / Math.pow(1000, 2) > 1) {
        return `${(fileSize / Math.pow(1000, 2)).toFixed(3)} MB`;
    } else if (fileSize / 1000 > 1) {
        return `${(fileSize / 1000).toFixed(3)} KB`;
    } else {
        return `${fileSize} bytes`;
    }
}
export function calculateExpiry(date: Date) {
    const expiryDate = new Date(date);
    expiryDate.setHours(expiryDate.getHours() + 24);

    const currentDate = new Date();
    const timeDifference: number = expiryDate.getTime() - currentDate.getTime();

    // Convert milliseconds to hours
    const remainingHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (remainingHours > 1) {
        return remainingMinutes > 1
            ? `${remainingHours}h ${remainingMinutes}min`
            : `${remainingHours}h`;
    }
    if (remainingMinutes > 1) {
        return `${remainingMinutes}min`;
    }
    return null
}