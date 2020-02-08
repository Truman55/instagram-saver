/**
 * Проверка строки на наличиe ссылки на Instagram
 * @param {string} url
 * @returns {string}
 */
export default function matchInstagramId (url) {
    const matches = url.match(/^https?:\/\/(?:www\.)?instagram\.com\/p\/([\\aA-zZ0-9-_]+)\//);
    return matches ? matches[1] : '';
}