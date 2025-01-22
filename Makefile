.PHONY: create-new-book
create-new-book:
	@read -p "Enter book title: " title; \
	mkdir -p "books/$$title/assets"; \
	touch "books/$$title/assets/README.md"; \
	echo "# $$title の画像ファイル等を配置する" > "books/$$title/assets/README.md"; \
	cp "templates/template_note.md" "books/$$title/note.md";  \
	echo "Created book structure for '$$title':"
	@tree "books/$$title"

.PHONY: create-new-article
create-new-article:
	@read -p "Enter article title: " title; \
	mkdir -p "articles/$$title/assets"; \
	touch "articles/$$title/assets/README.md"; \
	echo "# $$title の画像ファイル等を配置する" > "articles/$$title/assets/README.md"; \
	cp "templates/template_note.md" "articles/$$title/note.md";  \
	echo "Created article structure for '$$title':"
	@tree "articles/$$title"

.PHONY: create-new-movie
create-new-movie:
	@read -p "Enter title: " title; \
	mkdir -p "movies/$$title"; \
	cp "templates/template_note.md" "movies/$$title/note.md";  
	@tree "movies" 

.PHONY: create-new-research
create-new-research:
	@read -p "Enter title: " title; \
	mkdir -p "researches/$$title"; \
	cp "templates/template_note.md" "researches/$$title/note.md";  
	@tree "researches" 
