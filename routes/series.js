var express = require('express');
var router = express.Router();
const Serie = require('../model/seriemodel.js');
const authMiddleware = require('../auth/auth.middleware');
const createError = require('http-errors');
const { jsonResponse } = require('../lib/jsonresponse');
const { create } = require('../model/seriemodel');

router.get('/', authMiddleware.checkAuth, async function (req, res, next) {
    let results = {};

    try {
        results = await Serie.find({});
        // results = await Serie.find({})
            // .populate({ 
            //     path: 'temporadas', populate: { path: 'episodios', populate: {path: 'director'} } 
            //  })
            // .populate({
            //     path: 'temporadas', populate: { path: 'episodios', populate: {path: 'reparto'} }
            // });

    } catch (ex) {
        next(createError(400, `Error fetching the results`))
    }

    res.json(jsonResponse(200, {
        results
    }));
});

router.post('/', authMiddleware.checkAuth, async function (req, res, next) {
    console.log(req.body);
    const { title, genro } = req.body;

    if (!title, !genro) {
        return next(createError(400, `Error registering Serie, provide all the information`));
    } else {
        const serie = new Serie({ title, genro});

        try {
            await serie.save();

            res.json(jsonResponse(200, {
                message: "serie added successfully"
            }));
        } catch (ex) {
            console.log(ex);
            next(createError(500, `Error trying to register the series. Try again`));
        }

    }
});

router.get('/:idSerie', authMiddleware.checkAuth, async function (req, res, next) {
    let results;

    const { idSerie } = req.params;

    if (!idSerie) return next(createError(400, `No Id provided`));

    try {
        results = await Serie.findById(req.params.idSerie, 'name');
    } catch (ex) {
        next(createError(500, `Id incorrect. Try again`));
    }

    res.json(jsonResponse(200,
        results));
});

router.patch('/:idSerie', authMiddleware.checkAuth, async function (req, res, next) {
    let update = {};

    const { idSerie } = req.params;
    const { title, genro, temporada } = req.body;



    if (!idSerie) return next(createError(400, `No Serie id provided`));

    if (!title) return next(createError(400, `No Serie information found to update`));

    if (title) update['title'] = title;
    if (genro) update['genro'] = genro;
    if (temporada) update['temporada'] = temporada;


    try {
        await Serie.findByIdAndUpdate(idSerie, update);

        res.json(jsonResponse(200, {
            message: `Serie ${idSerie} updated successfully`
        }))
    } catch (ex) {
        return next(createError(500, `Error trying to update Serie ${idSerie}`))
    }

});

router.delete('/', authMiddleware.checkAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) return next(createError(400, `No id provided`));

    try {
        const result = await Serie.findByIdAndDelete(id);
        if (!result) return next(createError(400, `The Serie to delete does not exist`));
    } catch (ex) {
        next(createError(500, `Error trying to delete Serie ${id}`));
    }

    res.json(jsonResponse(200, {
        message: `Serie ${id} deleted successfully`
    }))

});


module.exports = router;