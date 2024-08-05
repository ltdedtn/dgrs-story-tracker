Welcome to my project for Phase 2 of MS learn  
The purpose of this application is to follow the stories produced by degenerous dao.  
The app tracks the information in these stories so that you have an edge during the weekly votes. Such as, which characters appear in which story parts and then using this information when it comes to current stories and weekly voting on them.  
For example you can look at a character you may have forgotten about, click on that character on the character page and then it will show you the stories that they have appeared in which may help your next vote.  

Setting up the sql server  
copy the sql query from the start of the repo and run it to generate the tables you can name the database whatever as you will need to change the connection string anyway.  
  
Backend -  
download visual studio with reqired add ons  
download .net version 8 sdk from https://dotnet.microsoft.com/en-us/download  
clone repo  
add an .env file generate a jwt key and update the key in appsettings.  
in the env file also add password for the db db_password=??? and update the connection string to match the sql server you are running  
  
Frontend -  
cd into the file, run (npm i, npm start/npm run build)  
  
Setting up the sql server  
copy the sql query from the start of the repo and run it to generate the tables you can name the database whatever as you will need to change the connection string anyway.  
