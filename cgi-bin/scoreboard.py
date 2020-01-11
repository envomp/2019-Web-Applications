#!/usr/bin/python3

print("Content-type: text/html")
print()

import cgi
import os
import re

formdata = cgi.FieldStorage()
player = ""
password = ""
multiplayerSize = ""
multiplayerRule = ""
hostMessage = ""

if "multiplayer" in formdata.keys():
    key = formdata["multiplayer"].value
    password = '<span id="gameId" style="display: none">' + key + '</span>'
    if os.path.isfile(key + ".txt"):
        player = '<span id="playerId" style="display: none">' + '2' + '</span>'
        with open(key + ".txt") as f:
            multiplayerSize, multiplayerRule = f.readline().split(",")
        f.close()
    else:
        if "size" in formdata.keys():
            multiplayerSize = formdata["size"].value
        if "rule" in formdata.keys():
            multiplayerRule = formdata["rule"].value
        player = '<span id="playerId" style="display: none">' + '1' + '</span>'
        hostMessage = '<h1>You are hosting at ' + key + '</h1>'
        f = open(key + ".txt", "w+")
        f.write(multiplayerSize + "," + multiplayerRule)
        f.close()

if "multiplayerResult" in formdata.keys():
    key = formdata["multiplayerResult"].value
    last_line = []
    with open(key + ".txt") as f:
        lines = f.read().splitlines()
        last_line.append(lines[-1])
    if key in last_line[0]:
        f = open("scoreboard.txt", "a+")
        game, person1, score1, elapsed1, timestamp1, size1, rule1 = last_line[0].split(",")
        person, score, elapsed, timestamp, size, rule = formdata["multiplayerScore"].value.split(",")
        f.write("\n" + person + "/" + person1 + "," + score + "/" + score1 + "," + elapsed + "/" + elapsed1 + "," + timestamp + "," + size + "," + rule)
        f.close()
    else:
        f = open(key + ".txt", "a+")
        f.write("\n" + key + "," + formdata["multiplayerScore"].value)
        f.close()


def wholeOrdeal():
    filepath = 'scoreboard.txt'
    if "score" in formdata.keys():
        f = open(filepath, "a+")
        f.write("\n" + formdata["score"].value)
        f.close()
    score_table = ""
    with open(filepath) as fp:
        for line in fp:
            if line:
                person, score, elapsed, total, size, rule = line.split(",")
                score_table += "<tr>"
                score_table += "<td>" + person + "</td>"
                score_table += "<td>" + score + "</td>"
                score_table += "<td>" + elapsed + "</td>"
                score_table += "<td>" + total + "</td>"
                score_table += "<td>" + size + "</td>"
                score_table += "<td>" + rule + "</td>"
                score_table += "</tr>"
    f = open('../prax2/index.html', 'r')
    template = f.read()
    f.close()
    if multiplayerSize and multiplayerRule:
        template = template.replace("startGame()", "addTable(" + multiplayerSize + ", " + multiplayerRule + ")").replace("Start a new game", "Generate board")
        template = re.sub(r'<span(.+\s)+</span>', '', template)

    template = template.replace("<!--Table-->", score_table).replace("<!--Player-->", player).replace("<!--Pass-->", password).replace("<!--Host-->", hostMessage)
    print(template)


wholeOrdeal()
