/**
 * Files common functions
 */
export const FileHelper = {
    /**
     * Humanize file size in bytes
     *
     * @param {number} size
     */
    formatSize (size) {
        if (!size) {
            return size;
        }
        if (size < 1024) {
            return size + ' bytes';
        }
        if (size < 1048576) {
            return (size / 1024).toFixed(2) + 'KB';
        }
        if (size < 1073741824) {
            return (size / 1048576).toFixed(2) + 'MB';
        }
        return (size / 1073741824).toFixed(2) + 'GB';
    }
};

