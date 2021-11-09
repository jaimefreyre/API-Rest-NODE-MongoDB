var express = require('express');
var router = express.Router();
const Mongoose = require("mongoose");
const Pelicula = require('../model/peliculamodel.js');
const authMiddleware = require('../auth/auth.middleware');
const createError = require('http-errors');
const { jsonResponse } = require('../lib/jsonresponse');
const { create } = require('../model/peliculamodel');
// var Director = Mongoose.model('Director');
// var Actor = Mongoose.model('Actor');

router.get('/', authMiddleware.checkAuth, async function (req, res, next) {
    let results = {};

    try {
        results = await Pelicula.find({}).populate('reparto').populate('director'); 
    } catch (ex) {
        next(createError(400, `Error fetching the results`))
    }

    res.json(jsonResponse(200, {
        results
    }));
});

router.post('/', authMiddleware.checkAuth, async function (req, res, next) {
    console.log(req.body);
    const { title, genro, reparto, director, estreno } = req.body;

    if (!title, !genro, !reparto, !director) {
        return next(createError(400, `Error registering Pelicula, provide all the information`));
    } else {
        const pelicula = new Pelicula({ title, genro, reparto, director, estreno });

        try {
            await pelicula.save();

            res.json(jsonResponse(200, {
                message: "pelicula added successfully"
            }));
        } catch (ex) {
            console.log(ex);
            next(createError(500, `Error trying to register the peliculas. Try again`));
        }

    }
});

router.get('/:idPelicula', authMiddleware.checkAuth, async function (req, res, next) {
    let results;

    const { idPelicula } = req.params;

    if (!idPelicula) return next(createError(400, `No Id provided`));

    try {
        results = await Pelicula.findById(req.params.idPelicula, 'name');
    } catch (ex) {
        next(createError(500, `Id incorrect. Try again`));
    }

    res.json(jsonResponse(200,
        results));
});

router.patch('/:idPelicula', authMiddleware.checkAuth, async function (req, res, next) {
    let update = {};

    const { idPelicula } = req.params;
    const { title, genro, reparto, director, estreno } = req.body;



    if (!idPelicula) return next(createError(400, `No Pelicula id provided`));

    if (!title) return next(createError(400, `No Pelicula information found to update`));

    if (title) update['title'] = title;
    if (genro) update['genro'] = genro;
    if (reparto) update['reparto'] = reparto;
    if (director) update['director'] = director;
    if (estreno) update['estreno'] = estreno;


    try {
        await Pelicula.findByIdAndUpdate(idPelicula, update);

        res.json(jsonResponse(200, {
            message: `Pelicula ${idPelicula} updated successfully`
        }))
    } catch (ex) {
        return next(createError(500, `Error trying to update Pelicula ${idPelicula}`))
    }

});

router.delete('/', authMiddleware.checkAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) return next(createError(400, `No id provided`));

    try {
        const result = await Pelicula.findByIdAndDelete(id);

        if (!result) return next(createError(400, `The Pelicula to delete does not exist`));
    } catch (ex) {
        next(createError(500, `Error trying to delete Pelicula ${id}`));
    }

    res.json(jsonResponse(200, {
        message: `Pelicula ${id} deleted successfully`
    }))

});


module.exports = router;