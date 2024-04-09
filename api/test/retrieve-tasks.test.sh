source colors.sh

echo -e "${blue}TEST retrieve-profiles${reset}"

echo
echo -e "${tomato}CASE failure on incorrect token${reset}"

curl 'http://localhost:8000/tasks/null/null/' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWRhNDU4NzNmNjY2MDYxYmM1NGNmMWIiLCJpYXQiOjE3MDk3NDg5MTgsImV4cCI6MTcwOTc1MjUxOH0.nJIF3eLkGStUpXhVbm-5rsRgw53re6_M1ghCklF3Ycc' \
-v