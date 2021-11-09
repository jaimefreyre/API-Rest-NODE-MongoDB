var express = require('express');
var router = express.Router();
const Actor = require('../model/actormodel.js');
const authMiddleware = require('../auth/auth.middleware');
const createError = require('http-errors');
const { jsonResponse } = require('../lib/jsonresponse');
const { create } = require('../model/actormodel');

router.get('/', authMiddleware.checkAuth, async function (req, res, next) {
    let results = {};

    try {
        results = await Actor.find({}, 'name');
    } catch (ex) {
        next(createError(400, `Error fetching the results`))
    }

    res.json(jsonResponse(200, {
        results
    }));
});

router.post('/', authMiddleware.checkAuth, async function (req, res, next) {
    console.log(req.body);
    const { name } = req.body;

    if (!name) {
        return next(createError(400, `Error registering Actor, provide all the information`));
    } else {
        const actor = new Actor({ name });

        try {
            await actor.save();

            res.json(jsonResponse(200, {
                message: "actor added successfully"
            }));
        } catch (ex) {
            console.log(ex);
            next(createError(500, `Error trying to register the actors. Try again`));
        }

    }
});

router.get('/:idActor', authMiddleware.checkAuth, async function (req, res, next) {
    let results;

    const { idActor } = req.params;

    if (!idActor) return next(createError(400, `No Id provided`));

    try {
        results = await Actor.findById(req.params.idActor, 'name');
    } catch (ex) {
        next(createError(500, `Id incorrect. Try again`));
    }

    res.json(jsonResponse(200,
        results));
});

router.patch('/:idActor', authMiddleware.checkAuth, async function (req, res, next) {
    let update = {};

    const { idActor } = req.params;
    const { name } = req.body;



    if (!idActor) return next(createError(400, `No Actor id provided`));

    if (!name) return next(createError(400, `No Actor information found to update`));

    if (name) update['name'] = name;
   

    try {
        await Actor.findByIdAndUpdate(idActor, update);

        res.json(jsonResponse(200, {
            message: `Actor ${idActor} updated successfully`
        }))
    } catch (ex) {
        return next(createError(500, `Error trying to update Actor ${idActor}`))
    }

});

router.delete('/', authMiddleware.checkAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) return next(createError(400, `No id provided`));

    try {
        const result = await Actor.findByIdAndDelete(id);

        if (!result) return next(createError(400, `The Actor to delete does not exist`));
    } catch (ex) {
        next(createError(500, `Error trying to delete Actor ${id}`));
    }

    res.json(jsonResponse(200, {
        message: `Actor ${id} deleted successfully`
    }))

});


module.exports = router;