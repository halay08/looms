import dotenv from 'dotenv'
dotenv.config()

import { bulkDelete } from './loom'

const result = await bulkDelete('ER')
console.log('Delete result', result)
