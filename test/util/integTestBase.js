const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect   = require('chai').expect;

chai.use(chaiHttp);
const apiURL    = 'http://localhost:8000';
const dummyData = require("./test-data");
/**
 * Integration test bootstraping to avoid repeating ourselves testing
 * booth apis, in the end the booth are the same :D
 * @param {} server 
 */
module.exports = (server) => {

    return () => {
        before((done) => {
            server.start(done)
        });

        describe("Api /tasks POST",() => {
            it("should insert a task", (done) => {
                chai.request(apiURL)
                    .post('/tasks')
                    .send(dummyData.POST)
                    .end(function(err,res) {
                        //console.log(res.body)
                        expect(res).to.have.status(201);
                        done();
                    });
            });
        });

        describe("Api /tasks GET",() => {
            it("should find All tasks", (done) => {
                chai.request(apiURL)
                    .get('/tasks')
                    .end(function(err,res) {
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });

        describe("Api /tasks/task_id GET",() => {

            it("should be able to detect an 404 error",(done) => {
                chai.request(apiURL)
                    .get('/tasks/non-existing-id')
                    .end(function(err,res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });

            it("should be able to find a task by Id",(done) => {
                let data = dummyData.GET_ONE
                chai.request(apiURL)
                    .post('/tasks')
                    .send(data.record)
                    .then(function(err,res) {
                        chai.request(apiURL)
                            .get(`/tasks/${data.id}`)
                            .end(function(err,res) {
                                expect(res).to.have.status(200);
                                //FIXME COMPARE FIELDS
                                done();
                            });
                    });
         
            })
        });

        describe("Api /tasks/task_id PUT",() => {
            it("should be able to update a task by Id",(done) => {
                let data = dummyData.PUT
                chai.request(apiURL)
                    .post('/tasks')
                    .send(data.record)
                    .then(function(err,res) {
                        chai.request(apiURL)
                            .put(`/tasks/${data.id}`)
                            .send(data.update)
                            .end(function(err,res) {
                                expect(res).to.have.status(200);
                                 //FIXME COMPARE FIELDS
                                done();
                            });
                    });
            })
        });

        describe("Api /tasks/task_id DELETE",() => {
            it("should be able to delete a task by Id",(done) => {
                let data = dummyData.DESTROY
                chai.request(apiURL)
                    .post('/tasks')
                    .send(data.record)
                    .then(function(err,res) {
                        chai.request(apiURL)
                            .delete(`/tasks/${data.id}`)
                            .end(function(err,res) {
                                expect(res).to.have.status(200);
                                //FIXME COMPARE FIELDS
                                done();
                            });
                    });
            })
        });

        after((done) => {
            server.stop()
            done()
        });
    }
};
