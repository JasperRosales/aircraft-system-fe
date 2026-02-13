init:
	@echo "Initializing project..."
	@npm install
	@npm run dev
	@echo "Project initialized successfully."

profile:
	@echo "Building profile..."
	@git config --global user.name "$(name)"
	@git config --global user.email "$(email)"
	@echo "Profile built successfully."

check-profile:
	@echo "Checking profile..."
	@git config --global user.name
	@git config --global user.email
	@echo "Profile checked successfully."

push:
	@echo "Pushing changes to remote repository..."
	@git add .
	@git commit -m "$(m)"
	@git push origin main
	@echo "Changes pushed successfully."

branch:
	@echo "Creating new branch..."
	@git checkout -b $(b)
	@echo "Branch '$(b)' created successfully."

merge:
	@echo "Merging branch to main..."
	@git checkout main
	@git merge $(b)
	@echo "Branch '$(b)' merged to main successfully."