#!/usr/bin/env python
with open("CHANGELOG.md") as changelog:
  lines = changelog.read().splitlines()

releaseSeen = False
for line in lines:
  if line.startswith("## "):
    if releaseSeen:
      break

    releaseSeen = True
  print(line)
