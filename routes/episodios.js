var express = require('express');
var router = express.Router();
const Episodio = require('../model/episodiomodel.js');
const authMiddleware = require('../auth/auth.middleware');
const createError = require('http-errors');
const { jsonResponse } = require('../lib/jsonresponse');
const { create } = require('../model/episodiomodel');

router.get('/', authMiddleware.checkAuth, async function (req, res, next) {
    let results = {};

    try {
        results = await Episodio.find({}).populate('reparto').populate('director').populate('serie');
    } catch (ex) {
        next(createError(400, `Error fetching the results`))
    }

    res.json(jsonResponse(200, {
        results
    }));
});

router.get('/episodioxserie', authMiddleware.checkAuth, async function (req, res, next) {
    console.log(req.body);
    // const { title, reparto, director, serie, temporada, estreno } = req.body;
    const { serieid } = req.body;
    let results = {};

    try {
        results = await Episodio.find({serie: serieid}).populate('reparto').populate('director').populate('serie');
    } catch (ex) {
        next(createError(400, `Error fetching the results`))
    }

    res.json(jsonResponse(200, {
        results
    }));
});

router.get('/episodioxserieytemporada', authMiddleware.checkAuth, async function (req, res, next) {
    console.log(req.body);
    // const { title, reparto, director, serie, temporada, estreno } = req.body;
    const { temporada1, serieid } = req.body;
    let results = {};

    try {
        results = await Episodio.find({ temporada: temporada1, serie: serieid }).populate('reparto').populate('director').populate('serie');
    } catch (ex) {
        next(createError(400, `Error fetching the results`))
    }

    res.json(jsonResponse(200, {
        results
    }));
});

router.post('/', authMiddleware.checkAuth, async function (req, res, next) {
    console.log(req.body);
    const { title, reparto, director, serie, temporada, estreno } = req.body;

    if (!title, !reparto, !serie, !temporada, !director) {
        return next(createError(400, `Error registering Episodio, provide all the information`));
    } else {
        const episodio = new Episodio({ title, reparto, director, serie, temporada, estreno });

        try {
            await episodio.save();

            res.json(jsonResponse(200, {
                message: "episodio added successfully"
            }));
        } catch (ex) {
            console.log(ex);
            next(createError(500, `Error trying to register the episodios. Try again`));
        }

    }
});

router.get('/:idEpisodio', authMiddleware.checkAuth, async function (req, res, next) {
    let results;

    const { idEpisodio } = req.params;

    if (!idEpisodio) return next(createError(400, `No Id provided`));

    try {
        results = await Episodio.findById(req.params.idEpisodio, 'name');
    } catch (ex) {
        next(createError(500, `Id incorrect. Try again`));
    }

    res.json(jsonResponse(200,
        results));
});

router.patch('/:idEpisodio', authMiddleware.checkAuth, async function (req, res, next) {
    let update = {};

    const { idEpisodio } = req.params;
    const { title, genro, reparto, director, estreno } = req.body;



    if (!idEpisodio) return next(createError(400, `No Episodio id provided`));

    if (!title) return next(createError(400, `No Episodio information found to update`));

    if (title) update['title'] = title;
    if (genro) update['genro'] = genro;
    if (reparto) update['reparto'] = reparto;
    if (director) update['director'] = director;
    if (estreno) update['estreno'] = estreno;


    try {
        await Episodio.findByIdAndUpdate(idEpisodio, update);

        res.json(jsonResponse(200, {
            message: `Episodio ${idEpisodio} updated successfully`
        }))
    } catch (ex) {
        return next(createError(500, `Error trying to update Episodio ${idEpisodio}`))
    }

});

router.delete('/', authMiddleware.checkAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) return next(createError(400, `No id provided`));

    try {
        const result = await Episodio.findByIdAndDelete(id);

        if (!result) return next(createError(400, `The Episodio to delete does not exist`));
    } catch (ex) {
        next(createError(500, `Error trying to delete Episodio ${id}`));
    }

    res.json(jsonResponse(200, {
        message: `Episodio ${id} deleted successfully`
    }))

});


module.exports = router;