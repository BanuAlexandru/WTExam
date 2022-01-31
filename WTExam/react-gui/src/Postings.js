import {EventEmitter} from 'fbemitter'

const SERVER = 'http://localhost:8080'

class Postings {
    
    constructor () 
    {
        this.data = []
        this.emitter = new EventEmitter()
    }

    async getPostings() 
    {
        try {
            const response = await fetch(`${SERVER}/jobPostings`)
            if (!response.ok){
                throw response
            }
            this.data = await response.json()
            this.emitter.emit('GET_POSTINGS_SUCCESFULLY')
        } catch (error) {
            console.warn(error)
            this.emitter.emit('GET POSTINGS ERROR')
        }
    }

    async addPosting(jobPosting) 
    {
        try {
            const response = await fetch(`${SERVER}/jobPostings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobPosting)
            })
            if (!response.ok){
                throw response
            }
            this.getPostings()
        } catch (error) {
            console.warn(error)
            this.emitter.emit('ADD POSTINGS ERROR')
        }
    }

    async savePosting(id, jobPosting)
    {
        try {
            const response = await fetch(`${SERVER}/jobPostings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobPosting)
            })
            if (!response.ok){
                throw response
            }
            this.getPostings()
        } catch (error) {
            console.warn(error)
            this.emitter.emit('SAVE POSTINGS ERROR')
        }
    }

    async deletePosting(id)
    {
        try {
            const response = await fetch(`${SERVER}/jobPostings/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok){
                throw response
            }
            this.getPostings()
        } catch (error) {
            console.warn(error)
            this.emitter.emit('DELETE POSTINGS ERROR')
        }
    }
}

const postings = new Postings()

export default postings