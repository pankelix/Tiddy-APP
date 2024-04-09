source colors.sh

echo -e "${blue}TEST register-user${reset}"

echo
echo -e "${green}CASE success on correct credentials${reset}"

 curl 'http://localhost:8000/homes' \
 -H 'Content-Type: application/json' \
 -d '{ "name": "Man Sion", "email": "man@sion.com", "password": "123123123" }' \
 -v

echo
echo -e "${tomato}CASE failure on existing user${reset}"

 curl 'http://localhost:8000/homes' \
 -H 'Content-Type: application/json' \
 -d '{ "name": "La Casita", "email": "la@casita.com", "password": "123123123" }' \
 -v