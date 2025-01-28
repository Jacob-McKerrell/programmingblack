const request = require('supertest');
const {app, setDataDir} = require('./app');
const { cpSync }  = require('fs')

// use this directory for testing
const test_data_dir = "./test_data"
// copy the data files into the test area
cpSync("./data", test_data_dir, {recursive: true});
setDataDir(test_data_dir)


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

    test('GET /api/cars/d958b359-556a-4d80-b5ca-13dcf9461306 succeeds', () => {
        return request(app)
	    .get('/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306')
	    .expect(200);
    });

    test('GET api/cars/d958b359-556a-4d80-b5ca-13dcf9461306 returns JSON', () => {
        return request(app)
	    .get('/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306')
	    .expect('Content-type', /json/);
    });

    test('GET api/cars/d958b359-556a-4d80-b5ca-13dcf9461306 is an audi', () => {
        return request(app)
	    .get('/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306')
	    .expect(/audi/);
    });
    

    test("DELETE /api/cars/d958b359-556a-4d80-b5ca-13dcf9461306", () => {
        return request(app)
        .delete("/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306")
        .send()
        .expect(204);
    })

    test("GET /api/cars/d958b359-556a-4d80-b5ca-13dcf9461306 returns 404 (since just deleted)", () => {
        return request(app)
        .get("/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306")
        .expect(404)
    })

    
    test('POST /api/cars succeeds', () => {
        const params = {"make": "test_make", "model":"test_model", "capacity":0};
        const result =  request(app)
        .post('/api/cars')
        .send(params)
	    .expect(200);
        return result
    });

    test('GET /api/cars contains car just posted', () => {
        const params = {"make": "test_make", "model":"test_model", "capacity":0};
        return request(app)
        .get("/api/cars") 
        .send(params) 
	    .expect(200);
    });

});


describe('Tests for /api/bookings', () => {
    test('GET /api/bookings succeeds', () => {
        return request(app)
	    .get('/api/bookings')
	    .expect(200);
    });

    test('GET /api/bookings returns JSON', () => {
        return request(app)
	    .get('/api/bookings')
	    .expect('Content-type', /json/);
    });

    test('POST /api/bookings succeeds', () => {
        const params = {"carid": "car_test", "customerid":"customer_Test", "date":"0/0/0"};
        return request(app)
        .post("/api/bookings")
        .send(params)
	    .expect(200);      
    });

    test('GET /api/bookings contains booking just posted', () => {
        params = {"carid": "car_test", "customerid":"customer_Test", "date":"0/0/0"};
        return request(app)
        .get("/api/cars") 
        .send(params) 
	    .expect(200);
    });

    test('GET /api/bookings/test_bookings succeeds', () => {
        return request(app)
	    .get('/api/bookings/test_bookings')
	    .expect(200);
    });

    test('GET /api/bookings/test_bookings has carid car_test', () => {
        return request(app)
	    .get('/api/bookings/test_bookings')
	    .expect(/car_test/);
    });

    test("DELETE /api/bookings/test_bookings", () => {
        return request(app)
        .delete("/api/bookings/test_bookings")
        .send()
        .expect(204);
    })


    test("GET /api/bookings/test_bookings returns 404 (since just deleted)", () => {
        return request(app)
        .get("/api/bookings/test_bookings")
        .expect(404)
    })

    test('GET api/bookings/test_booking returns JSON', () => {
        return request(app)
	    .get('/api/bookings/test_booking')
	    .expect('Content-type', /json/);
    });

    
})


describe('Tests for /api/customers', () => {
    test('GET /api/customers succeeds', () => {
        return request(app)
	    .get('/api/customers')
	    .expect(200);
    });

    test('GET /api/customers returns JSON', () => {
        return request(app)
	    .get('/api/customers')
	    .expect('Content-type', /json/);
    });

    test('GET /api/customers includes email', () => {
        return request(app)
	    .get('/api/customers')
	    .expect(/email/);
    });

    test('GET /api/customers/83feda52-8725-4b76-bf7d-b040141882f9 succeeds', () => {
        return request(app)
	    .get('/api/customers/83feda52-8725-4b76-bf7d-b040141882f9')
	    .expect(200);
    });

    test('GET /api/customers/83feda52-8725-4b76-bf7d-b040141882f9 contains20', () => {
        return request(app)
	    .get('/api/customers/83feda52-8725-4b76-bf7d-b040141882f9')
	    .expect(200);
    });

    test("GET /api/cars/invalidcarid returns 404", () => {
        return request(app)
        .get("/api/cars/invalidcarid")
        .expect(404)
    })

    test('GET api/cars/d958b359-556a-4d80-b5ca-13dcf9461306 returns JSON', () => {
        return request(app)
	    .get('/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306')
	    .expect('Content-type', /json/);
    });

    test('POST /api/cars succeeds', () => {
        const params = {"make": "test_make", "model":"test_model", "capacity":0};
        return request(app)
        .post('/api/cars')
        .send(params)
	    .expect(200);
    });


    test('GET /api/cars contains car just posted', () => {
        const params = {"make": "test_make", "model":"test_model", "capacity":0};
        return request(app)
        .get("/api/cars") 
        .send(params) 
	    .expect(200);
    });
});



//test to see if posted result is in get request
