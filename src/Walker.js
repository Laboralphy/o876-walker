const EventManager = require('events')

class Walker {
    constructor () {
        this._events = new EventManager()
    }

    get events () {
        return this._events
    }

    /**
     * Object iteration with a callback
     * @param oObject {object} object to be iterated
     * @param f {function} function called back for each object property
     */
    iterate (oObject, f) {
        for (const x in oObject) {
            if (Object.prototype.hasOwnProperty.call(oObject, x)) {
                f(oObject[x], x, oObject)
            }
        }
    }

    getType(x) {
        const sType = typeof x
        switch (sType) {
            case 'object':
                if (x === null) {
                    return 'null'
                } else if (Array.isArray(x)) {
                    return 'array'
                } else {
                    return 'object'
                }

            default:
                return sType
        }
    }

    /**
     * @param aTarget {[]}
     * @param name {string} array name useful for tracking dependency
     * @return {[]} clone of aTarget
     */
    walkArray(aTarget, name) {
        return aTarget.map(e => this.walk(e))
    }

    /**
     * @param oTarget
     * @returns {object}
     */
    walkObject(oTarget) {
        const oClone = {}
        this.iterate(oTarget, (value, key) => {
            const payload = { key, value, delete: false }
            this.events.emit('walk', payload)
            if (!payload.delete) {
                oClone[payload.key] = this.walk(payload.value)
            }
        })
        return oClone
    }

    /**
     * Installs a proxy on an object to make it reactive
     * @param target {object|[]|*}
     * @param name {string}
     */
    walk(target, name = undefined) {
        switch (this.getType(target)) {
            case 'object':
                return this.walkObject(target)

            case 'array':
                return this.walkArray(target, name)

            default:
                return target
        }
    }
}

module.exports = Walker
