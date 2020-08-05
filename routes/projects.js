var data = require('../data-store');
var projects = data.getProjects();
var router = require('express').Router();

router.get('/projects', (req, res, next) => {
    const projectsOrdered = projects.sort((a, b) => a.id - b.id)
    res.statusCode(200).send(projects);
})

router.get('/projects/:id', (req, res, next) => {
    const id = req.params.id;
    const project = projects.find((project) => project.id === id);
    if (project) {
        res.statusCode(200).send(project)
    } else {
        res.statusCode(404).send({message: 'No Project Found'});
    }
})

router.get('/projects/active', (req, res, next) => {
    const projects = sortActive(projects);
    res.statusCode(200).send(projects);
})

function sortActive(projects) {
    const myProjects = [...projects];
    const result = [];
    for (let i = 0; i < myProjects.length; i++) {
        const elementI = myProjects[i];
        for (let j = i+1; j < myProjects.length; j++) {
            const elementJ = myProjects[j];
            if (elementJ.id < elementI.id) {
                let aux = {...elementI};
                myProjects[i] = myProjects[j];
                myProjects[j] = aux;
            }
        }
        if (elementI.isActive) {
            result.push(elementI);
        }
    }
    return result;
}

module.exports = router;
