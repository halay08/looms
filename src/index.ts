import dotenv from 'dotenv'
dotenv.config()

import { bulkDelete } from './loom'

const result = await bulkDelete('nửa')
console.log('Delete result', result)
