const { mockServer } = require('graphql-tools')
const schema = require('../schemas/schema_dummy.js')

const myMockServer = mockServer(schema);

describe('data from mock api', () => {

	it('should return a data object', async () => {
		
		let res = await myMockServer.query(`{
		  books {
		    id
		    title
		  }
		}`)

		console.log(res.data.books)

		expect(res).toBeDefined()
	
	})

})