const Walker = require('../src/Walker')

describe('basic test', function () {
    it('instanciation', function () {
        const w = new Walker()
        expect(w).toBeDefined()
    })

    it('clonage simple', function () {
        const w = new Walker()
        const s1 = { a: 1, b: 2 }
        const s2 = w.walk(s1)
        expect(s2.a).toBe(1)
        expect(s2.b).toBe(2)
        expect(s1).not.toBe(s2)
        expect(s1).toEqual(s2)
    })

    it('clonage avec tableau', function () {
        const w = new Walker()
        const s1 = { a: 1, b: 2, c: [1, 2, 3] }
        const s2 = w.walk(s1)
        expect(s1).toEqual(s2)
        expect(s1.c[0]).toBe(1)
        expect(s2.c[0]).toBe(1)
        s2.c[0] = 9
        expect(s1.c[0]).toBe(1)
        expect(s2.c[0]).toBe(9)
    })

    it('clonage avec tableau dans tableau', function () {
        const w = new Walker()
        const s1 = { a: 1, b: 2, c: [['x', 'y', 'z'], 2, 3] }
        const s2 = w.walk(s1)
        s2.c[0][1] = 'abc'
        expect(s1.c[0][1]).toBe('y')
        expect(s2.c[0][1]).toBe('abc')
    })

    it('clonage avec tableau dans tableau', function () {
        const w = new Walker()
        const s1 = { a: 1, b: 2, c: [['x', 'y', { d: 7, e: 8, f: 9}], 2, 3] }
        const s2 = w.walk(s1)
        expect(s1.c[0][2].e).toBe(8)
        expect(s2.c[0][2].e).toBe(8)
    })

    it('event walk avec deletion', function () {
        const s1 = { _id: 777, _type: 'machin', a: 5, b: 9, c: 66 }
        const w = new Walker()
        w.events.on('walk', payload => {
            if (payload.key.startsWith('_')) {
                payload.delete = true
            }
        })
        const s2 = w.walk(s1)
        expect(s2).toEqual({ a: 5, b: 9, c: 66 })
    })

    it('event walk avec deletion', function () {
        const s1 = { _id: 777, _type: 'machin', a: 5, b: 9, c: 66 }
        const w = new Walker()
        w.events.on('walk', payload => {
            if (payload.key.startsWith('_')) {
                payload.delete = true
            }
        })
        const s2 = w.walk(s1)
        expect(s2).toEqual({ a: 5, b: 9, c: 66 })
    })

    it('event walk avec modif de clé/valeur', function () {
        const s1 = { _id: 777, _type: 'machin', a: 5, b: 9, c: 66 }
        const w = new Walker()
        w.events.on('walk', payload => {
            if (payload.key.startsWith('_')) {
                payload.key = payload.key.substr(1)
            }
        })
        const s2 = w.walk(s1)
        expect(s2).toEqual({ id: 777, type: 'machin', a: 5, b: 9, c: 66 })
    })

    it('test grandeur nature 1', function () {
        const s1 = [
            { _id: 123456, _type: 'personnel', _key: 'personnel::123456', nom: 'toto', unites: [ { _id: 132, _type: 'unite', _key: 'unite::132', nom: 'sdml'}]},
            { _id: 456789, _type: 'personnel', _key: 'personnel::456789', nom: 'toto2', unites: [ { _id: 132, _type: 'unite', _key: 'unite::132', nom: 'sdml'}]},
            { _id: 159489, _type: 'personnel', _key: 'personnel::159489', nom: 'toto3', unites: [ { _id: 132, _type: 'unite', _key: 'unite::132', nom: 'sdml'}]}
        ]
        const w = new Walker()
        w.events.on('walk', payload => {
            if (payload.key === '_id') {
                payload.key = 'id'
            } else if (payload.key.startsWith('_')) {
                payload.delete = true
            }
        })
        const s2 = w.walk(s1)
        expect(s2[0]).toEqual({ id: 123456, nom: 'toto', unites: [ { id: 132, nom: 'sdml'}]})
        expect(s2[1]).toEqual({ id: 456789, nom: 'toto2', unites: [ { id: 132, nom: 'sdml'}]})
        expect(s2[2]).toEqual({ id: 159489, nom: 'toto3', unites: [ { id: 132, nom: 'sdml'}]})
    })
})
