deploy:
<<<<<<< HEAD
	rm -rf node_modules package-lock.json
	npm install
	rm -rf node_modules
	npm start
	git status 
	git add package-lock.json
	echo "deploy successfully"
	git commit -m "deploy successfully"
=======
	git pull
	git checkout production
	git merge main
	sudo rm -rf node_modules package-lock.json
	npm install
	git add package-lock.json
	echo "deploy successfully"
	git commit -m "deploy successfully"
	git push
	
>>>>>>> f3a329b154432725b17e18b226b7e9a6a628469a
