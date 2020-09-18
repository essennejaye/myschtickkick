const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_text',
            'title',
            'image',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username', 'email']
            }
        ]
    })
        .then(async dbPostData => {
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// currently non user find one not implemented
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_text',
            'title',
            'image',
            'created_at',
        ],
        include: [
            {
                model: User,
                attributes: ['username', 'email']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

const PlaceholderImageRelUrl = "images/assets/msk_no_image.jpg";
// add array of mimetypes for cleaner checking
const MimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
// add var for startsWith to avoid hardcoding inside of function
const MimeHeaderSkip = "data:".length;

function getMimeTypeIndex(dataurl) {
    //TODO - this is case sensitive, but we don't want to call toLower on dataurl
    for (var i = 0; i < MimeTypes.length; ++i) {
        var mime = MimeTypes[i];
        // check for mime type
        if (dataurl.startsWith(mime, MimeHeaderSkip))
            return i;
    }
    return -1;
}

router.post('/', withAuth, (req, res) => {
    var url = req.body.image;
    if (!url) {
        url = PlaceholderImageRelUrl;
    }
    else {
        if (getMimeTypeIndex(url) === -1) {
            return res.status(500).send({ message: `Cannot upload unsupported type`});
        }
    }
    Post.create({
        title: req.body.title,
        user_id: req.session.user_id,
        post_text: req.body.post_text,
        // write image file  directly to database to avoid non persistent storage on Heroku
        image: url
    })
        .then(dbPostData => {
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            post_text: req.body.post_text,
            // image currently not being edited
            image: req.body.image
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;