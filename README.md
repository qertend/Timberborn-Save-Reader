# Installing

After downloading and unpacking the .zip file, run `install.bat`.

It seems `install.bat` trips Avast's Behaviour shield protection

and potentially other antivirus software you'll either have to:

## 1:

Add `install.bat` as an exception to your antivirus software
  

## 2:

Run the commands listed below in the Timberborn save reader directory

#### install node JS

	winget install node.js

#### install node modules

	npm i

# Using the program
### First launch preparations

Before using the program for the first time, create a file called `Timberborn_save_location.txt` in the Timberborn save reader folder, and copy into it the path of the folder Timberborn uses to store the save files. It should look something like this:  
	
	C:/Users/[user]/Documents/Timberborn/Saves/

### Launching the program
Simply run `start.bat` to start the program
