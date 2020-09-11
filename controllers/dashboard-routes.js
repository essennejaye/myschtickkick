const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
        'image'
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('all-posts-admin', { 
          layout: 'dashboard',
          posts, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'post_text',
            'created_at',
            'image'
        ],
        include: [
            
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            const posts = dbPostData.get({ plain: true });
            res.render('edit-post', {
                posts,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
module.exports = router;
