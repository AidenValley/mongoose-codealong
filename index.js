const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./schemas/post');
const User = require('./schemas/user');
const { CommentModel } = require('./schemas/comment');

const mongoDb = 'mongodb://127.0.0.1/mongoose-codealong';
mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false }));


// mongoose fetch statements
// app.get('/', (req, res) => {
//     const bobby = new User({
//         name: 'Robert',
//         email: 'Bobby@test.com',
//         meta: {
//             age: 30,
//             website: 'https://chris.me'
//         }
//     });

//     bobby.save((err) => {
//         if (err) return console.log(err);
//         console.log('User Created!');
//     });

//     res.send(bobby.sayHello());
// })

app.get('/', (req, res) => {
    res.json({
        message: 'welcome to our API'
    })
})

app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => {
        consoel.log('error', error);
        res.json({ message: "Error occurred, please try again"});
    })
})

app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// POST route for creating users
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
        .then(foundUser => {
            console.log('User found', foundUser);
            User.findOneAndUpdate({ email: req.params.email },
                {
                    name: req.body.name ? req.body.name : foundUser.name,
                    email: req.body.email ? req.body.email : foundUser.email,
                    meta: {
                        age: req.body.age ? req.body.age : foundUser.age,
                        website: req.body.website ? req.body.website : foundUser.website
                    }
                })
                .then(user => {
                    console.log('User was updated', user);
                    res.redirect(`/users/${req.params.email}`)
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })
});

app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

 // ================ POSTS ROUTES ========================

 app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});

app.get('/posts/:title', (req, res) => {
    console.log('find posts by', req.params.title)
    Post.findOne({
        title: req.params.title
    })
    .then(post => {
        console.log('Here is the post', post.title);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// POST route for creating posts
app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/posts/:title', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ body: req.params.body })
        .then(foundPost => {
            console.log('Post found', foundPost);
            Post.findOneAndUpdate({ body: req.params.body },
                {
                    title: req.body.title ? req.body.title : foundPost.title,
                    body: req.body.body ? req.body.body : foundPost.body,
                })
                .then(post => {
                    console.log('Post was updated', post);
                    res.redirect(`/posts/${req.params.body}`)
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })
});

app.delete('/posts/:title', (req, res) => {
    Post.findOneAndRemove({ body: req.params.body })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.body} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// ================ COMMENTS ROUTES ========================

app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});

app.get('/comments/:header', (req, res) => {
    console.log('find comments by', req.params.header)
    Comment.findOne({
        header: req.params.header
    })
    .then(post => {
        console.log('Here is the comment', comment.header);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.post('/comments', (req, res) => {
    Comment.create({
        header: req.body.header,
        content: req.body.content,
    })
    .then(comment => {
        console.log('New post =>>', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/comments/:header', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ header: req.params.header })
        .then(foundComment => {
            console.log('Post found', foundComment);
            Post.findOneAndUpdate({ content: req.params.content },
                {
                    header: req.body.header ? req.body.header : foundComment.header,
                    content: req.body.content ? req.body.content : foundComment.content,
                })
                .then(comment => {
                    console.log('Post was updated', comment);
                    res.redirect(`/posts/${req.params.content}`)
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })
});

app.delete('/comments/:header', (req, res) => {
    Comment.findOneAndRemove({ header: req.params.header })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.content} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// app.get('/findAll', (req, res) => {
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findById/:id', (req, res) => {
//     User.findById(req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })




    //find by Id without the findByID command, not ideal
    // User.find({_id: mongoose.Types.ObjectId(req.params.id)}, (err, users) => {
    //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
    //     res.send(users);
    // })
// })

// app.get('/findByEmail/:email', (req, res) => {
//     User.findOne({ email: req.params.email }, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })

//Mongoose create statements
// creating users directly form model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using new USer and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })
// Comment.create({
//     header: 'Header Comment',
//     content: 'That is Dope'
// })

// const newComment = new Comment({
//     header: 'created using new newComment and Save()',
//     content: 'That is Dope again'
// });

// newComment.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })
// Creating a simple post document in the post collection
// Post.create({
//     content: 'This ia pst content...'
// });

// Mongoose update statements

// User.updateOne({name: 'Robert'}, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if(err) return console.log(err);
//     console.log(`updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`)
// });

// Returns full object prior to update
// User.findOneAndUpdate({name: 'Robert'},
// {
//     meta: {
//         age: 61,
//         website: 'somethingNew.com'
//     }
// }, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user);
// })

// mongoose delete statements(deletes all that match)
// User.remove({name: 'Robert'}, (err) => {
//     if (err) return console.log(err)
//     console.log('user record deleted');
// })
// finds first instance of chris and deletes it
// User.findOneAndRemove({name: 'Chris'}, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user);
// })

// Post schema with association to comments

// const newPost = new Post({
//     title: " our first post",
//     body: 'Some body text for our post',
// })

// newPost.comments.push({
//     header: "our first comment",
//     content: 'this is my comment text',
// })

// newPost.save(function(err) {
//     if (err) return console.log(err)
//     console.log(`Created post`);
// })

// const refPost = new Post({
//     title: 'Post with ref to comments',
//     body: 'Body for ref by comments',
// });

// const refComment = new CommentModel({
//     header: 'Our ref comment',
//     content: 'Some comment content'
// });
// refComment.save();

// refPost.comments.push(refComment);
// refPost.save();


app.listen(8000, () => {
    console.log('Running port 8000')
});