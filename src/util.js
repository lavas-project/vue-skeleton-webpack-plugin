/**
 * @file utils
 * @author panyuqi <panyuqi@baidu.com>
 */

module.exports.insertAt = (origin, str, pos) => [
    origin.slice(0, pos),
    str,
    origin.slice(pos)
].join('');
