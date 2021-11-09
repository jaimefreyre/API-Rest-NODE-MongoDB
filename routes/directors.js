var express = require('express');
var router = express.Router();
const Director = require('../model/directormodel.js');
const authMiddleware = require('../auth/auth.middleware');
const createError = require('http-errors');
const { jsonResponse } = require('../lib/jsonresponse');
const { create } = require('../model/directormodel');

router.get('/', authMiddleware.checkAuth, async function (req, res, next) {
    let results = {};

    try {
        results = await Director.find({}, 'name');
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
        return next(createError(400, `Error registering Director, provide all the information`));
    } else {
        const director = new Director({ name });

        try {
            await director.save();

            res.json(jsonResponse(200, {
                message: "Director added successfully"
            }));
        } catch (ex) {
            console.log(ex);
            next(createError(500, `Error trying to register the Directors. Try again`));
        }

    }
});

router.get('/:idDirector', authMiddleware.checkAuth, async function (req, res, next) {
    let results;

    const { idDirector } = req.params;

    if (!idDirector) return next(createError(400, `No Id provided`));

    try {
        results = await Director.findById(req.params.idDirector, 'name');
    } catch (ex) {
        next(createError(500, `Id incorrect. Try again`));
    }

    res.json(jsonResponse(200,
        results));
});

router.patch('/:idDirector', authMiddleware.checkAuth, async function (req, res, next) {
    let update = {};

    const { idDirector } = req.params;
    const { name } = req.body;



    if (!idDirector) return next(createError(400, `No Director id provided`));

    if (!name) return next(createError(400, `No Director information found to update`));

    if (name) update['name'] = name;


    try {
        await Director.findByIdAndUpdate(idDirector, update);

        res.json(jsonResponse(200, {
            message: `Director ${idDirector} updated successfully`
        }))
    } catch (ex) {
        return next(createError(500, `Error trying to update Director ${idDirector}`))
    }

});

router.delete('/', authMiddleware.checkAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) return next(createError(400, `No id provided`));

    try {
        const result = await Director.findByIdAndDelete(id);

        if (!result) return next(createError(400, `The Director to delete does not exist`));
    } catch (ex) {
        next(createError(500, `Error trying to delete Director ${id}`));
    }

    res.json(jsonResponse(200, {
        message: `Director ${id} deleted successfully`
    }))

});


module.exports = router;