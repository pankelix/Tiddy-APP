source colors.sh

echo -e "${blue}TEST edit-template${reset}"

echo
echo -e "${green}CASE success on correct credentials${reset}"

 curl 'http://localhost:8000/templates/65d79ed43377222a97582a26/edit' \
 -X 'PATCH' \
 -H 'Content-Type: application/json' \
 -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWRhNDU4NzNmNjY2MDYxYmM1NGNmM2MiLCJpYXQiOjE3MDkzOTI5MzcsImV4cCI6MTcwOTM5NjUzN30.-iKG0BbmJYM6Y5bXL7YrU7AwthahgJS9u3LjXC4scWQ' \
 -d '{ "name": "Clean dishes", "periodicityNumber": "3", "periodicityRange": "week", "rooms": "['65d79ed33377222a97582a02', '65d79ed33377222a97582a04']", "points": "3" }' \
 -v