/**
 * @file utils
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable fecs-no-require */

module.exports = {
    insertAt: (origin, str, pos) => {
        return [
            origin.slice(0, pos),
            str,
            origin.slice(pos)
        ].join('');
    },

    isObject: (obj) => Object.prototype.toString.call(obj).match('Object')
}
