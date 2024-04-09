source colors.sh

echo -e "${blue}TEST retrieve-profiles${reset}"

echo
echo -e "${tomato}CASE failure on incorrect token${reset}"

curl 'http://localhost:8000/profiles' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWRhNDU4NzNmNjY2MDYxYmM1NGNmMWIiLCJpYXQiOjE3MDkxNjM0MDQsImV4cCI6MTcwOTE2NzAwNH0.CB6vPB5pFCKhViEsEkba9larS6_QpsQaxVXrFZ3-XfY' \
-v