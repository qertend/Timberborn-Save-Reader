@ECHO OFF
::check if Nodejs is already installed
winget list > .\winList
FIND /i "Node.js" .\winList > NUL
IF ERRORLEVEL 1 ( GOTO installNode ) ELSE ( GOTO nodeInstalled )

::install nodejs using winget
:installNode
ECHO Node.js not found, installing...
winget install "Node.js"
::download node modules
npm i
::init Timberborn_save_location.txt
echo "C:/Users/[user]/Documents/Timberborn/Saves/" > ".\Timberborn_save_location.txt"
GOTO finish

:nodeInstalled
ECHO Node.js is already installed, exiting...

::clean up temp files and exit
:finish
DEL .\winList
PAUSE
EXIT