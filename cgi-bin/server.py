#!/usr/bin/python3

import cgi

print("Content-type: text/html")
print()

formdata = cgi.FieldStorage()

if "multiplayer" in formdata.keys():
    key = formdata["multiplayer"].value
    last_line = []
    with open(key + '.txt') as f:
        lines = f.read().splitlines()
        last_line.append(lines[-1])

    if "cards" in formdata.keys() and "player" in formdata.keys():
        newCards = formdata["cards"].value
        newPlayer = formdata["player"].value
        f = open(key + '.txt', "a+")
        f.write("\n" + newPlayer + "," + newCards)
        f.close()
        print({})
    else:
        cards = last_line[0].split(",")
        player = cards.pop(0)
        hashmap = {"playerId": player, "cards": cards}
        print(hashmap)
