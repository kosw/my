// routes/index.js

module.exports = function(app, Book)
{
	// GET ALL BOOKS
	app.get('/api/books', function (req, res){
		Book.find(function (err, books){
			if(err)
				return res.status(500).send({error: 'database failure'});
			res.json(books);
		})
	})

	// GET SINGLE BOOK
	app.get('/api/books/:book_id', function (req, res){
		Book.findOne({_id:req.params.book_id}, function (err, book){
			if(err)
				return res.status(500).json({error: err});
			if(!book) 
				return res.status(404).json({error: 'book not found'});
			res.json(book);
		})
	})

	// GET BOOK BY AUTHOER
	app.get('/api/books/author/:author', function (req, res){
		// find메소드에서 첫번 째 인자는 query를 , 두 번째 인자는 projection 전달 
		Book.find({author: req.params.author}, {_id: 0, title: 1, published_data: 1}, function(err, books){
			if(err)
				return res.status(500).json({error: err});
			if(books.length === 0)
				return res.status(404).json({error: 'book not found'});
			res.json(books);
		})
	})

	// CREATE BOOK
	app.post('/api/books', function (req, res){
		var book = new Book();
		book.title = req.body.title;
		book.author = req.body.author;
		book.published_date = new Date(req.body.published_date);

		book.save(function(err){
			if(err){
				console.error(err);
				res.json({result: 0});
				return;
			}

			res.json({result: 1});
		});
	})

	// UPDATE THE BOOK
	app.put('/api/books/:book_id', function (req, res){
		Book.findById(req.params.book_id, function (err, book){
			if(err)
				return res.status(500).json({error: 'database failure'});
			if(!book)
				return res.status(404).json({error: 'book not found '});

			if(req.body.title) 
				book.title = req.body.title;
			if(req.body.author)
				book.author = req.body.author;
			if(req.body.published_data 
				book.published_data = req.body.published_data;

			book.save(function (err){
				if(err)
					res.status(500).json({error: 'failed to update'});
				res.json({message: 'book updated'});
			})
		})
	})

	// DELETE BOOK
	app.delete('/api/books/:book_id', function (req, res){
	    Book.remove({ _id: req.params.book_id }, function(err, output){
	        if(err) return res.status(500).json({ error: "database failure" });

	        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
	        if(!output.result.n) return res.status(404).json({ error: "book not found" });
	        res.json({ message: "book deleted" });
	        */

	        res.status(204).end();
	    })
	})
}