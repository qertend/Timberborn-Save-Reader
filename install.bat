@echo off
::check if Nodejs is already installed
winget list > .\winList
find /i "Node.js" .\winList > nul
IF ERRORLEVEL 1 ( goto installNode ) ELSE ( goto nodeInstalled )

::install nodejs using winget
:installNode
echo Node.js not found, installing...
winget install "Node.js"
goto finish

:nodeInstalled
echo Node.js is already installed, exiting...

::clean up temp files and exit
:finish
del .\winList
pause
exit