const request = require('supertest');
const app = require('./app');

describe('Tests for /api/cars', () => {
    test('GET /api/cars succeeds', () => {
        return request(app)
	    .get('/api/cars')
	    .expect(200);
    });

    test('GET /api/cars returns JSON', () => {
        return request(app)
	    .get('/api/cars')
	    .expect('Content-type', /json/);
    });

    test('GET /api/cars includes ford', () => {
        return request(app)
	    .get('/api/cars')
	    .expect(/ford/);
    });

    test('GET /api/cars/car1 succeeds', () => {
        return request(app)
	    .get('/api/cars/car1')
	    .expect(200);
    });

    test('GET api/cars/car1 returns JSON', () => {
        return request(app)
	    .get('/api/cars/car1')
	    .expect('Content-type', /json/);
    });

    test('GET api/cars/car1 includes 40', () => {
        return request(app)
	    .get('/api/cars/car1')
	    .expect(/"id":"car1"/);
    });

    test('POST /api/cars succeeds', () => {
        const params = {"make": "test_make", "model":"test_model", "capacity":0, "available":"no"};
        post_response = request(app)
        .post("/api/cars")
        .send(params)
	    .expect(200);
        console.log("POSTRESPONSE", post_response)
        return request(app)
        .delete("/api/cars/" + post_response.id)
        .expect(204)
        
        
        

    });

    test('GET /api/cars contains car just posted', () => {
        return request(app)
        .get(url) 
        .send(params) 
	    .expect(200);
    });
});


//test to see if posted result is in get request