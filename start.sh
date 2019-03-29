sh -c 'cd ./frontend && yarn build && sudo cp -r build/* ../backend/public'
sh -c 'cd ./backend && yarn start'