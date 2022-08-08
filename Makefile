deploy:
	git pull
	git checkout production
	git merge main
	sudo rm -rf node_modules package-lock.json
	npm install
	git add package-lock.json
	echo "deploy successfully"
	git commit -m "deploy successfully"
	git push
