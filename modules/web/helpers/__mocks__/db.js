/* eslint-env jest */
// @flow

// import range from 'idb-range'

// const db = jest.genMockFromModule('../db')

// const actual = require.requireActual('../db')

class Store {
    data = new Map()

    index = name => ({
        getAll: range => {

        },
    })

    batch = async (ops) => {
        for (const [key, value] of ops) {
            if (key && value === null) {
                await this.del(key) // eslint-disable-line no-await-in-loop
            }
        }
        throw new Error('not implemented')
    }

    del = async key => {
        this.data.delete(key)
    }

    get = async key => {
        return this.data.get(key)
    }

    getAll = async () => {
        return Array.from(this.data.values())
    }

    put = async ({id, ...data}) => {
        this.data.set(id, {id, ...data})
    }
}

class Database {
    stores = new Map([
        ['courses', new Store()],
        ['courseCache', new Store()],
        ['areas', new Store()],
        ['areaCache', new Store()],
    ])

    store = (name: string) => {
        // console.log(name)
        return this.stores.get(name)
    }
}

export default new Database()

// console.log(actual.default.store('courses').put('foo'))

// export default actual.default
