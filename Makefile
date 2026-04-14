install:
	cd client && npm i

dev:
	cd client && npm run dev

build:
	cd client && npm run build

deploy:
	git branch -D gh-pages || true &&\
	git checkout -b gh-pages &&\
	make install &&\
	make build &&\
	mv ./client/build/* ./ &&\
	rm -rf ./client &&\
	git add --all &&\
	git commit -m "lol" &&\
	git push -f -u origin gh-pages &&\
	git checkout - &&\
	make install
