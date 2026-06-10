const axios = require('axios')
const LANGUAGE_MAP = require('../utils/languageMap')

async function executeCode(req, res) {
    const {code, language } = req.body

    if(!code || !language) {
        return res.status(400).json({message: 'Code and Language are required...'})
    }

    const langConfig = LANGUAGE_MAP[language]
    if(!langConfig) {
        return res.status(400).json({ message: 'Unsupported language detected'})
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.jdoodle.com/v1/execute',
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
            data: {
                script: code,
                language: langConfig.language,
                versionIndex: langConfig.versionIndex,
                clientId:     process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            },
        }
        )

        const { output, statusCode, memory, cpuTime } = response.data
        const isError = statusCode !== 200

        res.json({
            stdout:   isError ? ''     : output,
            stderr:   isError ? output : '',
            output:   output,
            exitCode: statusCode,
            status:   isError ? 'Error' : 'Accepted',
            memory:   memory  || null,
            time:     cpuTime || null,
        })
    } catch (err) {
        console.error('Jdoodle error', err.message)

        if(err.code === 'ECONNABORTED') {
            return res.status(408).json({ message: 'Execution timeout'})
        }

        res.status(500).json({message: 'Execution failed', error: err.message })
        
    }
}

module.exports = { executeCode }