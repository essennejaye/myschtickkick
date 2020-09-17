const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth')
const path = require('path');

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

// add array of mimetypes for cleaner checking
// add string of supported file extensions used in error feedback
const MimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
const SupportedImageExts = "'.png','.gif','.jpg','.jpeg'";
const PlaceholderImageRelUrl = "images/assets/msk_no_image.jpg";

function getLocalImagesFolder() {
    var localPath = path.join(__dirname, "..", "..", "public", "images");
    return localPath;
}

router.post('/', withAuth, (req, res) => {
    // console.log(req.body, req.files);
    var imageUrl = req.files ? 'images/uploads/' + req.files.image.name : PlaceholderImageRelUrl;
    var usePlaceholder = !req.files;
    Post.create({
        title: req.body.title,
        user_id: req.session.user_id,
        post_text: req.body.post_text,
        image: imageUrl
    })
        .then(dbPostData => {
            if (!dbPostData.image) {
                console.log('dbPostData failed 400: No files upload');
                return res.status(400).send('No files uploaded');
            }
            // if we reach here and are using the placeholder image,
            // there's no need to move anuthing, so return now.
            if (usePlaceholder) {
                return res.json(dbPostData);
            }
            // save mimetype into a local var for tests below
            let mimetype = req.files.image.mimetype;
            let mimeIndex = MimeTypes.indexOf(mimetype);
            // check for supported mime types
            if (mimeIndex !== -1) {
                let localPath = path.join(getLocalImagesFolder(), 'uploads', req.files.image.name);
                // console.log(`Image format OK, copying to ${localPath}`);
                req.files.image.mv(localPath, function (err) {
                    if (err) {
                        console.log(`Error ${err}`);
                        return res.status(500).send(err);
                    } //else {
                    //     console.log("Unknown error, file move must have failed");
                    // } 
                })
            } else {
                console.log(`Format '${mimetype}' is not allowed, please upload file with ${SupportedImageExts}`);
            }
            // console.log("Done moving image");
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