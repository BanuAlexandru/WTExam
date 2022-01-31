const express = require('express')
const Sequelize = require('sequelize')
const cors = require('cors')
const bodyParser = require('body-parser')

const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage: 'sample.db',
        define: {
            timestamps: false
        }
    }
)

//DEFINING FIRST ENTITY, JOBPOSTING
const JobPosting = sequelize.define('jobPosting',
    {
        id: 
        {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        description: Sequelize.STRING,
        deadline: Sequelize.DATE
    }
)

//DEFINING SECOND ENTITY, CANDIDATE
const Candidate = sequelize.define('candidate', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: Sequelize.STRING,
        cv: Sequelize.TEXT,
        email: Sequelize.STRING
    }
)

//DEFINING THE RELATION BETWEEN THE TWO ENTITIES
JobPosting.hasMany(Candidate)

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/sync', async (req, res) => 
    {
        try {
            await sequelize.sync({ force: true })
            res.status(201).json({ message: 'created' })
        } catch (error) {
            res.status(500).json({ message: 'server-side error' })
            console.warn(error)
        }
    }
)

//OPERATIONS FOR THE FIRST ENTITY, JOBPOSTING
app.get('/jobPostings', async (req, res) => 
    {
        try {
            const jobPostings = await JobPosting.findAll()
            res.status(201).json(jobPostings)
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.post('/jobPostings', async (req, res) => 
    {
        try {
            const jobPosting = req.body
            await JobPosting.create(jobPosting)
            res.status(201).json({ message: 'created' })
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.get('/jobPostings/:jid', async (req, res) => 
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid, { include: Candidate })
            if (jobPosting) {
                res.status(201).json(jobPostings)
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.put('/jobPostings/:jid', async (req, res) =>
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid)
            if (jobPosting) {
                await jobPosting.update(req.body, {
                    fields: ['description', 'deadline']
                })
                res.status(202).json({ message: 'accepted'})
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.delete('/jobPostings/:jid', async (req, res) =>
{
    try {
        const jobPosting = await JobPosting.findByPk(req.params.jid)
        if (jobPosting) {
            await jobPosting.destroy()
            res.status(202).json({ message: 'accepted'})
        } 
        else 
        {
            res.status(404).json({ message: 'could not find posting of the requested id' })
        }
    } catch (error) {
        res.status(500).json({ message: 'an error occured' })
        console.warn(error)
    }
}
)

//OPERATIONS FOR THE SECOND ENTITY, CANDIDATE
app.get('jobPostings/:jid/candidates', async (req, res) => 
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid)
            if (jobPosting) {
                const candidate = await jobPosting.getCandidate()
                res.status(200).json(candidate)
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.post('jobPostings/:jid/candidates', async (req, res) => 
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid)
            if (jobPosting) {
                const candidate = req.body
                candidate.candidateId = jobPosting.id
                await Candidate.create(candidate)
                res.status(200).json({ message: 'created' })
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.get('jobPostings/:jid/candidates', async (req, res) => 
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid)
            if (jobPosting) {
                const candidate = await jobPosting.getCandidate({ where: {id: req.params.jid}})
                if (candidate) {
                    res.status(200).json(candidate)
                }
                else
                {
                    res.status(404).json({ message: 'candidate not found' })
                }
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.put('jobPostings/:jid/candidates', async (req, res) => 
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid)
            if (jobPosting) {
                const candidate = await jobPosting.getCandidate({ where: {id: req.params.jid}})
                if (candidate) {
                    await candidate.update(req.body)
                    res.status(200).json({ message: 'accepted' })
                }
                else
                {
                    res.status(404).json({ message: 'candidate not found' })
                }
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.delete('jobPostings/:jid/candidates', async (req, res) => 
    {
        try {
            const jobPosting = await JobPosting.findByPk(req.params.jid)
            if (jobPosting) {
                const candidate = await jobPosting.getCandidate({ where: {id: req.params.jid}})
                if (candidate) {
                    await candidate.destroy
                    res.status(200).json({ message: 'accepted' })
                }
                else
                {
                    res.status(404).json({ message: 'candidate not found' })
                }
            } 
            else 
            {
                res.status(404).json({ message: 'could not find posting of the requested id' })
            }
        } catch (error) {
            res.status(500).json({ message: 'an error occured' })
            console.warn(error)
        }
    }
)

app.listen(8080)