const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const data = require('../data-store');
const Promise = require('bluebird');
const should = chai.should();

chai.use(chaiHttp);

describe('express_basics', () => {

    it('Should return 200 for /projects', (done) => {
        chai.request(server)
            .get('/projects')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(data.getProjects());
                done()
            })
    });

    it('Should return 200 for /projects/active', (done) => {
        const activeProjects = data.getProjects().filter(p => p.isActive);
        chai.request(server)
            .get('/projects/active')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(activeProjects);
                done()
            })
    });

    it('Should return a 404 if the requested id is not present in data', done => {
        chai.request(server)
            .get('/projects/15')
            .then(response => {
                response.status.should.eql(404);
                response.body.should.eql({message : 'No Project Found'});
                done()
            })
    });


    it('Should return the correct data with status 200', done => {
        Promise
            .mapSeries([1, 2, 3], id => {
                return new Promise((resolve) => {
                    chai.request(server)
                        .get(`/projects/${id}`)
                        .then(response => {
                            resolve({id, response});
                        })
                })
            })
            .then(responses => {
                responses.forEach(({response, id}) => {
                    response.status.should.eql(200);
                    response.body.should.eql(data.getProjects()[id - 1]);
                });
                done()
            })
    })
});
