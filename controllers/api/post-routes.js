const router = require('express').Router();
const { Post, User } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth')

// router.use(fileUpload({
//     limits: { fileSize: 250 * 250 * 250 },
//   }));

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
        .then(dbPostData => {
            console.log(dbPostData);
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

router.post('/', (req, res) => {
    console.log(req.body);
    Post.create({
        title: req.body.title,
        user_id: req.session.user_id,
        post_text: req.body.post_text,
        image: req.body.image,
    })
        .then(dbPostData => {
            // if (!dbPostData.image) {
            //     return res.status(400).send('No files uploaded');
            // }
            // let file = dbPostData.image;
            // let img_name = file.name;
            // if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
            //     file.mv('public/images/uploads/' + file.name, function (err) {
            //         if (err) {
            //             return res.status(500).send(err);
            //         }
            //     })
            // } else {
            //     console.log("This format is not allowed , please upload file with '.png','.gif','.jpg'");
            // }
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// router.post('/upload', function(req, res) {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No files were uploaded.');
//     }
  
//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     let sampleFile = req.files.sampleFile;
  
//     // Use the mv() method to place the file somewhere on your server
//     sampleFile.mv('../public/uploads/filename.jpg', function(err) {
//       if (err)
//         return res.status(500).send(err);
  
//       res.send('File uploaded!');
//     });
//   });

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