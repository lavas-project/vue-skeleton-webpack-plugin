/**
 * @file utils
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable fecs-no-require */

module.exports.insertAt = (origin, str, pos) => [
    origin.slice(0, pos),
    str,
    origin.slice(pos)
].join('');
