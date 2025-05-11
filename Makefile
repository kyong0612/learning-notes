.PHONY: create-new-book
create-new-book:
	@read -p "Enter book title: " title; \
	read -p "Enter source URL: " url_input; \
	mkdir -p "books/$$title/assets"; \
	touch "books/$$title/assets/README.md"; \
	echo "# $$title の画像ファイル等を配置する" > "books/$$title/assets/README.md"; \
	sed -e "s/{{title}}/$$title/g" \
	    -e "s|{{source_url}}|$$url_input|g" \
	    -e "s/{{now}}/$(shell date +'%Y-%m-%d %H:%M:%S')/g" \
	    "templates/template_note.md" > "books/$$title/note.md";  \
	echo "Created book structure for '$$title':"
	tree "books/$$title"

.PHONY: create-new-article
create-new-article:
	@echo "Enter article title: "; \
	read title_input; \
	echo  "Enter source URL: "; \
	read url_input; \
	mkdir -p "articles/$$title_input/assets"; \
	touch "articles/$$title_input/assets/README.md"; \
	echo "# $$title_input の画像ファイル等を配置する" > "articles/$$title_input/assets/README.md"; \
	sed -e "s/{{title}}/$$title_input/g" \
	    -e "s|{{source_url}}|$$url_input|g" \
	    -e "s/{{now}}/$(shell date +'%Y-%m-%d %H:%M:%S')/g" \
	    "templates/template_note.md" > "articles/$$title_input/note.md";  \
	echo "Created article structure for '$$title_input':"; \
	tree "articles/$$title_input"

.PHONY: create-new-movie
create-new-movie:
	@read -p "Enter title: " title; \
	read -p "Enter source URL: " url_input; \
	mkdir -p "movies/$$title"; \
	sed -e "s/{{title}}/$$title/g" \
	    -e "s|{{source_url}}|$$url_input|g" \
	    -e "s/{{now}}/$(shell date +'%Y-%m-%d %H:%M:%S')/g" \
	    "templates/template_note.md" > "movies/$$title/note.md";  \
	tree "movies" 

.PHONY: create-new-research
create-new-research:
	@read -p "Enter title: " title; \
	read -p "Enter source URL: " url_input; \
	mkdir -p "researches/$$title"; \
	sed -e "s/{{title}}/$$title/g" \
	    -e "s|{{source_url}}|$$url_input|g" \
	    -e "s/{{now}}/$(shell date +'%Y-%m-%d %H:%M:%S')/g" \
	    "templates/template_note.md" > "researches/$$title/note.md";  \
	tree "researches" 
