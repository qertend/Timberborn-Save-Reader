array = []
while True:
    line = input("next line: ")
    if line == "stop": break
    for i in line.split("•"):
        array.append(i.replace(" ", ""))

print("[", end="")
for i in array:
    print('"', i, '",', sep="", end=" ")

print("]")
